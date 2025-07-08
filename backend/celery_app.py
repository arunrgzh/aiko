"""
Celery configuration for AI-Komek job recommendations
Run with: celery -A celery_app worker --loglevel=info
Beat scheduler: celery -A celery_app beat --loglevel=info
"""

import os
from celery import Celery
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Celery
celery_app = Celery('ai_komek_jobs')

# Configuration
celery_app.conf.update(
    # Broker settings
    broker_url=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    result_backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
    
    # Task settings
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Asia/Almaty',
    enable_utc=True,
    
    # Worker settings
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=1000,
    
    # Beat schedule for automatic tasks
    beat_schedule={
        'update-job-recommendations-hourly': {
            'task': 'app.tasks.job_recommendations.update_all_user_recommendations',
            'schedule': 3600.0,  # Every hour
            'options': {'queue': 'job_recommendations'}
        },
        'cleanup-old-recommendations-daily': {
            'task': 'app.tasks.job_recommendations.cleanup_old_recommendations',
            'schedule': 86400.0,  # Every day
            'options': {'queue': 'maintenance'}
        },
    },
    
    # Queue routing
    task_routes={
        'app.tasks.job_recommendations.update_user_recommendations': {'queue': 'job_recommendations'},
        'app.tasks.job_recommendations.update_all_user_recommendations': {'queue': 'job_recommendations'},
        'app.tasks.job_recommendations.cleanup_old_recommendations': {'queue': 'maintenance'},
        'app.tasks.job_recommendations.trigger_user_update': {'queue': 'job_recommendations'},
        'app.tasks.job_recommendations.trigger_batch_update': {'queue': 'job_recommendations'},
    },
    
    # Task time limits
    task_soft_time_limit=300,  # 5 minutes
    task_time_limit=600,       # 10 minutes
    
    # Result settings
    result_expires=3600,  # 1 hour
    
    # Error handling
    task_reject_on_worker_lost=True,
    task_ignore_result=False,
)

# Import tasks to register them
from app.tasks import job_recommendations

if __name__ == '__main__':
    celery_app.start() 