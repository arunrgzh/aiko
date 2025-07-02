import os
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

endpoint = os.getenv("AZURE_OPENAI_BASE_URL") or ""
subscription_key = os.getenv("AZURE_OPENAI_API_KEY") or ""
api_version = os.getenv("AZURE_OPENAI_API_VERSION") or "2024-02-15-preview"

# Try different common deployment names
common_deployments = ["gpt-4", "gpt-35-turbo", "gpt-4-turbo", "gpt-4o", "prod-swedencentral-openai"]

print(f"🔍 Testing Azure OpenAI deployments:")
print(f"   Endpoint: {endpoint}")
print(f"   API Key: {subscription_key[:10]}...")

if not endpoint or not subscription_key:
    print("❌ Missing required environment variables!")
    exit(1)

for deployment in common_deployments:
    print(f"\n🧪 Testing deployment: '{deployment}'")
    try:
        client = AzureOpenAI(
            api_version=api_version,
            azure_endpoint=endpoint,
            api_key=subscription_key,
        )

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": "You are a helpful assistant.",
                },
                {
                    "role": "user",
                    "content": "Say hello!",
                }
            ],
            max_tokens=100,
            temperature=0.5,
            model=deployment
        )
        
        print(f"✅ SUCCESS! Deployment '{deployment}' works!")
        print(f"   Response: {response.choices[0].message.content[:100]}...")
        print(f"\n🎯 Use this deployment name: {deployment}")
        break
        
    except Exception as e:
        if "DeploymentNotFound" in str(e):
            print(f"   ❌ Deployment '{deployment}' not found")
        else:
            print(f"   ❌ Error: {str(e)[:100]}...")

print("\n✅ Test completed!")