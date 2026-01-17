from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        # import the spectacular extension so drf-spectacular discovers it
        try:
            # use a relative import so static analyzers resolve the module within the package
            from . import spectacular_auth  # noqa: F401
        except Exception:
            # ignore if the optional module is missing or fails to import
            pass