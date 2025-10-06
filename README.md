# Fermix: Exoplanet Classification Pipeline

A complete machine learning pipeline for classifying Kepler exoplanet candidates using Random Forest and LightGBM models.

## 📋 Project Overview

This project implements a comprehensive data science workflow for binary classification of Kepler Objects of Interest (KOIs):
- **CONFIRMED** exoplanets
- **FALSE POSITIVE** candidates

### Key Features

✨ **Complete Pipeline**: Data cleaning → Model training → Evaluation → Documentation  
🎯 **Dual Models**: Random Forest & LightGBM baselines  
📊 **Rich Visualizations**: ROC, PR curves, confusion matrices, feature importance  
📖 **Production-Ready**: Model cards, metadata, reproducible notebooks  
🔬 **Scientific Rigor**: Based on NASA Kepler mission data

---

## 🗂️ Project Structure

```
fermix/
├── data/
│   ├── raw/                    # Original NASA datasets
│   │   ├── kepler.csv         # Kepler KOI data
│   │   ├── k2.csv             # K2 mission data
│   │   └── tess.csv           # TESS mission data
│   └── clean/                  # Cleaned datasets
│       ├── kepler_clean.csv
│       ├── k2_clean.csv
│       └── tess_clean.csv
├── notebooks/
│   ├── 01_cleaning.ipynb      # Data exploration & cleaning
│   ├── 02_train_lgbm_rf.ipynb # Model training & evaluation
│   └── 04_eval_plots.ipynb    # Visualization generation
├── models/
│   ├── model_rf.pkl           # Random Forest model
│   ├── model_lgbm.pkl         # LightGBM model
│   ├── metadata.json          # Model metadata & metrics
│   └── features.json          # Feature list
├── docs/
│   ├── model_card.md          # Comprehensive model documentation
│   └── figures/               # Evaluation plots
│       ├── roc.png
│       ├── pr.png
│       ├── confusion.png
│       └── feature_importance.png
├── backend/                    # API (future)
├── frontend/                   # Web interface (future)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Virtual environment recommended

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jorgexe/fermix.git
   cd fermix
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install LightGBM dependencies (macOS)**
   ```bash
   brew install libomp
   ```

### Required Packages

```txt
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
scikit-learn>=1.3.0
lightgbm>=4.0.0
joblib>=1.3.0
jupyter>=1.0.0
```

---

## 📊 Workflow

### Step 1: Data Cleaning

**Notebook:** `notebooks/01_cleaning.ipynb`

**What it does:**
- Loads raw NASA Exoplanet Archive datasets
- Explores data structure, types, and quality
- Removes columns with ≥95% missing values
- Handles remaining missing values
- Compares schemas across Kepler, K2, and TESS
- Exports cleaned datasets

**Key Results:**
- Kepler: 9,564 rows, 141 → 122 columns
- K2: 4,004 rows, 295 → 248 columns
- TESS: 7,703 rows, 87 → 75 columns

**Run:**
```bash
jupyter notebook notebooks/01_cleaning.ipynb
```

### Step 2: Model Training

**Notebook:** `notebooks/02_train_lgbm_rf.ipynb`

**What it does:**
- Loads cleaned Kepler dataset
- Creates binary classification target (CONFIRMED vs FALSE POSITIVE)
- Selects 115 numeric features
- Splits data (80/20 train/test)
- Trains two baseline models:
  - **Random Forest**: 300 estimators, unlimited depth
  - **LightGBM**: 500 estimators, 63 leaves, 0.05 learning rate
- Evaluates with comprehensive metrics
- Exports models and metadata

**Key Metrics (Expected):**
- Accuracy: ~91-93%
- ROC-AUC: ~95-96%
- PR-AUC: ~93-94%
- F1 Score: ~88-90%

**Run:**
```bash
jupyter notebook notebooks/02_train_lgbm_rf.ipynb
```

### Step 3: Evaluation Plots

**Notebook:** `notebooks/04_eval_plots.ipynb`

**What it does:**
- Loads trained models
- Recreates test predictions
- Generates publication-quality visualizations:
  - ROC curves comparing both models
  - Precision-Recall curves for imbalanced data
  - Confusion matrices
  - Feature importance plots
- Saves all figures to `docs/figures/`

**Run:**
```bash
jupyter notebook notebooks/04_eval_plots.ipynb
```

---

## 📈 Model Performance

### Binary Classification Results

| Metric | Random Forest | LightGBM |
|--------|---------------|----------|
| Accuracy | ~0.91 | ~0.93 |
| ROC-AUC | ~0.95 | ~0.96 |
| PR-AUC | ~0.93 | ~0.94 |
| F1 Score | ~0.88 | ~0.90 |

### Top 5 Most Important Features

1. `koi_period` - Orbital period [days]
2. `koi_duration` - Transit duration [hours]
3. `koi_depth` - Transit depth [ppm]
4. `koi_prad` - Planetary radius [Earth radii]
5. `koi_teq` - Equilibrium temperature [K]

---

## 🔬 Using the Models

### Load and Predict

```python
import joblib
import pandas as pd
import json

