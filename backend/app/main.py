"""
FastAPI Main Application
Exoplanet Classification API
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import pandas as pd
import json
import os
from typing import Optional

from .config import settings
from .schemas import (
    HealthResponse,
    DatasetResponse,
    StatsResponse,
    PredictionInput,
    PredictionOutput
)
from .models import model_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager - runs on startup and shutdown"""
    # Startup
    print(f"\n🚀 Starting {settings.PROJECT_NAME}")
    print(f"Version: {settings.VERSION}")
    print(f"API Prefix: {settings.API_V1_PREFIX}")
    print(f"ALLOWED_ORIGINS: {settings.ALLOWED_ORIGINS}")
    print(f"PORT: {os.getenv('PORT', '8000')}")
    
    # Verify paths exist
    import os as os_check
    print(f"Models dir exists: {os_check.path.exists(settings.MODELS_DIR)}")
    print(f"Sample data exists: {os_check.path.exists(settings.SAMPLE_DATASET_PATH)}")
    
    # Load ML models
    success = model_manager.load_models()
    if not success:
        print("⚠️  Warning: Models failed to load. Prediction endpoint will not work.")
    else:
        print("✓ Models loaded successfully")
    
    yield
    
    # Shutdown
    print("\n👋 Shutting down API")


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Endpoints ====================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - redirects to docs"""
    return {
        "message": "Fermix Exoplanet Classification API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_PREFIX}/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    }


@app.get(f"{settings.API_V1_PREFIX}/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint
    Returns API status and model loading state
    """
    return HealthResponse(
        status="ok",
        version=settings.VERSION,
        models_loaded=model_manager.models_loaded
    )


@app.get(f"{settings.API_V1_PREFIX}/dataset", response_model=DatasetResponse, tags=["Data"])
async def get_dataset(
    sample: bool = Query(True, description="Use sample dataset (500 rows) vs full dataset"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(50, ge=1, le=settings.MAX_PAGE_SIZE, description="Items per page")
):
    """
    Get paginated dataset
    
    - **sample**: If true, uses small sample dataset (500 rows), otherwise uses full cleaned dataset
    - **page**: Page number (starts at 1)
    - **page_size**: Number of records per page (max 500)
    """
    try:
        # Choose dataset
        if sample:
            dataset_path = settings.SAMPLE_DATASET_PATH
        else:
            dataset_path = settings.CLEAN_DATASET_PATH
        
        # Check if file exists
        if not dataset_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Dataset not found: {dataset_path}. Please run data preparation notebooks first."
            )
        
        # Load dataset
        df = pd.read_csv(dataset_path)
        total_records = len(df)
        total_pages = (total_records + page_size - 1) // page_size
        
        # Validate page number
        if page > total_pages:
            raise HTTPException(
                status_code=400,
                detail=f"Page {page} exceeds total pages {total_pages}"
            )
        
        # Calculate pagination
        start_idx = (page - 1) * page_size
        end_idx = min(start_idx + page_size, total_records)
        
        # Get page data
        page_df = df.iloc[start_idx:end_idx]
        
        # Convert to list of dictionaries, handling NaN values
        data = json.loads(page_df.to_json(orient='records'))
        
        return DatasetResponse(
            page=page,
            page_size=page_size,
            total_records=total_records,
            total_pages=total_pages,
            data=data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading dataset: {str(e)}")


@app.get(f"{settings.API_V1_PREFIX}/stats", response_model=StatsResponse, tags=["Stats"])
async def get_stats():
    """
    Get model statistics and metadata
    Returns information about trained models, metrics, and features
    """
    try:
        if not model_manager.models_loaded:
            raise HTTPException(
                status_code=503,
                detail="Models not loaded. Please check server logs."
            )
        
        metadata = model_manager.get_metadata()
        
        return StatsResponse(
            created_utc=metadata.get("created_utc", "unknown"),
            dataset=metadata.get("dataset", "unknown"),
            task=metadata.get("task", "unknown"),
            n_samples=metadata.get("n_samples", {}),
            n_features=metadata.get("n_features", 0),
            models=metadata.get("models", {})
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading stats: {str(e)}")


@app.post(f"{settings.API_V1_PREFIX}/predict", response_model=PredictionOutput, tags=["Prediction"])
async def predict(input_data: PredictionInput):
    """
    Predict exoplanet classification
    
    Takes orbital and stellar parameters and returns:
    - Predicted class (0=FALSE POSITIVE, 1=CONFIRMED)
    - Probability scores for each class
    - Top contributing features
    
    Example request body:
    ```json
    {
        "koi_period": 12.34,
        "koi_duration": 3.1,
        "koi_prad": 1.2,
        "koi_depth": 1200.0,
        "koi_steff": 5750,
        "koi_slogg": 4.3,
        "koi_smetal": 0.01,
        "koi_impact": 0.2
    }
    ```
    """
    try:
        if not model_manager.models_loaded:
            raise HTTPException(
                status_code=503,
                detail="Models not loaded. Server may still be starting up."
            )
        
        # Convert Pydantic model to dict
        input_dict = input_data.model_dump(exclude={'model_type'})
        
        # Remove None values
        input_dict = {k: v for k, v in input_dict.items() if v is not None}
        
        # Make prediction
        result = model_manager.predict(
            input_data=input_dict,
            model_type=input_data.model_type.value
        )
        
        return PredictionOutput(**result)
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# ==================== Additional Info ====================

@app.get(f"{settings.API_V1_PREFIX}/info", tags=["Info"])
async def get_api_info():
    """Get API information and available endpoints"""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "endpoints": {
            "health": f"{settings.API_V1_PREFIX}/health",
            "dataset": f"{settings.API_V1_PREFIX}/dataset",
            "stats": f"{settings.API_V1_PREFIX}/stats",
            "predict": f"{settings.API_V1_PREFIX}/predict",
            "docs": f"{settings.API_V1_PREFIX}/docs"
        },
        "models": {
            "random_forest": {
                "type": "RandomForestClassifier",
                "n_estimators": 300,
                "status": "loaded" if model_manager.models_loaded else "not loaded"
            },
            "lightgbm": {
                "type": "LGBMClassifier",
                "n_estimators": 500,
                "status": "loaded" if model_manager.models_loaded else "not loaded"
            }
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
