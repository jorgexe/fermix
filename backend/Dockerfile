# Dockerfile for Fermix Backend API
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy models and data
COPY models/ /app/models/
COPY data/sample/ /app/data/sample/

# Create metadata file if models exist
RUN python -c "import os, json, datetime; \
    metadata = { \
        'created_utc': datetime.datetime.utcnow().isoformat() + 'Z', \
        'dataset': 'NASA Exoplanet Archive (Kepler)', \
        'task': 'Binary Classification (CONFIRMED vs FALSE POSITIVE)', \
        'n_samples': {'train': 'unknown', 'test': 'unknown'}, \
        'n_features': 115, \
        'models': { \
            'random_forest': {'n_estimators': 300, 'max_depth': None}, \
            'lightgbm': {'n_estimators': 500, 'num_leaves': 63, 'learning_rate': 0.05} \
        } \
    }; \
    os.makedirs('/app/models', exist_ok=True); \
    json.dump(metadata, open('/app/models/metadata.json', 'w'), indent=2) \
    " || echo "Warning: Could not create metadata"

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:$PORT/api/v1/health')"

# Run the application
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
