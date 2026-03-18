FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir \
    torch==2.2.2+cpu \
    torchvision==0.17.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir \
    fastapi>=0.115.0 \
    uvicorn>=0.32.0 \
    pillow>=10.0.0 \
    pydantic>=2.0.0 \
    "numpy<2" \
    timm>=0.9.0 \
    requests>=2.32.0

COPY backend/ .

EXPOSE 8080
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8080}"]