# Load model
model = joblib.load('models/model_lgbm.pkl')

# Load feature list
with open('models/features.json', 'r') as f:
    features = json.load(f)['features']

# Load metadata
with open('models/metadata.json', 'r') as f:
    metadata = json.load(f)

# Prepare your data
df_new = pd.read_csv('your_koi_data.csv')
X_new = df_new[features]

# Handle missing values (same as training)
for col in features:
    if X_new[col].isnull().any():
        X_new[col].fillna(X_new[col].median(), inplace=True)

# Make predictions
predictions = model.predict(X_new)
probabilities = model.predict_proba(X_new)[:, 1]

# Interpret results
# 0 = FALSE POSITIVE, 1 = CONFIRMED
# probabilities = confidence in CONFIRMED class

print(f"Predicted {predictions.sum()} confirmed exoplanets")
```

---

## 📚 Documentation

### Model Card

Comprehensive model documentation is available in [`docs/model_card.md`](docs/model_card.md), including:

- **Overview**: Model description and development context
- **Data & Preprocessing**: Dataset details and feature engineering
- **Model Architecture**: Hyperparameters and design choices
- **Performance Metrics**: Detailed evaluation results
- **Intended Use**: Recommended use cases and examples
- **Limitations**: Known constraints and edge cases
- **Ethical Considerations**: Bias analysis and mitigation
- **Maintenance**: Update schedule and version history

### Metadata

Model metadata is stored in `models/metadata.json` with:
- Training date and version
- Dataset information
- Feature list (115 features)
- Hyperparameters
- Performance metrics
- Confusion matrices
- Preprocessing steps

---

## 🎯 Next Steps

### Planned Enhancements

1. **3-Class Classification**: Include CANDIDATE class
2. **Cross-Mission Models**: Train on combined Kepler + K2 + TESS data
3. **Hyperparameter Tuning**: Optimize model parameters
4. **Deep Learning**: Explore neural network architectures
5. **API Development**: REST API for model serving
6. **Web Interface**: Interactive dashboard for predictions
7. **Real-time Predictions**: Stream processing for new candidates

### Future Work

- **Time-Series Models**: Analyze raw light curves
- **Ensemble Methods**: Combine multiple models
- **Physics-Informed ML**: Incorporate domain constraints
- **Transfer Learning**: Adapt models to other missions
- **Explainability**: SHAP values for predictions

---

## 📖 References

### Datasets

- **NASA Exoplanet Archive**: https://exoplanetarchive.ipac.caltech.edu/
- **Kepler Mission**: Borucki et al. (2010), Science 327(5968)

### Machine Learning

- **Random Forest**: Breiman (2001), Machine Learning 45(1)
- **LightGBM**: Ke et al. (2017), NeurIPS

### Domain Knowledge

- **Transit Photometry**: Winn (2010), Exoplanets
- **Planet Validation**: Morton et al. (2016), ApJ 822(2)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and notebooks
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Jorge Sandoval**

- GitHub: [@jorgexe](https://github.com/jorgexe)
- Repository: [fermix](https://github.com/jorgexe/fermix)

---

## 🙏 Acknowledgments

- NASA Exoplanet Archive for providing high-quality datasets
- Kepler/K2/TESS mission teams for their groundbreaking work
- Open-source machine learning community
- All contributors to this project

---

## 📊 Project Status

**Current Version:** 1.0.0  
**Status:** ✅ Active Development  
**Last Updated:** October 5, 2025

### Completed Milestones

- [x] Data cleaning pipeline
- [x] Baseline model training (RF + LightGBM)
- [x] Comprehensive evaluation metrics
- [x] Visualization generation
- [x] Model card documentation
- [x] Model serialization and metadata

### In Progress

- [ ] API development (backend)
- [ ] Web interface (frontend)
- [ ] Hyperparameter optimization
- [ ] 3-class classification

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
