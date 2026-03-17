"""
Retineye — Backend IA pour l'analyse de fond d'œil
Lance avec : uvicorn server:app --host 0.0.0.0 --port 8000

Placer best_model_v2.pth dans ce dossier (même répertoire que server.py).
"""

import os
import io
import base64
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Retineye AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_model_v2.pth")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None

# Préprocessing standard rétinopathie (ImageNet normalization, 224x224)
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


@app.on_event("startup")
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        print(f"⚠️  best_model_v2.pth introuvable dans {MODEL_PATH}")
        return
    try:
        model = torch.load(MODEL_PATH, map_location=device, weights_only=False)
        model.to(device)
        model.eval()
        print(f"✅ Modèle chargé depuis {MODEL_PATH} sur {device}")
    except Exception as e:
        print(f"❌ Erreur chargement modèle : {e}")


class AnalyzeRequest(BaseModel):
    image: str  # base64 (sans préfixe data:...)


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None, "device": str(device)}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé — placer best_model_v2.pth dans le dossier backend/")

    try:
        img_bytes = base64.b64decode(req.image)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        tensor = preprocess(img).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(tensor)
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
        raise HTTPException(status_code=500, detail=str(e))
