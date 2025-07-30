# XROX Application Setup Guide

This guide will help you set up the complete XROX application with a FastAPI backend and Next.js frontend, including the new onboarding system.

## 🚀 Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd xrox-front-end

# Start all services
docker-compose -f docker-compose.full.yml up -d

# The application will be available at:
# Frontend: http://REDACTED:3000
# Backend API: https://ai-komekshi.site/api
# API Documentation: https://ai-komekshi.site/api/docs
```

## 🛠️ Manual Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL
- Redis (optional)

### Backend Setup

1. **Navigate to backend directory:**

    ```bash
    cd backend
    ```

2. **Create virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up environment variables:**

    ```bash
    cp env.example .env
    # Edit .env with your configuration
    ```

5. **Set up database:**

    ```bash
    # Create PostgreSQL database
    createdb xrox_db

    # The tables will be created automatically when you run the app
    ```

6. **Run the backend:**
    ```bash
    python run.py
    ```

### Frontend Setup

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

    ```env
    API_URL=https://ai-komekshi.site/api
    NEXTAUTH_SECRET=your-nextauth-secret-here
    NEXTAUTH_URL=http://REDACTED:3000
    ```

3. **Run the frontend:**
    ```bash
    npm run dev
    ```

## 📋 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@REDACTED:5432/xrox_db

# Security
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis
REDIS_URL=redis://REDACTED:6379

# Frontend URL for CORS
FRONTEND_URL=http://REDACTED:3000

# Environment
ENVIRONMENT=development
DEBUG=True
```

### Frontend (.env.local)

```env
API_URL=https://ai-komekshi.site/api
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://REDACTED:3000
```

## 🔐 Authentication Flow

1. **User Registration:** `POST /api/auth/register`
2. **User Login:** `POST /api/auth/login`
3. **Token Refresh:** `POST /api/auth/refresh`

## 🎯 Onboarding Flow

The new onboarding system includes 5 steps:

1. **Personal Information** - Name, phone, date of birth, gender
2. **Professional Information** - Current position, experience, industry
3. **Skills** - Add and manage skills with popular suggestions
4. **Preferences** - Job types, locations, salary expectations
5. **Completion** - Bio, LinkedIn, portfolio, and profile summary

### Onboarding API Endpoints

- `GET /api/onboarding/profile` - Get user's onboarding profile
- `POST /api/onboarding/profile` - Create/update onboarding profile
- `PUT /api/onboarding/profile` - Update onboarding profile
- `POST /api/onboarding/complete` - Mark onboarding as completed
- `GET /api/onboarding/progress` - Get onboarding progress

## 🗄️ Database Schema

### Users Table

- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `hashed_password` - Bcrypt hashed password
- `is_active` - Account status
- `is_verified` - Email verification status
- `is_first_login` - First login flag for onboarding

### Onboarding Profiles Table

- `user_id` - Foreign key to User
- Personal information fields (first_name, last_name, phone, etc.)
- Professional information fields (current_position, years_of_experience, etc.)
- Skills and preferences (skills, preferred_job_types, etc.)
- Progress tracking (onboarding_completed, current_step, total_steps)

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
npm test
```

## 📚 API Documentation

Once the backend is running, you can access:

- **Swagger UI:** https://ai-komekshi.site/api/docs
- **ReDoc:** https://ai-komekshi.site/api/redoc

## 🔧 Development

### Backend Development

```bash
cd backend
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
npm run dev
```

### Database Migrations

```bash
cd backend
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## 🚀 Deployment

### Production Environment Variables

Make sure to update the following for production:

- `SECRET_KEY` - Use a strong, random secret
- `DATABASE_URL` - Use production database
- `FRONTEND_URL` - Use production frontend URL
- `ENVIRONMENT=production`
- `DEBUG=False`

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run production stack
docker-compose -f docker-compose.prod.yml up -d
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

    - Ensure PostgreSQL is running
    - Check DATABASE_URL in .env
    - Verify database exists

2. **CORS Errors**

    - Check FRONTEND_URL in backend .env
    - Ensure frontend URL matches exactly

3. **Authentication Issues**

    - Verify NEXTAUTH_SECRET is set
    - Check API_URL in frontend .env
    - Ensure backend is running on correct port

4. **Onboarding Not Working**
    - Check if user has `is_first_login: true`
    - Verify onboarding API endpoints are accessible
    - Check browser console for errors

## 📞 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs`
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check the API documentation at https://ai-komekshi.site/api/docs

## 🎉 Next Steps

After successful setup:

1. Register a new user
2. Complete the onboarding flow
3. Explore the dashboard
4. Customize the application for your needs

Happy coding! 🚀
