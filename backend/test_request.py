from django.test import Client
from django.conf import settings

client = Client()

# Test with registered domains
for domain in ['localhost', '127.0.0.1']:
    response = client.get('/healthz/', HTTP_HOST=f'{domain}:8000')
    print(f"Domain {domain}: Status {response.status_code}")
    if response.status_code != 404:
        print(f"  Content: {response.content[:100]}")

