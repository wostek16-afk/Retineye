#!/bin/bash
set -e

# Trouve Python 3.11
PY=""
for cmd in python3.11 python3 python; do
  if $cmd --version 2>&1 | grep -q "3\.11"; then
    PY=$cmd; break
  fi
done

if [ -z "$PY" ]; then
  echo "❌ Python 3.11 introuvable."
  echo "   Installe-le : brew install python@3.11"
  exit 1
fi

echo "✅ Python trouvé : $($PY --version)"

# Vérifie le modèle
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODEL="$SCRIPT_DIR/best_model_v2.pth"

if [ ! -f "$MODEL" ]; then
  echo ""
  echo "❌ Modèle introuvable : $MODEL"
  echo "   Copie ton fichier best_model_v2.pth dans ce dossier :"
  echo "   $(dirname "$MODEL")"
  exit 1
fi

echo "✅ Modèle trouvé : best_model_v2.pth"

# Crée le venv si besoin
VENV="$SCRIPT_DIR/venv"
if [ ! -d "$VENV" ]; then
  echo "⚙️  Création de l'environnement virtuel..."
  $PY -m venv "$VENV"
fi

source "$VENV/bin/activate"

# Vérifie et corrige NumPy (doit être < 2)
NUMPY_OK=$(python -c "import numpy; v=numpy.__version__; print('ok' if int(v.split('.')[0]) < 2 else 'bad')" 2>/dev/null || echo "missing")
if [ "$NUMPY_OK" != "ok" ]; then
  echo "⚙️  Correction de NumPy (downgrade vers numpy<2)..."
  pip install "numpy<2" -q
fi

# Installe les dépendances si besoin
if ! python -c "import torch" 2>/dev/null; then
  echo "⚙️  Installation des dépendances (peut prendre quelques minutes)..."
  pip install --upgrade pip -q
  pip install -r "$SCRIPT_DIR/requirements.txt" -q
  pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu -q
  echo "✅ Dépendances installées"
fi

echo ""
echo "🚀 Lancement du backend Retineye sur http://localhost:8000"
echo "   (Ctrl+C pour arrêter)"
echo ""

uvicorn server:app --host 0.0.0.0 --port 8000 --app-dir "$SCRIPT_DIR"
