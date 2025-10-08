"""
Configuration and Settings
Uses Pydantic Settings for environment variable management
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from pathlib import Path
from typing import List, Union


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Fermix Exoplanet API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "REST API for exoplanet classification using ML models"
    
    # CORS - Accept string (comma-separated) or list
    ALLOWED_ORIGINS: Union[str, List[str]] = "*"
    
    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str], None]) -> List[str]:
        """Parse ALLOWED_ORIGINS from string or list"""
        if isinstance(v, str):
            # If empty or whitespace, default to wildcard
            if not v or v.strip() == "":
                return ["*"]
            # If it's a single asterisk, return as list
            if v.strip() == "*":
                return ["*"]
            # Split comma-separated values
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        if v is None:
            return ["*"]
        return v
    
    # Paths (relative to project root)
    BASE_DIR: Path = Path(__file__).parent.parent.parent
    MODELS_DIR: Path = BASE_DIR / "models"
    DATA_DIR: Path = BASE_DIR / "data"
    SAMPLE_DATA_DIR: Path = DATA_DIR / "sample"
    CLEAN_DATA_DIR: Path = DATA_DIR / "clean"
    
    # Model files
    RF_MODEL_PATH: Path = MODELS_DIR / "model_rf.pkl"
    LGBM_MODEL_PATH: Path = MODELS_DIR / "model_lgbm.pkl"
    METADATA_PATH: Path = MODELS_DIR / "metadata.json"
    FEATURES_PATH: Path = MODELS_DIR / "features.json"
    
    # Dataset
    SAMPLE_DATASET_PATH: Path = SAMPLE_DATA_DIR / "kepler_sample.csv"
    CLEAN_DATASET_PATH: Path = CLEAN_DATA_DIR / "kepler_clean.csv"
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 50
    MAX_PAGE_SIZE: int = 500
    
    # Model Selection
    DEFAULT_MODEL: str = "lgbm"  # or "rf"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )


# Create global settings instance
settings = Settings()
