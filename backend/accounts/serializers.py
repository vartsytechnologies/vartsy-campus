from rest_framework import serializers
from django.contrib.auth.models import User
from .models import OnboardModel
from django.contrib.auth.hashers import make_password


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user


class OnboardSerializer(serializers.ModelSerializer):
    schoolLogoImage = serializers.ImageField(required=False)

    class Meta:
        model = OnboardModel
        fields = '__all__'
        read_only_fields = ('user', 'dateOnboarded')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserDashboardSerializer(serializers.ModelSerializer):
    onboard = OnboardSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'date_joined', 'onboard')