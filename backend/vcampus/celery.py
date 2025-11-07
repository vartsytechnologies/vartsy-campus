import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vcampus.settings')

app = Celery('vcampus')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
