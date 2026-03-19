"""
Retineye — Backend IA pour HuggingFace Spaces
Le modèle est téléchargé automatiquement depuis le repo HuggingFace au démarrage.
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
from pydantic import BaseModel
from huggingface_hub import hf_hub_download

torch.set_num_threads(1)

MODEL_REPO = "Wostek162/retineye-v2"
MODEL_FILE = "best_model_v2.pth"
MODEL_PATH = "/tmp/best_model_v2.pth"
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
