"""
Retineye — Backend IA pour l'analyse de fond d'œil
Lance avec : uvicorn server:app --host 0.0.0.0 --port 8000

Placer best_model_v2.pth dans ce dossier (même répertoire que server.py).
"""

import os
import io
import base64
import threading
from contextlib import asynccontextmanager

# Réduire l'utilisation mémoire de PyTorch
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
import requests as http_client

torch.set_num_threads(1)

print("✅ Imports OK — démarrage FastAPI")

@asynccontextmanager
async def lifespan(app: FastAPI):
    t = threading.Thread(target=_load_model_sync, daemon=True)
    t.start()
    print("🔄 Thread chargement modèle lancé")
    yield

app = FastAPI(title="Retineye AI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_model_v2.pth")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
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

# Correspondance features → nom timm
EFFICIENTNET_BY_FEATURES = {
    1280: ["efficientnet_b0", "efficientnet_b1"],
    1408: ["efficientnet_b2"],
    1536: ["efficientnet_b3"],
    1792: ["efficientnet_b4"],
    2048: ["efficientnet_b5"],
}


class RetineyeModel(nn.Module):
    """Modèle custom : backbone EfficientNet (timm) + tête linéaire."""

    def __init__(self, backbone_name: str, in_features: int, hidden: int, num_classes: int):
        super().__init__()
        self.backbone = timm.create_model(
            backbone_name, pretrained=False, num_classes=0, global_pool="avg"
        )
        self.head = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, hidden),
            nn.SiLU(),
            nn.Dropout(p=0.2),
            nn.Linear(hidden, num_classes),
        )

    def forward(self, x):
        return self.head(self.backbone(x))


def _build_and_load(state_dict) -> nn.Module:
    """Reconstruit le modèle depuis le state dict en auto-détectant l'architecture."""
    # Dimensions de la tête
    head1_w = state_dict.get("head.1.weight")
    head4_w = state_dict.get("head.4.weight")

    if head1_w is None or head4_w is None:
        raise ValueError("Clés head.1.weight / head.4.weight introuvables dans le checkpoint.")

    hidden = head1_w.shape[0]       # ex. 512
    in_features = head1_w.shape[1]  # ex. 1536 (backbone output)
    num_classes = head4_w.shape[0]  # ex. 5

    candidates = EFFICIENTNET_BY_FEATURES.get(in_features, [])
    if not candidates:
        raise ValueError(f"Aucun backbone connu pour in_features={in_features}")

    for backbone_name in candidates:
        try:
            m = RetineyeModel(backbone_name, in_features, hidden, num_classes)
            m.load_state_dict(state_dict, strict=True)
            print(f"✅ Modèle chargé ({backbone_name}, hidden={hidden}, classes={num_classes}) sur {device}")
            return m
        except Exception as e:
            print(f"   ↳ {backbone_name} strict=True échoué : {e}")

    # Dernier recours : strict=False avec le premier candidat
    backbone_name = candidates[0]
    m = RetineyeModel(backbone_name, in_features, hidden, num_classes)
    missing, unexpected = m.load_state_dict(state_dict, strict=False)
    print(f"⚠️  Modèle chargé ({backbone_name}, strict=False) — manquants: {len(missing)}, inattendus: {len(unexpected)}")
    return m


