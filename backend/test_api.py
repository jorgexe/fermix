"""
Quick test script for Fermix API
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    """Test health endpoint"""
    print("\n🔍 Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_dataset():
    """Test dataset endpoint"""
    print("\n📊 Testing /dataset endpoint...")
    response = requests.get(f"{BASE_URL}/dataset?sample=true&page=1&page_size=5")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Page: {data['page']}/{data['total_pages']}")
    print(f"Total records: {data['total_records']}")
    print(f"Records returned: {len(data['data'])}")
    return response.status_code == 200

def test_stats():
    """Test stats endpoint"""
    print("\n📈 Testing /stats endpoint...")
    response = requests.get(f"{BASE_URL}/stats")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_predict():
    """Test prediction endpoint"""
    print("\n🤖 Testing /predict endpoint...")
    
    # Sample exoplanet data
    test_data = {
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
    
    response = requests.post(f"{BASE_URL}/predict", json=test_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\nPrediction: {result['predicted_label']}")
        print(f"Confidence: {result['confidence']:.2%}")
        print(f"\nProbabilities:")
        for label, prob in result['probabilities'].items():
            print(f"  {label}: {prob:.2%}")
        print(f"\nTop Features:")
        for feat in result['top_features'][:5]:
            print(f"  {feat['feature']}: {feat['importance']:.4f}")
    else:
        print(f"Error: {response.text}")
    
    return response.status_code == 200

if __name__ == "__main__":
    print("=" * 60)
    print("  FERMIX API TEST SUITE")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health),
        ("Dataset Access", test_dataset),
        ("Model Stats", test_stats),
        ("Prediction", test_predict)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("  TEST RESULTS")
    print("=" * 60)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")
    
    passed_count = sum(1 for _, passed in results if passed)
    print(f"\nTotal: {passed_count}/{len(results)} tests passed")
