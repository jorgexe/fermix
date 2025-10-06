"""
Pydantic Models for Request/Response Schemas
"""
from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional, Any
from enum import Enum


class ModelType(str, Enum):
    """Available model types"""
    RANDOM_FOREST = "rf"
    LIGHTGBM = "lgbm"


class PredictionInput(BaseModel):
    """
    Input schema for prediction endpoint
    Requires key orbital and stellar features
    """
    # Orbital parameters (required)
    koi_period: float = Field(..., description="Orbital period in days", gt=0)
    koi_duration: float = Field(..., description="Transit duration in hours", gt=0)
    koi_depth: float = Field(..., description="Transit depth in ppm", gt=0)
    koi_prad: float = Field(..., description="Planetary radius in Earth radii", gt=0)
    
    # Stellar parameters
    koi_steff: Optional[float] = Field(None, description="Stellar effective temperature in K")
    koi_slogg: Optional[float] = Field(None, description="Stellar surface gravity (log g)")
    koi_srad: Optional[float] = Field(None, description="Stellar radius in solar radii")
    koi_smass: Optional[float] = Field(None, description="Stellar mass in solar masses")
    koi_smetal: Optional[float] = Field(None, description="Stellar metallicity [Fe/H]")
    
    # Transit parameters
    koi_impact: Optional[float] = Field(None, description="Impact parameter")
    koi_teq: Optional[float] = Field(None, description="Equilibrium temperature in K")
    koi_insol: Optional[float] = Field(None, description="Insolation flux")
    
    # False positive flags
    koi_fpflag_nt: Optional[int] = Field(0, description="Not transit-like flag (0 or 1)")
    koi_fpflag_ss: Optional[int] = Field(0, description="Stellar eclipse flag (0 or 1)")
    koi_fpflag_co: Optional[int] = Field(0, description="Centroid offset flag (0 or 1)")
    koi_fpflag_ec: Optional[int] = Field(0, description="Ephemeris match flag (0 or 1)")
    
    # Model selection
    model_type: Optional[ModelType] = Field(ModelType.LIGHTGBM, description="Model to use for prediction")
    
    class Config:
        json_schema_extra = {
            "example": {
                "koi_period": 12.34,
                "koi_duration": 3.1,
                "koi_prad": 1.2,
                "koi_depth": 1200.0,
                "koi_steff": 5750,
                "koi_slogg": 4.3,
                "koi_smetal": 0.01,
                "koi_impact": 0.2,
                "koi_fpflag_nt": 0,
                "koi_fpflag_ss": 0,
                "koi_fpflag_co": 0,
                "koi_fpflag_ec": 0,
                "model_type": "lgbm"
            }
        }


class PredictionOutput(BaseModel):
    """Output schema for prediction endpoint"""
    predicted_class: int = Field(..., description="Predicted class (0=FALSE POSITIVE, 1=CONFIRMED)")
    predicted_label: str = Field(..., description="Human-readable label")
    probability_false_positive: float = Field(..., description="Probability of FALSE POSITIVE")
    probability_confirmed: float = Field(..., description="Probability of CONFIRMED")
    confidence: float = Field(..., description="Confidence score (max probability)")
    model_used: str = Field(..., description="Model used for prediction (rf or lgbm)")
    top_features: List[Dict[str, Any]] = Field(..., description="Top contributing features")
    
    class Config:
        json_schema_extra = {
            "example": {
                "predicted_class": 1,
                "predicted_label": "CONFIRMED",
                "probability_false_positive": 0.12,
                "probability_confirmed": 0.88,
                "confidence": 0.88,
                "model_used": "lgbm",
                "top_features": [
                    {"feature": "koi_period", "value": 12.34, "importance": 0.15},
                    {"feature": "koi_depth", "value": 1200.0, "importance": 0.12}
                ]
            }
        }


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="API health status")
    version: str = Field(..., description="API version")
    models_loaded: bool = Field(..., description="Whether ML models are loaded")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "ok",
                "version": "1.0.0",
                "models_loaded": True
            }
        }


class DatasetResponse(BaseModel):
    """Dataset pagination response"""
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_records: int = Field(..., description="Total number of records")
    total_pages: int = Field(..., description="Total number of pages")
    data: List[Dict[str, Any]] = Field(..., description="Dataset rows")
    
    class Config:
        json_schema_extra = {
            "example": {
                "page": 1,
                "page_size": 50,
                "total_records": 500,
                "total_pages": 10,
                "data": [
                    {"kepid": 10797460, "koi_period": 9.488, "koi_disposition": "CONFIRMED"}
                ]
            }
        }


class StatsResponse(BaseModel):
    """Statistics response from metadata"""
    created_utc: str
    dataset: str
    task: str
    n_samples: Dict[str, int]
    n_features: int
    models: Dict[str, Any]
    
    class Config:
        json_schema_extra = {
            "example": {
                "created_utc": "2025-10-05T...",
                "dataset": "Kepler KOI cleaned",
                "task": "binary",
                "n_samples": {"total": 7822, "train": 6257, "test": 1565},
                "n_features": 115,
                "models": {
                    "random_forest": {"metrics": {"accuracy": 0.91}},
                    "lightgbm": {"metrics": {"accuracy": 0.93}}
                }
            }
        }
