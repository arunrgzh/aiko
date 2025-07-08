#!/usr/bin/env python3
"""
Test script to specifically test the chat API functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_chat_flow():
    """Test complete chat flow"""
    print("🔍 Testing complete chat flow...")
    
    # 1. Register and login
    register_data = {
        "username": "chattest123",
        "email": "chattest123@example.com", 
        "password": "testpassword123"
    }
    
    print("1. Registering user...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        print(f"   Register status: {response.status_code}")
    except Exception as e:
        print(f"   Register error: {e}")
    
    # Login
    login_data = {
        "username": "chattest123",
        "password": "testpassword123"
    }
    
    print("2. Logging in...")
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"   Login status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   ❌ Login failed: {response.text}")
        return
    
    token_data = response.json()
    token = token_data.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print(f"   ✅ Login successful")
    
    # 2. Get assistants to find assistant ID
    print("3. Getting assistants...")
    response = requests.get(f"{BASE_URL}/main/assistants/", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   ❌ Failed to get assistants: {response.text}")
        return
    
    assistants_data = response.json()
    print(f"   Assistants found: {len(assistants_data.get('data', []))}")
    
    # If no assistants, we need to create one or use a default ID
    if not assistants_data.get('data'):
        print("   No assistants found, using assistant ID 1")
        assistant_id = 1
    else:
        assistant_id = assistants_data['data'][0]['id']
        print(f"   Using assistant ID: {assistant_id}")
    
    # 3. Test chat endpoint
    print("4. Testing chat message...")
    chat_data = {
        "participant": "new-chat-test",
        "message": "Hello, this is a test message from the API test script!"
    }
    
    response = requests.post(
        f"{BASE_URL}/main/assistants/{assistant_id}/chat", 
        json=chat_data, 
        headers=headers
    )
    print(f"   Chat status: {response.status_code}")
    
    if response.status_code == 200:
        chat_response = response.json()
        print(f"   ✅ Chat response received:")
        print(f"   Response keys: {list(chat_response.keys())}")
        
        if 'choices' in chat_response:
            choices = chat_response['choices']
            print(f"   Choices length: {len(choices)}")
            if len(choices) > 0:
                print(f"   First choice: {choices[0]}")
                if 'message' in choices[0]:
                    content = choices[0]['message'].get('content', 'No content')
                    print(f"   AI Response: {content[:100]}...")
                    print("   ✅ Chat working correctly!")
                else:
                    print("   ❌ No 'message' in choice")
            else:
                print("   ❌ Choices array is empty")
        else:
            print("   ❌ No 'choices' in response")
            print(f"   Full response: {json.dumps(chat_response, indent=2)}")
    else:
        print(f"   ❌ Chat failed: {response.text}")

def test_cors():
    """Test CORS headers"""
    print("\n🔍 Testing CORS headers...")
    
    # Test OPTIONS request
    response = requests.options(f"{BASE_URL}/main/assistants/")
    print(f"OPTIONS status: {response.status_code}")
    print(f"CORS headers: {dict(response.headers)}")
    
    # Test with Origin header
    headers = {"Origin": "http://localhost:3000"}
    response = requests.get(f"{BASE_URL}/health", headers=headers)
    print(f"GET with Origin status: {response.status_code}")
    print(f"Access-Control headers: {[k for k in response.headers.keys() if 'access-control' in k.lower()]}")

if __name__ == "__main__":
    print("🚀 Testing AI-Komekshi Chat API\n")
    test_chat_flow()
    test_cors()
    print("\n🏁 Chat test completed!") 