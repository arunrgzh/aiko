#!/usr/bin/env python3
"""
Simple test script to verify API endpoints are working
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
        print("✅ Health endpoint working")
    else:
        print("❌ Health endpoint failed")
    print()

def test_auth_and_protected_endpoints():
    """Test authentication and protected endpoints"""
    print("🔍 Testing authentication...")
    
    # Register user
    register_data = {
        "username": "testuser123",
        "email": "test123@example.com", 
        "password": "testpassword123"
    }
    
    print("Registering user...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        print(f"Register status: {response.status_code}")
        if response.status_code not in [200, 201, 400]:  # 400 might be "user already exists"
            print(f"Register response: {response.text}")
    except Exception as e:
        print(f"Register error: {e}")
    
    # Login
    login_data = {
        "username": "testuser123",
        "password": "testpassword123"
    }
    
    print("Logging in...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print(f"✅ Login successful, token: {token[:20]}...")
            
            # Test protected endpoints with token
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test notifications count
            print("\n🔍 Testing notifications/count...")
            response = requests.get(f"{BASE_URL}/notifications/count", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
                print("✅ Notifications count working")
            else:
                print(f"❌ Notifications count failed: {response.text}")
            
            # Test assistants
            print("\n🔍 Testing main/assistants...")
            response = requests.get(f"{BASE_URL}/main/assistants/", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {response.json()}")
                print("✅ Assistants endpoint working")
            else:
                print(f"❌ Assistants failed: {response.text}")
                
        else:
            print(f"❌ Login failed: {response.text}")
    except Exception as e:
        print(f"Login error: {e}")

def test_openapi():
    """Test OpenAPI schema generation"""
    print("🔍 Testing OpenAPI schema...")
    response = requests.get(f"{BASE_URL}/openapi.json")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        schema = response.json()
        print(f"Title: {schema.get('info', {}).get('title')}")
        print(f"Version: {schema.get('info', {}).get('version')}")
        paths = list(schema.get('paths', {}).keys())
        print(f"Available endpoints: {len(paths)}")
        for path in sorted(paths)[:10]:  # Show first 10
            print(f"  - {path}")
        print("✅ OpenAPI schema working")
    else:
        print(f"❌ OpenAPI failed: {response.text}")
    print()

if __name__ == "__main__":
    print("🚀 Testing AI-Komek Backend API\n")
    test_health()
    test_openapi()
    test_auth_and_protected_endpoints()
    print("\n🏁 Test completed!") 