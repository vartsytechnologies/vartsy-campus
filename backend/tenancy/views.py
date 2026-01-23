# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from accounts.utils import IsVerified

class WhoAmIInTenantView(APIView):
    permission_classes = [IsAuthenticated,IsVerified]
    @extend_schema(
        responses={200: {
            "type": "object",
            "properties": {
                "user": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "email": {"type": "string"},
                        "username": {"type": "string"},
                    },
                },
                "tenant": {
                    "type": "object",
                    "properties": {
                        "schema": {"type": "string", "nullable": True},
                        "name": {"type": "string", "nullable": True},
                    },
                },
                "role_in_tenant": {"type": "string", "nullable": True},
            },
        }},
        description="Get information about the current user, their tenant (school), and their role within that tenant.",
        tags=["Tenancy"],
    )
    def get(self, request):
        user = request.user
        tenant = getattr(request, "tenant", None)
        role = None
        if tenant and hasattr(user, "memberships"):
            m = user.memberships.filter(school=tenant, is_active=True).first()
            role = m.role if m else None

        return Response({
            "user": {"id": user.id, "email": user.email, "username": user.username},
            "tenant": {
                "schema": getattr(tenant, "schema_name", None),
                "name": getattr(tenant, "name", None),
            },
            "role_in_tenant": role,
        })
