# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model 
from django.contrib.auth.password_validation import validate_password
from django.utils.http import  urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator

CustomUser = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'is_active', 'is_staff', 'date_joined')
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ('email', 'password')

    def create(self, validated_data):
        validated_data.pop('password')
        validated_data['username'] = validated_data['email']
        user = CustomUser.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        try:
            uid = force_str(urlsafe_base64_decode(attrs["uid"]))
        except Exception:
            raise serializers.ValidationError({"uid": "invalid"})
        try:
            user = CustomUser.objects.get(pk=uid)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"uid": "invalid"})
        if not PasswordResetTokenGenerator().check_token(user, attrs["token"]):
            raise serializers.ValidationError({"token": "invalid"})
        attrs["user"] = user
        return attrs
