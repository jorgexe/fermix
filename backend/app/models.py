"""
Model Loading and Management
Handles loading of ML models and feature metadata
"""
import joblib
import json
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List, Tuple, Any
from .config import settings


class ModelManager:
    """Manages ML models and predictions"""
    
    def __init__(self):
        self.rf_model = None
        self.lgbm_model = None
        self.features = None
        self.metadata = None
        self.models_loaded = False
        
    def load_models(self) -> bool:
        """Load all models and metadata"""
        try:
            # Load models
            self.rf_model = joblib.load(settings.RF_MODEL_PATH)
            self.lgbm_model = joblib.load(settings.LGBM_MODEL_PATH)
            
            # Load features
            with open(settings.FEATURES_PATH, 'r') as f:
                features_data = json.load(f)
                self.features = features_data['features']
            
            # Load metadata
            with open(settings.METADATA_PATH, 'r') as f:
                self.metadata = json.load(f)
            
            self.models_loaded = True
            print(f"✓ Models loaded successfully")
            print(f"  - Random Forest: {settings.RF_MODEL_PATH}")
            print(f"  - LightGBM: {settings.LGBM_MODEL_PATH}")
            print(f"  - Features: {len(self.features)}")
            
            return True
            
        except Exception as e:
            print(f"Error loading models: {e}")
            self.models_loaded = False
            return False
    
    def prepare_features(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Prepare input data to match training features
        Handles missing features by filling with median or default values
        """
        if not self.models_loaded:
            raise ValueError("Models not loaded")
        
        # Create DataFrame with all required features
        feature_dict = {}
        
        for feature in self.features:
            if feature in input_data:
                feature_dict[feature] = input_data[feature]
            else:
                # Use default value (0.0) for missing features
                # In production, you might want to use training medians
                feature_dict[feature] = 0.0
        
        df = pd.DataFrame([feature_dict])
        return df
    
    def predict(self, input_data: Dict[str, Any], model_type: str = "lgbm") -> Dict[str, Any]:
        """
        Make prediction using specified model
        
        Args:
            input_data: Dictionary of feature values
            model_type: "lgbm" or "rf"
            
        Returns:
            Dictionary with prediction results
        """
        if not self.models_loaded:
            raise ValueError("Models not loaded. Call load_models() first.")
        
        # Select model
        if model_type == "lgbm":
            model = self.lgbm_model
        elif model_type == "rf":
            model = self.rf_model
        else:
            raise ValueError(f"Unknown model type: {model_type}")
        
        # Prepare features
        X = self.prepare_features(input_data)
        
        # Make prediction
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0]
        
        # Get feature importances
        feature_importance = model.feature_importances_
        
        # Get top features that were actually provided
        provided_features = [f for f in self.features if f in input_data]
        top_features = []
        
        for feature in provided_features[:10]:  # Top 10 provided features
            idx = self.features.index(feature)
            top_features.append({
                "feature": feature,
                "value": float(input_data[feature]),
                "importance": float(feature_importance[idx])
            })
        
        # Sort by importance
        top_features = sorted(top_features, key=lambda x: x['importance'], reverse=True)[:5]
        
        # Prepare result
        result = {
            "predicted_class": int(prediction),
            "predicted_label": "CONFIRMED" if prediction == 1 else "FALSE POSITIVE",
            "probability_false_positive": float(probabilities[0]),
            "probability_confirmed": float(probabilities[1]),
            "confidence": float(max(probabilities)),
            "model_used": model_type,
            "top_features": top_features
        }
        
        return result
    
    def get_metadata(self) -> Dict[str, Any]:
        """Return metadata"""
        if not self.models_loaded:
            raise ValueError("Models not loaded")
        return self.metadata


# Create global model manager instance
model_manager = ModelManager()
