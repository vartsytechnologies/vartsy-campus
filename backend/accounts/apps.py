from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        # import the spectacular extension so drf-spectacular discovers it
        try:
            # ensure OpenAPI auth extension is registered
            from . import schema  # noqa: F401
        except Exception:
            # ignore if the optional module is missing or fails to import
            pass