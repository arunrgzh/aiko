# AI-Komekshi Backend Startup Guide

## Issues Fixed

This guide addresses the following issues:

1. **ImportError: attempted relative import with no known parent package**
2. **OpenAPI/Swagger documentation not accessible**
3. **Missing package structure**

## Prerequisites

1. Make sure you have Python 3.8+ installed
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual configuration values.

## How to Start the Server

### Option 1: Use the startup script (Recommended)

```bash
cd backend
python start_server.py
```

### Option 2: Use uvicorn directly

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Use the run.py script

```bash
cd backend
python run.py
```

## Accessing API Documentation

Once the server is running, you can access:

-   **Swagger UI**: http://REDACTED:8000/docs
-   **ReDoc**: http://REDACTED:8000/redoc
-   **OpenAPI JSON**: http://REDACTED:8000/openapi.json
-   **Health Check**: http://REDACTED:8000/health

## Common Issues and Solutions

### 1. Import Errors

-   **Problem**: `ImportError: attempted relative import with no known parent package`
-   **Solution**: Never run `python app/main.py` directly. Always use uvicorn or the startup scripts.

### 2. Missing Environment Variables

-   **Problem**: Database or API connection errors
-   **Solution**: Make sure your `.env` file contains all required variables from `.env.example`

### 3. Swagger/OpenAPI Not Loading

-   **Problem**: Blank page or errors when accessing `/docs`
-   **Solution**:
    -   Check that the server started without errors
    -   Verify all imports are working
    -   Check the console for any Python syntax errors

### 4. Database Issues

-   **Problem**: SQLAlchemy errors on startup
-   **Solution**: Make sure the `DATABASE_URL` in your `.env` file is correct

## Project Structure

The backend now has proper package structure with `__init__.py` files:

```
backend/
├── app/
│   ├── __init__.py          # Main package
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── database.py          # Database setup
│   ├── api/
│   │   ├── __init__.py      # API package
│   │   ├── auth.py          # Authentication routes
│   │   ├── assistants.py    # Assistant routes
│   │   └── onboarding.py    # Onboarding routes
│   ├── models/
│   │   ├── __init__.py      # Models package
│   │   └── ...              # SQLAlchemy models
│   ├── schemas/
│   │   ├── __init__.py      # Schemas package
│   │   └── ...              # Pydantic schemas
│   └── auth/
│       ├── __init__.py      # Auth package
│       └── ...              # Authentication modules
├── start_server.py          # Simple startup script
├── run.py                   # Advanced startup script
├── requirements.txt         # Dependencies
└── .env.example            # Environment template
```

## Development Tips

1. **Always use uvicorn** for running the FastAPI application
2. **Never run main.py directly** - it has relative imports
3. **Check logs** for any import or configuration errors
4. **Use hot reload** with `--reload` flag for development
5. **Test API endpoints** using the Swagger UI at `/docs`

## Environment Variables

Make sure your `.env` file includes:

```env
DATABASE_URL=sqlite+aiosqlite:///./ai_komek.db
SECRET_KEY=your-secret-key-here
FRONTEND_URL=http://REDACTED:3000
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_BASE_URL=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```
