import os
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

endpoint = os.getenv("AZURE_OPENAI_BASE_URL") or ""
model_name = "gpt-4o"
deployment = "gpt-4o"

subscription_key = os.getenv("AZURE_OPENAI_API_KEY") or ""
api_version = os.getenv("AZURE_OPENAI_API_VERSION") or "2024-02-15-preview"

# Debug environment variables
print(f"🔍 Debugging environment variables:")
print(f"   AZURE_OPENAI_BASE_URL: '{endpoint}'")
print(f"   AZURE_OPENAI_API_KEY: '{subscription_key[:10]}...' (truncated)")
print(f"   AZURE_OPENAI_API_VERSION: '{api_version}'")
print(f"   Deployment: '{deployment}'")

if not endpoint:
    print("❌ AZURE_OPENAI_BASE_URL is empty!")
if not subscription_key:
    print("❌ AZURE_OPENAI_API_KEY is empty!")
if not api_version:
    print("❌ AZURE_OPENAI_API_VERSION is empty!")

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
            "content": "I am going to Paris, what should I see?",
        }
    ],
    max_tokens=4096,
    temperature=1.0,
    top_p=1.0,
    model=deployment
)

print(response.choices[0].message.content)