def _load_model_sync():
    global model
    if not os.path.exists(MODEL_PATH):
        model_url = os.environ.get("MODEL_URL", "")
        if model_url:
            print(f"⬇️  Téléchargement du modèle depuis MODEL_URL…")
            try:
                hf_token = os.environ.get("HF_TOKEN", "")
                headers = {"Authorization": f"Bearer {hf_token}"} if hf_token else {}
                # requests gère les redirects HuggingFace→S3 correctement
                with http_client.get(model_url, headers=headers, stream=True, timeout=300) as resp:
                    resp.raise_for_status()
                    total = int(resp.headers.get("content-length", 0))
                    downloaded = 0
                    with open(MODEL_PATH, "wb") as f:
                        for chunk in resp.iter_content(chunk_size=8 * 1024 * 1024):
                            if chunk:
                                f.write(chunk)
                                downloaded += len(chunk)
                                if total:
                                    print(f"   {downloaded / total * 100:.0f}% ({downloaded // 1024 // 1024}MB / {total // 1024 // 1024}MB)")
                print(f"✅ Modèle téléchargé dans {MODEL_PATH}")
            except Exception as e:
                print(f"❌ Erreur téléchargement modèle : {e}")
                # Supprimer le fichier partiel si présent
                if os.path.exists(MODEL_PATH):
                    os.remove(MODEL_PATH)
                return
        else:
            print(f"⚠️  best_model_v2.pth introuvable. Définissez MODEL_URL + HF_TOKEN pour le téléchargement automatique.")
            return
    try:
        checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)

        # Cas 1 : modèle complet sauvegardé avec torch.save(model, ...)
        if not isinstance(checkpoint, dict):
            model = checkpoint.to(device)
            model.eval()
            print(f"✅ Modèle complet chargé sur {device}")
            return

        # Cas 2 : state dict (direct ou dans une clé connue)
        state_dict = (
            checkpoint.get("model_state_dict")
            or checkpoint.get("state_dict")
            or checkpoint.get("model")
            or checkpoint
        )

        model = _build_and_load(state_dict).to(device)
        model.eval()

    except Exception as e:
        print(f"❌ Erreur chargement modèle : {e}")



class AnalyzeRequest(BaseModel):
    image: str  # base64 (sans préfixe data:...)


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None, "device": str(device)}


@app.get("/debug/keys")
def debug_keys():
    """Retourne les clés + shapes pour identifier l'architecture."""
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=404, detail="Fichier modèle introuvable")
    checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
    if not isinstance(checkpoint, dict):
        return {"type": type(checkpoint).__name__}
    state_dict = (
        checkpoint.get("model_state_dict")
        or checkpoint.get("state_dict")
        or checkpoint.get("model")
        or checkpoint
    )
    head_shapes = {k: list(v.shape) for k, v in state_dict.items() if k.startswith("head.")}
    backbone_keys = [k for k in state_dict.keys() if k.startswith("backbone.")]
    return {
        "total_keys": len(state_dict),
        "head_shapes": head_shapes,
        "backbone_first_3": backbone_keys[:3],
        "backbone_last_3": backbone_keys[-3:],
    }


@app.post("/analyze-claude")
def analyze_claude(req: AnalyzeRequest):
    """Analyse via Claude API côté serveur — aucune clé requise côté client."""
    import requests as req_lib
    import json as json_lib

    api_key = os.environ.get("CLAUDE_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=503, detail="CLAUDE_API_KEY non configurée sur le serveur.")

    prompt = (
        "Analyze this retinal fundus photo for diabetic retinopathy using ICDR scale 0-4. "
        "Return ONLY valid minified JSON with these keys: icdr_level (int 0-4), "
        "findings (short French string array max 4 items), confidence (int 50-99), "
        "notes (one French patient-facing sentence). No markdown no extra text."
    )
    body = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 350,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": req.image}},
                {"type": "text", "text": prompt},
            ],
        }],
    }
    try:
        resp = req_lib.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"},
            json=body,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        txt = "".join(b.get("text", "") for b in data.get("content", []))
        parsed = json_lib.loads(txt.replace("```json", "").replace("```", "").strip())
        parsed["source"] = "claude"
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur Claude API : {e}")


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Modèle non chargé — placer best_model_v2.pth dans le dossier backend/",
        )
    try:
        img_bytes = base64.b64decode(req.image)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        tensor = preprocess(img).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(tensor)

        # Régression (sortie scalaire) ou classification (5 logits)
        if outputs.shape[-1] == 1:
            raw = outputs.squeeze().item()          # score continu ~0-4
            raw = max(0.0, min(4.0, raw))
            icdr_level = round(raw)
            # Confiance : plus on est proche d'un entier, plus c'est sûr
            confidence = int(100 - abs(raw - icdr_level) * 40)
            confidence = max(50, min(99, confidence))
        else:
            probs = F.softmax(outputs, dim=1)[0]
            icdr_level = int(probs.argmax().item())
            confidence = int(probs[icdr_level].item() * 100)
            confidence = max(50, min(99, confidence))

        return {
            "icdr_level": icdr_level,
            "confidence": confidence,
            "findings": ICDR_FINDINGS[icdr_level],
            "notes": (
                f"{ICDR_LABELS[icdr_level]}. "
                f"Score de confiance : {confidence}%. "
                "Résultat indicatif — consultez un ophtalmologue."
            ),
            "source": "local_model",
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
