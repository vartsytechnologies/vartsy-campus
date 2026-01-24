from __future__ import annotations
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError

CustomUser = get_user_model()

AVAILABLE = {f.name for f in CustomUser._meta.get_fields()}
DESIRED = ("id", "email", "first_name", "last_name", "role", "is_email_verified", "avatar_url", "auth_provider", "date_joined","provider_account_id")
ME_FIELDS = [f for f in DESIRED if f in AVAILABLE]

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    auth_provider = serializers.CharField(required=False, allow_blank=True)
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate_email(self, value: str) -> str:
        email = value.lower()
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.pop("email")
        extra = {k: v for k, v in validated_data.items() if k in AVAILABLE}

        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            **extra,
        )
        return user

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ME_FIELDS
        read_only_fields = tuple(f for f in ("id", "email", "auth_provider", "is_email_verified","date_joined","provider_account_id") if f in ME_FIELDS)

class LoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

class EmailVerificationSendSerializer(serializers.Serializer):
    # optional; if omitted and user is authenticated, we'll use request.user.email
    email = serializers.EmailField(required=False)
    
    def validate_email(self, value: str) -> str:
        email = value.lower()
        if not CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("No user is associated with this email.")
        return email

class EmailVerificationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

class GoogleOneTapSerializer(serializers.Serializer):
    credential = serializers.CharField()
