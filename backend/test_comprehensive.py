#!/usr/bin/env python3
"""
Comprehensive Backend Testing Script
Tests all endpoints without starting/stopping the server
"""
import sys
import subprocess
import time
import requests
import json
from pathlib import Path

# Colors for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

BASE_URL = "http://localhost:8000/api/v1"
TEST_RESULTS = []

def print_header(text):
    """Print section header"""
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}{text:^60}{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")

def print_success(text):
    """Print success message"""
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text):
    """Print error message"""
    print(f"{RED}❌ {text}{RESET}")

def print_warning(text):
    """Print warning message"""
    print(f"{YELLOW}⚠️  {text}{RESET}")

def start_server():
    """Start the uvicorn server in background"""
    print_header("STARTING SERVER")
    python_path = Path("/Users/jorgesandoval/Documents/current/fermix/venv/bin/uvicorn")
    
    if not python_path.exists():
        print_error("Python venv not found")
        return None
    
    process = subprocess.Popen(
        [str(python_path), "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd="/Users/jorgesandoval/Documents/current/fermix",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    # Wait for server to start
    print("Waiting for server to start...", end="", flush=True)
    for i in range(10):
        time.sleep(1)
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                print(" Done!")
                print_success("Server started successfully")
                return process
        except:
            print(".", end="", flush=True)
    
    print()
    print_error("Server failed to start")
    return None

def test_health():
    """Test health endpoint"""
    print_header("TEST 1: Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"URL: {BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nResponse:")
            print(json.dumps(data, indent=2))
            
            if data.get("status") == "ok" and data.get("models_loaded"):
                print_success("Health check passed - models loaded!")
                TEST_RESULTS.append(("Health Check", True))
                return True
            else:
                print_error("Models not loaded properly")
                TEST_RESULTS.append(("Health Check", False))
                return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            TEST_RESULTS.append(("Health Check", False))
            return False
    except Exception as e:
        print_error(f"Health check failed: {e}")
        TEST_RESULTS.append(("Health Check", False))
        return False

def test_dataset():
    """Test dataset endpoint"""
    print_header("TEST 2: Dataset Access")
    try:
        response = requests.get(
            f"{BASE_URL}/dataset",
            params={"sample": True, "page": 1, "page_size": 5},
            timeout=5
        )
        print(f"URL: {BASE_URL}/dataset?sample=true&page=1&page_size=5")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nDataset Info:")
            print(f"  Page: {data['page']}/{data['total_pages']}")
            print(f"  Total records: {data['total_records']}")
            print(f"  Records in response: {len(data['data'])}")
            print(f"\nFirst record features: {list(data['data'][0].keys())[:5]}...")
            
            if data['total_records'] > 0 and len(data['data']) > 0:
                print_success(f"Dataset endpoint works - returned {len(data['data'])} records")
                TEST_RESULTS.append(("Dataset Access", True))
                return True
            else:
                print_error("No data returned")
                TEST_RESULTS.append(("Dataset Access", False))
                return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            TEST_RESULTS.append(("Dataset Access", False))
            return False
    except Exception as e:
        print_error(f"Dataset test failed: {e}")
        TEST_RESULTS.append(("Dataset Access", False))
        return False

def test_stats():
    """Test stats endpoint"""
    print_header("TEST 3: Model Statistics")
    try:
        response = requests.get(f"{BASE_URL}/stats", timeout=5)
        print(f"URL: {BASE_URL}/stats")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nStatistics:")
            print(f"  Dataset: {data.get('dataset', 'N/A')}")
            print(f"  Task: {data.get('task', 'N/A')}")
            print(f"  Features: {data.get('n_features', 'N/A')}")
            
            models = data.get('models', {})
            print(f"  Models: {list(models.keys())}")
            
            for model_name, model_info in models.items():
                print(f"\n  {model_name}:")
                for key, value in model_info.items():
                    print(f"    {key}: {value}")
            
            if data.get('n_features', 0) > 0:
                print_success("Stats endpoint works - metadata loaded!")
                TEST_RESULTS.append(("Model Statistics", True))
                return True
            else:
                print_error("Invalid stats data")
                TEST_RESULTS.append(("Model Statistics", False))
                return False
        else:
            print_error(f"Unexpected status code: {response.status_code}")
            TEST_RESULTS.append(("Model Statistics", False))
            return False
    except Exception as e:
        print_error(f"Stats test failed: {e}")
        TEST_RESULTS.append(("Model Statistics", False))
        return False

def test_predict():
    """Test prediction endpoint"""
    print_header("TEST 4: Prediction")
    
    # Test data
    test_cases = [
        {
            "name": "LGBM Model",
            "data": {
                "koi_period": 12.34,
                "koi_duration": 3.1,
                "koi_depth": 1200.0,
                "koi_prad": 1.2,
                "koi_steff": 5750,
                "koi_slogg": 4.3,
                "koi_smetal": 0.01,
                "model_type": "lgbm"
            }
        },
        {
            "name": "Random Forest Model",
            "data": {
                "koi_period": 50.5,
                "koi_duration": 6.2,
                "koi_depth": 800.0,
                "koi_prad": 2.5,
                "koi_steff": 6000,
                "koi_slogg": 4.0,
                "model_type": "rf"
            }
        }
    ]
    
    all_passed = True
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{BLUE}Test 4.{i}: {test_case['name']}{RESET}")
        try:
            response = requests.post(
                f"{BASE_URL}/predict",
                json=test_case['data'],
                timeout=5
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"\nPrediction Result:")
                print(f"  Class: {result['predicted_class']}")
                print(f"  Label: {result['predicted_label']}")
                print(f"  Confidence: {result['confidence']:.2%}")
                print(f"\n  Probabilities:")
                for label, prob in result['probabilities'].items():
                    print(f"    {label}: {prob:.2%}")
                print(f"\n  Top 3 Features:")
                for feat in result['top_features'][:3]:
                    print(f"    {feat['feature']}: {feat['importance']:.4f}")
                
                print_success(f"{test_case['name']} prediction works!")
            else:
                print_error(f"Unexpected status code: {response.status_code}")
                print(f"Response: {response.text}")
                all_passed = False
        except Exception as e:
            print_error(f"Prediction test failed: {e}")
            all_passed = False
    
    TEST_RESULTS.append(("Prediction", all_passed))
    return all_passed

def print_summary():
    """Print test summary"""
    print_header("TEST SUMMARY")
    
    passed = sum(1 for _, result in TEST_RESULTS if result)
    total = len(TEST_RESULTS)
    
    for test_name, result in TEST_RESULTS:
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"  {status} - {test_name}")
    
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    if passed == total:
        print(f"{GREEN}✅ ALL TESTS PASSED ({passed}/{total}){RESET}")
        print(f"{GREEN}Backend is ready for deployment!{RESET}")
    else:
        print(f"{YELLOW}⚠️  {passed}/{total} tests passed{RESET}")
        print(f"{YELLOW}Review failures above{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")

def main():
    """Main test runner"""
    print_header("FERMIX BACKEND TEST SUITE")
    
    # Check if server is already running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        if response.status_code == 200:
            print_success("Server is already running!")
            server_process = None
        else:
            print_warning("Server responding but with error")
            return 1
    except:
        print_warning("Server not running - please start it first")
        print(f"\nRun this command in another terminal:")
        print(f"{YELLOW}uvicorn backend.app.main:app --host 127.0.0.1 --port 8000{RESET}\n")
        return 1
    
    # Run tests
    test_health()
    test_dataset()
    test_stats()
    test_predict()
    
    # Print summary
    print_summary()
    
    # Check if all passed
    all_passed = all(result for _, result in TEST_RESULTS)
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
