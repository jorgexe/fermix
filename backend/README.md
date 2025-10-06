# Fermix Backend API

FastAPI backend for exoplanet classification using Random Forest and LightGBM models.

## Features

- 🚀 Fast REST API built with FastAPI
- 🤖 Two ML models (Random Forest + LightGBM)
- 📊 Real-time predictions with confidence scores
- 📈 Feature importance analysis
- 🔍 Dataset exploration endpoints
- 📦 Docker support for Railway deployment

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r ../requirements.txt
```

### 2. Ensure Models Are Trained

Make sure you've run the training notebooks first:
- `notebooks/02_train_lgbm_rf.ipynb` - Generates `models/model_rf.pkl` and `models/model_lgbm.pkl`

### 3. Run the API

```bash
# From project root
uvicorn backend.app.main:app --reload

# Or specify host/port
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Access Interactive Docs

Open your browser to:
- **Swagger UI**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc

## API Endpoints

### Health Check
```bash
GET /api/v1/health
```
Returns API status and model loading state.

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0",
  "models_loaded": true
}
```

---

### Get Dataset
```bash
GET /api/v1/dataset?sample=true&page=1&page_size=50
```
Get paginated exoplanet data.

**Query Parameters:**
- `sample` (bool): Use sample dataset (500 rows) vs full dataset
- `page` (int): Page number (starts at 1)
- `page_size` (int): Records per page (max 500)

**Response:**
```json
{
  "page": 1,
  "page_size": 50,
  "total_records": 500,
  "total_pages": 10,
  "data": [
    {
      "koi_period": 12.34,
      "koi_duration": 3.1,
      "koi_prad": 1.2,
      ...
    }
  ]
}
```

---

### Get Model Stats
```bash
GET /api/v1/stats
```
Returns model metadata, metrics, and feature information.

**Response:**
```json
{
  "created_utc": "2025-01-20T10:30:00Z",
  "dataset": "NASA Exoplanet Archive (Kepler)",
  "task": "Binary Classification",
  "n_samples": {
    "train": 7651,
    "test": 1913
  },
  "n_features": 115,
  "models": {
    "random_forest": {
      "accuracy": 0.93,
      "roc_auc": 0.96
    },
    "lightgbm": {
      "accuracy": 0.91,
      "roc_auc": 0.95
    }
  }
}
```

---

### Make Prediction
```bash
POST /api/v1/predict
```
Classify an exoplanet candidate.

**Request Body:**
```json
{
  "koi_period": 12.34,
  "koi_duration": 3.1,
  "koi_depth": 1200.0,
  "koi_prad": 1.2,
  "koi_steff": 5750,
  "koi_slogg": 4.3,
  "koi_smetal": 0.01,
  "koi_impact": 0.2,
  "model_type": "lgbm"
}
```

**Response:**
```json
{
  "predicted_class": 1,
  "predicted_label": "CONFIRMED",
  "probabilities": {
    "FALSE POSITIVE": 0.15,
    "CONFIRMED": 0.85
  },
  "confidence": 0.85,
  "top_features": [
    {"feature": "koi_period", "importance": 0.23},
    {"feature": "koi_depth", "importance": 0.18},
    {"feature": "koi_prad", "importance": 0.15}
  ]
}
```

---

## Docker Deployment

### Build Image

```bash
docker build -f backend/Dockerfile -t fermix-api .
```

### Run Container

```bash
docker run -p 8000:8000 fermix-api
```

### Deploy to Railway

1. Push code to GitHub
2. Connect repository to Railway
3. Railway will auto-detect Dockerfile
4. Environment variables are set in Railway dashboard

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app & endpoints
│   ├── config.py        # Settings & configuration
│   ├── schemas.py       # Pydantic models
│   └── models.py        # ML model manager
├── Dockerfile           # Container configuration
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp backend/.env.example backend/.env
```

Key settings:
- `DEFAULT_MODEL`: Choose 'rf' or 'lgbm'
- `ALLOWED_ORIGINS`: CORS origins for frontend
- `PORT`: Server port (default 8000)

## Development

### Run with Auto-reload

```bash
uvicorn backend.app.main:app --reload
```

### Test Endpoints

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Get dataset
curl "http://localhost:8000/api/v1/dataset?sample=true&page=1"

# Make prediction
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "koi_period": 12.34,
    "koi_duration": 3.1,
    "koi_depth": 1200.0,
    "koi_prad": 1.2,
    "koi_steff": 5750,
    "koi_slogg": 4.3,
    "model_type": "lgbm"
  }'
```

## Dependencies

- **FastAPI** (0.115+): Modern web framework
- **Uvicorn** (0.32+): ASGI server
- **Pydantic** (2.10+): Data validation
- **scikit-learn** (1.5+): Random Forest
- **LightGBM** (4.5+): Gradient boosting
- **Pandas** (2.3+): Data handling

## Error Handling

The API returns standard HTTP status codes:
- **200**: Success
- **400**: Bad request (invalid input)
- **404**: Resource not found
- **500**: Server error
- **503**: Service unavailable (models not loaded)

## Performance

- Model loading: ~1-2 seconds at startup
- Prediction latency: <50ms per request
- Concurrent requests: Supports 100+ simultaneous requests

## License

MIT License - See main project README

## Support

For issues, see the main project repository or contact the development team.
