#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vcampus.settings')
django.setup()

from django.test import RequestFactory
from django_tenants.middleware.main import TenantMainMiddleware
from tenancy.models import SchoolDomain

print("=== Testing hostname extraction ===")
middleware = TenantMainMiddleware(lambda r: r)
factory = RequestFactory()

for test_host in ['localhost', '127.0.0.1', 'localhost:8000', '127.0.0.1:8000']:
    req = factory.get('/', HTTP_HOST=test_host)
    hostname = middleware.hostname_from_request(req)
    print(f"  HTTP_HOST: {test_host:20} -> hostname: {hostname}")
    
    # Try to find the domain
    try:
        domain = SchoolDomain.objects.get(domain=hostname)
        print(f"    Found: {domain.domain} -> {domain.tenant.name}")
    except SchoolDomain.DoesNotExist:
        print(f"    NOT FOUND in database")
