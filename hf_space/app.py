"""
Retineye — Backend IA pour HuggingFace Spaces
Sert le frontend React buildé + l'API FastAPI sur le port 7860.
"""

import os
import io
import base64
import threading
from contextlib import asynccontextmanager

os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import torch
import torch.nn as nn
import torch.nn.functional as F
import timm
from torchvision import transforms
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from huggingface_hub import hf_hub_download

torch.set_num_threads(1)

MODEL_REPO = "Wostek162/retineye-v2"
MODEL_FILE = "best_model_v2.pth"
STATIC_DIR = "/app/dist"
device = torch.device("cpu")
model = None

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

ICDR_LABELS = [
    "Pas de rétinopathie",
    "Rétinopathie légère",
    "Rétinopathie modérée",
    "Rétinopathie sévère",
    "Rétinopathie proliférante",
]

ICDR_FINDINGS = [
    [],
    ["Quelques microanévrismes", "Hémorragies ponctuelles mineures"],
    ["Microanévrismes multiples", "Hémorragies rétiniennes", "Exsudats durs"],
    ["Hémorragies sévères", "AMIR", "Anomalies veineuses en chapelet"],
    ["Néovascularisation", "Hémorragie prérétinienne", "Traction vitréorétinienne"],
]

EFFICIENTNET_BY_FEATURES = {
    1280: ["efficientnet_b0", "efficientnet_b1"],
    1408: ["efficientnet_b2"],
    1536: ["efficientnet_b3"],
    1792: ["efficientnet_b4"],
    2048: ["efficientnet_b5"],
}


class RetineyeModel(nn.Module):
    def __init__(self, backbone_name, in_features, hidden, num_classes):
        super().__init__()
        self.backbone = timm.create_model(backbone_name, pretrained=False, num_classes=0, global_pool="avg")
        self.head = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, hidden),
            nn.SiLU(),
            nn.Dropout(p=0.2),
            nn.Linear(hidden, num_classes),
        )

    def forward(self, x):
        return self.head(self.backbone(x))


def _build_and_load(state_dict):
    head1_w = state_dict.get("head.1.weight")
    head4_w = state_dict.get("head.4.weight")
    if head1_w is None or head4_w is None:
        raise ValueError("Clés head.1.weight / head.4.weight introuvables.")
    hidden = head1_w.shape[0]
    in_features = head1_w.shape[1]
    num_classes = head4_w.shape[0]
    candidates = EFFICIENTNET_BY_FEATURES.get(in_features, [])
    if not candidates:
        raise ValueError(f"Aucun backbone connu pour in_features={in_features}")
    for backbone_name in candidates:
        try:
            m = RetineyeModel(backbone_name, in_features, hidden, num_classes)
            m.load_state_dict(state_dict, strict=True)
            print(f"✅ Modèle chargé ({backbone_name}, hidden={hidden}, classes={num_classes})")
            return m
        except Exception as e:
            print(f"   ↳ {backbone_name} échoué : {e}")
    m = RetineyeModel(candidates[0], in_features, hidden, num_classes)
    m.load_state_dict(state_dict, strict=False)
    return m


