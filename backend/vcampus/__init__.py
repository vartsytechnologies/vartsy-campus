"""
Package initializer for the vcampus Django project.
"""
from .celery import app as celery_app

__all__ = ('celery_app',)
