# AI-Komekshi Application Setup Guide

This guide will help you set up the complete AI-Komekshi application with a FastAPI backend and Next.js frontend, including the onboarding system.

## 🚀 Quick Start with Docker

The easiest way to get started is using Docker Compose (frontend + backend + Postgres + Redis):

```bash
# Clone the repository
git clone <your-repo-url>
cd AI-Komek

# (First time) Create minimal env files used by docker-compose
# Backend env (production-like)
printf "DATABASE_URL=postgresql+asyncpg://REDACTED:REDACTED@postgres:5432/ai_komek\nSECRET_KEY=change-me-in-prod\nFRONTEND_URL=http://localhost:3000\nENVIRONMENT=production\nDEBUG=False\n" > backend/.env.production

# Frontend env (production-like)
printf "NEXT_PUBLIC_API_URL=http://localhost:8000\nNEXTAUTH_SECRET=change-me\nNEXTAUTH_URL=http://localhost:3000\n" > front/.env.production

# Build & start
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## 🛠️ Manual Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (optional for development; required for production)
- Redis (optional for development; used for advanced features/production)

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

4. **Create `.env` file:**

    Choose one of the options below.

    - SQLite (simplest local dev; no DB service needed):

        ```env
        DATABASE_URL=sqlite+aiosqlite:///./ai_komek.db
        SECRET_KEY=your-secret-key-here-change-this
        FRONTEND_URL=http://localhost:3000
        ENVIRONMENT=development
        DEBUG=True
        ```

    - PostgreSQL (local/production-like):

        ```env
        DATABASE_URL=postgresql+asyncpg://<user>:<password>@localhost:5432/<db>
        SECRET_KEY=your-secret-key-here-change-this
        FRONTEND_URL=http://localhost:3000
        ENVIRONMENT=development
        DEBUG=True
        # Optional
        REDIS_URL=redis://localhost:6379
        ```

5. **(If using PostgreSQL) Create database:**

    ```bash
    createdb ai_komek
    ```

6. **Run the backend:**

    Any of the following works:

    ```bash
    # Easiest
    python run.py

    # Or with uvicorn
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

    # Or via npm script (provided in backend/package.json)
    npm run dev
    ```

### Frontend Setup

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Create `.env.local`:**

    ```env
    # Base URL for the backend API
    NEXT_PUBLIC_API_URL=http://localhost:8000

    # NextAuth
    NEXTAUTH_SECRET=your-nextauth-secret-here
    NEXTAUTH_URL=http://localhost:3000
    ```

3. **Run the frontend:**
    ```bash
    npm run dev
    ```

## 📋 Environment Variables

### Backend (.env)

```env
# Database (choose one)
# SQLite for local dev
DATABASE_URL=sqlite+aiosqlite:///./ai_komek.db

# Or PostgreSQL
# DATABASE_URL=postgresql+asyncpg://REDACTED:REDACTED@localhost:5432/ai_komek

# Security
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis (optional)
# REDIS_URL=redis://localhost:6379

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=True

# Optional Azure/OpenAI (only if you plan to use them)
# AZURE_OPENAI_API_KEY=...
# AZURE_OPENAI_BASE_URL=...
# AZURE_OPENAI_API_VERSION=2024-06-01
# OPENAI_API_KEY=...
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## 🔐 Authentication Flow

1. **User Registration:** `POST /api/auth/register`
2. **User Login:** `POST /api/auth/login`
3. **Token Refresh:** `POST /api/auth/refresh`

## 🎯 Onboarding Flow

The onboarding system includes 5 steps:

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

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

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

### Database Migrations (if using PostgreSQL)

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
# Ensure backend/.env.production and front/.env.production are set appropriately

# Build production images
docker-compose build

# Run production stack
docker-compose up -d
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

    - Ensure PostgreSQL is running (if using Postgres)
    - Check `DATABASE_URL` in `.env`
    - Verify database exists

2. **CORS Errors**

    - Check `FRONTEND_URL` in backend `.env`
    - Ensure frontend URL matches exactly (including scheme and port)

3. **Authentication Issues**

    - Verify `NEXTAUTH_SECRET` is set
    - Check `NEXT_PUBLIC_API_URL` in frontend `.env`
    - Ensure backend is running on the expected port

4. **Onboarding Not Working**
    - Check if user has `is_first_login: true`
    - Verify onboarding API endpoints are accessible
    - Check browser console and network tab for errors

## 📞 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs`
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check the API documentation at http://localhost:8000/docs

## 🎉 Next Steps

After successful setup:

1. Register a new user
2. Complete the onboarding flow
3. Explore the dashboard
4. Customize the application for your needs

Happy coding! 🚀
