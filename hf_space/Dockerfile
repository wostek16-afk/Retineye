FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN pip install --no-cache-dir --timeout 600 \
    torch==2.2.2+cpu torchvision==0.17.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir \
    fastapi>=0.115.0 \
    uvicorn>=0.32.0 \
    pillow>=10.0.0 \
    pydantic>=2.0.0 \
    "numpy<2" \
    timm>=0.9.0 \
    huggingface_hub>=0.20.0

COPY app.py .

EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