def _load_model_sync():
    global model
    try:
        print("⬇️  Téléchargement du modèle depuis HuggingFace...")
        token = os.environ.get("HF_TOKEN", None)
        path = hf_hub_download(
            repo_id=MODEL_REPO,
            filename=MODEL_FILE,
            token=token,
            local_dir="/tmp",
        )
        print(f"✅ Modèle téléchargé : {path}")
        checkpoint = torch.load(path, map_location=device, weights_only=False)
        if not isinstance(checkpoint, dict):
            model = checkpoint.to(device)
        else:
            state_dict = (
                checkpoint.get("model_state_dict")
                or checkpoint.get("state_dict")
                or checkpoint.get("model")
                or checkpoint
            )
            model = _build_and_load(state_dict).to(device)
        model.eval()
        print("🚀 Modèle prêt !")
    except Exception as e:
        print(f"❌ Erreur chargement modèle : {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    t = threading.Thread(target=_load_model_sync, daemon=True)
    t.start()
    print("🔄 Chargement du modèle en arrière-plan...")
    yield


app = FastAPI(title="Retineye AI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    image: str


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle en cours de chargement — réessayez dans quelques secondes.")
    try:
        img_bytes = base64.b64decode(req.image)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        tensor = preprocess(img).unsqueeze(0).to(device)
        with torch.no_grad():
            outputs = model(tensor)
        if outputs.shape[-1] == 1:
            raw = max(0.0, min(4.0, outputs.squeeze().item()))
            icdr_level = round(raw)
            confidence = max(50, min(99, int(100 - abs(raw - icdr_level) * 40)))
        else:
            probs = F.softmax(outputs, dim=1)[0]
            icdr_level = int(probs.argmax().item())
            confidence = max(50, min(99, int(probs[icdr_level].item() * 100)))
        return {
            "icdr_level": icdr_level,
            "confidence": confidence,
            "findings": ICDR_FINDINGS[icdr_level],
            "notes": f"{ICDR_LABELS[icdr_level]}. Score de confiance : {confidence}%. Résultat indicatif — consultez un ophtalmologue.",
            "source": "local_model",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




# ─── RetinaRisk — Score Aspelund 2011 (Diabetologia 54:2525) ─────────────────
import math as _math
from pydantic import BaseModel as _BM
from typing import List as _List

class RetinaRiskRequest(_BM):
    hba1c: float
    duree_diabete: float
    tension_sys: float = 130.0
    sexe: str = "M"
    rd_presente: bool = False
    type_diabete: str = "DT2"
    hba1c_history: _List[float] = []

class RetinaRiskResponse(_BM):
    score_pct: int
    risk_level: str
    risque_1an_pct: float
    next_screening_months: int
    recommendation: str
    explanation: str
    factors: dict

@app.post("/retinarisk", response_model=RetinaRiskResponse)
def retinarisk(req: RetinaRiskRequest):
    t = max(0.5, float(req.duree_diabete))
    hba1c = float(req.hba1c)
    pas = float(req.tension_sys)
    sc = 0.194 if req.sexe == "M" else -0.194
    if req.type_diabete == "DT1":
        def S0(x): return _math.exp(-_math.exp(-7.849) * x**2.075)
        lc = (hba1c-8)*0.1851 + (pas-130)*0.007813 + (float(req.rd_presente)-0.52)*(1.10+sc)
    else:
        def S0(x): return max(0.001, _math.exp(-_math.exp(-4.88)*x**1.170)-0.052)
        lc = (hba1c-8)*0.380544 + (pas-130)*0.04308 + (float(req.rd_presente)-0.33)*(0.89+sc)
    s_t = S0(t)**_math.exp(lc)
    s_t1 = S0(t+1)**_math.exp(lc)
    r = max(0.0, min(100.0, (1-s_t1/max(s_t,1e-9))*100))
    fv = 1.0
    if len(req.hba1c_history)>=2:
        ah = req.hba1c_history+[hba1c]
        mh = sum(ah)/len(ah)
        sd = _math.sqrt(sum((x-mh)**2 for x in ah)/len(ah))
        if sd>0.5: fv = _math.exp(0.15*(sd-0.5))
    r = min(100.0, r*fv)
    if r<2.5:
        sp=int(r/2.5*30); rl="faible"; nm=24
        rc="Votre risque est faible. Un controle ophtalmologique tous les 24 mois est recommande."
        ex="Votre profil est associe a un risque faible de progression sur 12 mois."
    elif r<10.0:
        sp=30+int((r-2.5)/7.5*35); rl="modere"; nm=12
        rc="Un fond d'oeil annuel est recommande. Optimisez HbA1c < 7% et tension < 130/80 mmHg."
        ex="Votre profil presente un risque modere. Plusieurs facteurs peuvent etre optimises."
    else:
        sp=65+int(min((r-10.0)/20.0*35,35)); rl="eleve"; nm=6
        rc="Consultez un ophtalmologiste dans les 6 prochains mois. Controle glycemique urgent."
        ex="Votre profil indique un risque eleve. Une prise en charge rapprochee est necessaire."
    return RetinaRiskResponse(
        score_pct=max(0,min(100,sp)), risk_level=rl,
        risque_1an_pct=round(r,2), next_screening_months=nm,
        recommendation=rc, explanation=ex,
        factors={"hba1c":round(hba1c,1),"duree_diabete":round(t,1),
                 "tension_sys":round(pas),"type_diabete":req.type_diabete,
                 "rd_presente":req.rd_presente,"risque_ajuste_1an_pct":round(r,2)}
    )

# Servir le frontend React buildé — doit être en dernier
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=f"{STATIC_DIR}/assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        return FileResponse(f"{STATIC_DIR}/index.html")
