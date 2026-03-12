from .base import *

# Production-specific overrides
DEBUG = False

# TODO: set real hosts in environment or here
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', '').split(',') if os.getenv('DJANGO_ALLOWED_HOSTS') else []

# Disable CORS in prod or configure appropriately
CORS_ALLOW_ALL_ORIGINS = False
# further production configuration...