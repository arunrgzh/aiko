# Vacancy Recommendations Debug Guide

## Issue Analysis

The user was getting 0 job recommendations despite having completed onboarding with skills like:

-   Видеомонтаж (Video editing)
-   Графический дизайн (Graphic design)
-   SMM
-   Копирайтинг (Copywriting)
-   Коммуникации (Communications)
-   Телемаркетинг (Telemarketing)

## Root Cause Found

The main issue was that the user's profession was set to "безработный" (unemployed), which was being used as a job title in HeadHunter API searches. This resulted in no matches.

## Fixes Applied

### 1. Skip "безработный" as Job Title

```python
# backend/app/services/headhunter_service.py
if onboarding_profile.profession is not None:
    # Don't use "безработный" as a job title - use skills instead
    if onboarding_profile.profession.lower() not in ["безработный", "unemployed", "без работы"]:
        preferences_data["preferred_job_titles"] = [onboarding_profile.profession]
```

### 2. Better Search Parameters Construction

-   If no job titles, use skills for search
-   Added fallback search for entry-level positions
-   Improved search term prioritization

### 3. Enhanced Debug Endpoints

-   Added detailed user search parameter testing
-   Enhanced skills debug information
-   Added direct HeadHunter API testing

## Debug Tools Created

### 1. Debug HTML Tool (`front/debug_vacancies.html`)

Navigate to: `http://REDACTED:3000/debug_vacancies.html`

This tool provides:

-   **Skills Debug**: Shows user's onboarding data and preferences
-   **User Search Test**: Tests the exact search parameters used for the user
-   **Recommendations Test**: Tests the full recommendation pipeline
-   **HeadHunter API Test**: Tests direct API access with common searches
-   **Full Diagnostic**: Runs all tests in sequence

### 2. Backend Debug Endpoints

#### `/api/jobs/debug/skills`

Shows detailed user information:

-   Onboarding completion status
-   Skills and preferences data
-   Recent recommendations
-   Search parameters that would be used

#### `/api/jobs/debug/test-search`

Tests the HeadHunter API with user's actual search parameters:

-   Shows exact parameters sent to HH API
-   Returns actual vacancy results
-   Helps identify if the issue is in search parameters or API response

## How to Use

### For Users Getting 0 Recommendations:

1. **Open the debug tool**: Navigate to `/debug_vacancies.html`
2. **Run Full Diagnostic**: Click the "🚀 Run Full Diagnostic" button
3. **Check results**:
    - ✅ Green sections indicate working components
    - ❌ Red sections indicate issues
    - 🔍 Focus on "User Search Test" results

### Common Issues and Solutions:

1. **No search terms generated**:

    - Check if user has skills in onboarding
    - Verify profession is not "безработный"
    - Solution: Re-run onboarding or manually set preferences

2. **HeadHunter API returns 0 results**:

    - Check if search terms are too specific
    - Verify area IDs are correct
    - Solution: Broaden search criteria

3. **Search parameters missing**:
    - Check if user preferences were created
    - Verify onboarding data was properly mapped
    - Solution: Force preference recreation

## Testing the Fix

After applying the fixes, test with the debug tool:

1. Clear any existing job preferences for the user
2. Run the "User Search Test" to see new search parameters
3. Check that skills are now used instead of "безработный"
4. Verify HeadHunter API returns results

## Expected Results

With the fixes, users with profession "безработный" should now:

1. Have their skills used for job searches instead of the profession
2. Get fallback searches for entry-level positions
3. Receive relevant job recommendations based on their actual skills

## Future Improvements

1. **Skill Synonyms**: Add better mapping between user skills and job search terms
2. **Experience Level**: Better handling of "no experience" users
3. **Location Flexibility**: Expand search to nearby cities if no local results
4. **Feedback Learning**: Improve recommendations based on user feedback

## Monitoring

Use these metrics to monitor recommendation effectiveness:

-   Percentage of users getting 0 recommendations
-   Average number of recommendations per user
-   User feedback on recommendation relevance
-   HeadHunter API response rates and errors
