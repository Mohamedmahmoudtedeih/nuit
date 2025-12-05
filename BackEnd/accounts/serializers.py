from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'phone', 'email', 'full_name', 'profile_picture', 'role', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['phone', 'email', 'full_name', 'password', 'confirm_password', 'profile_picture']
    
    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs
    
    def create(self, validated_data):
        """Create a new user."""
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        """Validate user credentials."""
        phone = attrs.get('phone')
        password = attrs.get('password')
        
        if phone and password:
            user = authenticate(request=self.context.get('request'), phone=phone, password=password)
            if not user:
                raise serializers.ValidationError('Invalid phone number or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "phone" and "password".')
        
        return attrs

