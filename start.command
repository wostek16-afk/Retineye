#!/bin/bash
# Double-clique sur ce fichier pour lancer Retineye

cd "$(dirname "$0")"

echo "=== Lancement de Retineye ==="

# Backend
cd backend
if [ ! -d "venv" ]; then
  echo "Installation des dépendances (1ère fois seulement)..."
  python3.12 -m venv venv
  source venv/bin/activate
  pip install fastapi uvicorn pillow pydantic numpy timm
  pip install torch torchvision
else
  source venv/bin/activate
fi

echo "Démarrage du backend IA..."
python3 server.py &
BACKEND_PID=$!

cd ..

echo "Démarrage de l'application web..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Retineye est lancé !"
echo "   → Ouvre http://localhost:5173 dans ton navigateur"
echo ""
echo "Appuie sur Entrée pour tout arrêter."
read

kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "Arrêté."
