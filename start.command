#!/bin/bash
# Double-clique sur ce fichier pour lancer Retineye

cd "$(dirname "$0")"

echo "=== Lancement de Retineye ==="

# Backend
cd backend
if [ ! -d "venv" ]; then
  echo "Installation des dépendances (1ère fois seulement, ~10 min)..."
  python3.12 -m venv venv
  source venv/bin/activate
  pip install fastapi uvicorn pillow pydantic "timm>=0.9.0"
  pip install torch torchvision
  pip install "numpy==1.26.4"
else
  source venv/bin/activate
fi

echo "Démarrage du backend IA..."
uvicorn server:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

echo "Démarrage de l'application web..."
npm run dev &
FRONTEND_PID=$!

# Ouvre le navigateur automatiquement après 3 secondes
sleep 3
open http://localhost:5173

echo ""
echo "✅ Retineye est lancé !"
echo "   → http://localhost:5173"
echo ""
echo "Appuie sur Entrée pour tout arrêter."
read

kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "Arrêté."
