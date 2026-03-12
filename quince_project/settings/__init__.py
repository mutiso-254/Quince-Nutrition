# Default settings import
# The settings package contains environment-specific modules.
# By default, we load development settings. Production deployments should
# set the DJANGO_SETTINGS_MODULE env var to
# 'quince_project.settings.prod' or another appropriate module.

from .dev import *
