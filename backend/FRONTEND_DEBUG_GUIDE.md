# 🐛 Frontend Authentication Debug Guide

## The Real Problem

Your backend is 100% working. The issue is your **frontend authentication**.

Console errors show:

-   ❌ `GET http://REDACTED:8000/notifications/count 401 (Unauthorized)`
-   ❌ `GET http://REDACTED:8000/main/assistants/1 401 (Unauthorized)`

## Step-by-Step Fix

### 1. **Check if JWT Token is Being Saved**

Open browser dev tools and check if token is stored:

```javascript
// In browser console, check token storage:
console.log('localStorage token:', localStorage.getItem('access_token'))
console.log('sessionStorage token:', sessionStorage.getItem('access_token'))
console.log('Any token in memory:', window.token) // if using memory storage
```

### 2. **Check API Calls Are Sending Authorization Header**

In browser dev tools Network tab:

1. Look for failed requests (red status)
2. Click on the failed request
3. Check **Request Headers** section
4. Verify you see: `Authorization: Bearer eyJ...`

If **NO Authorization header** = Your frontend isn't sending the token.

### 3. **Test Login Flow**

Run this in browser console on your frontend:

```javascript
// Test login and token saving
async function testLogin() {
    const response = await fetch('http://REDACTED:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'testuser123',
            password: 'testpassword123',
        }),
    })

    const data = await response.json()
    console.log('Login response:', data)

    // Save token (your frontend should do this)
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
        console.log('✅ Token saved to localStorage')
    }

    return data.access_token
}

// Test protected endpoint
async function testProtectedEndpoint() {
    const token = localStorage.getItem('access_token')

    if (!token) {
        console.log('❌ No token found!')
        return
    }

    const response = await fetch('http://REDACTED:8000/notifications/count', {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    console.log('Protected endpoint status:', response.status)
    if (response.ok) {
        console.log('✅ Protected endpoint working!')
        console.log('Response:', await response.json())
    } else {
        console.log('❌ Still unauthorized:', await response.text())
    }
}

// Run tests
testLogin().then(() => testProtectedEndpoint())
```

### 4. **Common Frontend Fixes**

#### Fix #1: Token Storage

Make sure your login component saves the token:

```javascript
// After successful login:
const loginResponse = await fetch('/api/auth/login', { ... });
const data = await loginResponse.json();

// ✅ Save token
localStorage.setItem('access_token', data.access_token);
// or
sessionStorage.setItem('access_token', data.access_token);
```

#### Fix #2: API Client Headers

Make sure your API client includes the token:

```javascript
// ✅ Correct API call
const token = localStorage.getItem('access_token')
const response = await fetch(url, {
    headers: {
        Authorization: `Bearer ${token}`, // ← This is CRITICAL
        'Content-Type': 'application/json',
    },
})
```

#### Fix #3: Axios Interceptor (if using Axios)

```javascript
// Add request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
```

### 5. **Check Your Current Frontend Code**

Look for these files in your frontend:

-   `src/services/ApiService.ts`
-   `src/utils/hooks/useAuth.ts` or similar
-   Login component files

Make sure they're:

1. ✅ Saving JWT token after login
2. ✅ Including `Authorization: Bearer ${token}` in ALL API requests
3. ✅ Using the correct backend URL (`http://REDACTED:8000`)

### 6. **Quick Frontend Test**

Add this to any React component to test:

```tsx
// Test component to verify auth
export function AuthTest() {
    const testAPI = async () => {
        try {
            // Test login
            const loginResp = await fetch(
                'http://REDACTED:8000/api/auth/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: 'testuser123',
                        password: 'testpassword123',
                    }),
                }
            )
            const { access_token } = await loginResp.json()

            // Test protected endpoint
            const protectedResp = await fetch(
                'http://REDACTED:8000/notifications/count',
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            )

            if (protectedResp.ok) {
                alert('✅ API Working!')
            } else {
                alert('❌ API Failed: ' + protectedResp.status)
            }
        } catch (error) {
            alert('❌ Error: ' + error.message)
        }
    }

    return <button onClick={testAPI}>Test API</button>
}
```

## Expected Fix Result

After fixing the frontend authentication:

-   ✅ Login should save JWT token
-   ✅ All API requests should include `Authorization: Bearer ${token}`
-   ✅ No more 401 Unauthorized errors
-   ✅ Chat should work properly

## Next Steps

1. **Run the browser console tests above**
2. **Check your frontend code** for token handling
3. **Fix the authentication headers**
4. **Test again**

The backend is ready and waiting! 🚀
