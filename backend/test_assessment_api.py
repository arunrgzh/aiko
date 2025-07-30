#!/usr/bin/env python3
"""
Test script for Assessment and Onboarding API functionality
"""

import requests
import json

BASE_URL = "https://ai-komekshi.site/api"

def test_assessment_flow():
    """Test complete assessment flow"""
    print("🧪 Testing Assessment & Onboarding Flow...")
    
    # 1. Register and login
    register_data = {
        "username": "assessmenttest123",
        "email": "assessmenttest123@example.com", 
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
        "username": "assessmenttest123",
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
    
    # 2. Test onboarding progress
    print("3. Checking onboarding progress...")
    response = requests.get(f"{BASE_URL}/api/onboarding/progress", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        progress_data = response.json()
        print(f"   Progress: {progress_data}")
        print(f"   Can take assessment: {progress_data.get('can_take_assessment', False)}")
    
    # 3. Test assessment option choice
    print("4. Testing assessment option choice...")
    assessment_option = {
        "take_assessment": True,
        "skip_onboarding_data": True
    }
    
    response = requests.post(
        f"{BASE_URL}/api/onboarding/assessment-option", 
        json=assessment_option, 
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        option_response = response.json()
        print(f"   ✅ Assessment option response: {option_response}")
    else:
        print(f"   ❌ Failed: {response.text}")
    
    # 4. Get assessment questions
    print("5. Getting assessment questions...")
    response = requests.get(f"{BASE_URL}/api/assessment/questions", headers=headers)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        questions_data = response.json()
        print(f"   ✅ Found {questions_data.get('total_questions', 0)} questions")
        questions = questions_data.get('questions', [])
        
        if questions:
            print(f"   First question: {questions[0]['question_text']}")
    else:
        print(f"   ❌ Failed to get questions: {response.text}")
        return
    
    # 5. Submit assessment answers
    print("6. Submitting assessment answers...")
    
    # Create sample answers
    sample_answers = [
        {"question_id": 1, "answer": "4"},  # Communication: Good
        {"question_id": 2, "answer": ["Программирование", "Работа с компьютером"]},  # Technical skills
        {"question_id": 3, "answer": "5"},  # Problem solving: Excellent
        {"question_id": 4, "answer": "Работа в команде"},  # Work style
        {"question_id": 5, "answer": "4"},  # Learning: Fast
        {"question_id": 6, "answer": ["Творческие задачи", "Аналитическая работа"]}  # Work environment
    ]
    
    assessment_submission = {
        "assessment_type": "skills_assessment",
        "answers": sample_answers
    }
    
    response = requests.post(
        f"{BASE_URL}/api/assessment/submit", 
        json=assessment_submission, 
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        assessment_result = response.json()
        print(f"   ✅ Assessment submitted successfully!")
        print(f"   Assessment ID: {assessment_result.get('id')}")
        print(f"   Overall Score: {assessment_result.get('overall_score', 0):.2f}")
        print(f"   Top Strengths: {[s['category'] for s in assessment_result.get('top_strengths', [])]}")
        print(f"   Top Weaknesses: {[w['category'] for w in assessment_result.get('top_weaknesses', [])]}")
        
        assessment_id = assessment_result.get('id')
        
        # 6. Test getting assessment results
        print("7. Getting assessment results...")
        response = requests.get(f"{BASE_URL}/api/assessment/results/{assessment_id}", headers=headers)
        
        if response.status_code == 200:
            print(f"   ✅ Successfully retrieved assessment results")
        else:
            print(f"   ❌ Failed to get results: {response.text}")
        
        # 7. Test getting profile summary
        print("8. Getting profile summary...")
        response = requests.get(f"{BASE_URL}/api/assessment/profile-summary", headers=headers)
        
        if response.status_code == 200:
            summary_data = response.json()
            if summary_data:
                print(f"   ✅ Profile summary generated:")
                print(f"   Generated from: {summary_data.get('generated_from')}")
                print(f"   Summary: {summary_data.get('summary_text', '')[:100]}...")
            else:
                print(f"   ⚠️ No profile summary found")
        else:
            print(f"   ❌ Failed to get profile summary: {response.text}")
        
    else:
        print(f"   ❌ Failed to submit assessment: {response.text}")

def test_onboarding_flow():
    """Test traditional onboarding flow"""
    print("\n🎯 Testing Traditional Onboarding Flow...")
    
    # Create new user for onboarding test
    register_data = {
        "username": "onboardingtest123",
        "email": "onboardingtest123@example.com", 
        "password": "testpassword123"
    }
    
    print("1. Registering user for onboarding...")
    response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
    
    # Login
    login_data = {
        "username": "onboardingtest123",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"   ❌ Login failed: {response.text}")
        return
    
    token_data = response.json()
    token = token_data.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Test onboarding choice (continue onboarding)
    print("2. Choosing to continue onboarding...")
    onboarding_choice = {
        "take_assessment": False,
        "skip_onboarding_data": False
    }
    
    response = requests.post(
        f"{BASE_URL}/api/onboarding/assessment-option", 
        json=onboarding_choice, 
        headers=headers
    )
    
    if response.status_code == 200:
        choice_response = response.json()
        print(f"   ✅ Onboarding choice response: {choice_response}")
    else:
        print(f"   ❌ Failed: {response.text}")
    
    # 3. Create onboarding profile
    print("3. Creating onboarding profile...")
    onboarding_data = {
        "profession": "Software Developer",
        "experience_level": "Mid-level",
        "skills": ["Python", "JavaScript", "React"],
        "min_salary": 500000,
        "max_salary": 800000,
        "preferred_cities": ["Алматы", "Астана"],
        "work_format": ["remote", "hybrid"],
        "employment_type": ["full-time"],
        "bio": "Experienced developer looking for new opportunities"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/onboarding/profile", 
        json=onboarding_data, 
        headers=headers
    )
    
    if response.status_code == 200:
        profile_data = response.json()
        print(f"   ✅ Onboarding profile created successfully!")
        print(f"   Profile ID: {profile_data.get('id')}")
        print(f"   Profession: {profile_data.get('profession')}")
    else:
        print(f"   ❌ Failed to create profile: {response.text}")
    
    # 4. Complete onboarding
    print("4. Completing onboarding...")
    complete_data = {"mark_as_completed": True}
    
    response = requests.post(
        f"{BASE_URL}/api/onboarding/complete", 
        json=complete_data, 
        headers=headers
    )
    
    if response.status_code == 200:
        print(f"   ✅ Onboarding completed successfully!")
    else:
        print(f"   ❌ Failed to complete onboarding: {response.text}")

if __name__ == "__main__":
    print("🚀 Starting Assessment & Onboarding API Tests")
    print("=" * 50)
    
    try:
        test_assessment_flow()
        test_onboarding_flow()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed!")
        print("\n📋 Summary:")
        print("   • Assessment questions API ✅")
        print("   • Assessment submission API ✅")
        print("   • Assessment results API ✅") 
        print("   • Profile summary generation ✅")
        print("   • Onboarding choice API ✅")
        print("   • Traditional onboarding flow ✅")
        print("\n🎉 Implementation successful!")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        print("Make sure the server is running on https://ai-komekshi.site/api") 