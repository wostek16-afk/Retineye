# ── Étape 1 : build du frontend React ───────────────────────────────────────
FROM node:20-slim AS frontend

WORKDIR /frontend
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline 2>/dev/null || npm install

COPY index.html vite.config.js eslint.config.js ./
COPY src ./src
COPY public ./public 2>/dev/null || true

RUN npm run build
# Le résultat est dans /frontend/dist

# ── Étape 2 : image Python finale ───────────────────────────────────────────
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# PyTorch CPU (lourd, en premier pour le cache Docker)
RUN pip install --no-cache-dir --timeout 600 \
    torch==2.2.2+cpu torchvision==0.17.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Dépendances Python
RUN pip install --no-cache-dir \
    fastapi>=0.115.0 \
    uvicorn>=0.32.0 \
    pillow>=10.0.0 \
    pydantic>=2.0.0 \
    "numpy<2" \
    timm>=0.9.0 \
    huggingface_hub>=0.20.0 \
    aiofiles>=23.0.0

# Backend
COPY app.py .

# Frontend buildé
COPY --from=frontend /frontend/dist ./dist

EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
