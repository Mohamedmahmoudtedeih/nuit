from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from .serializers import UserSerializer, UserRegistrationSerializer, LoginSerializer

User = get_user_model()


def _check_rate_limit(request, key_prefix, max_attempts=5, window_minutes=15):
    """Check rate limit for an action."""
    # Get client IP
    ip_address = request.META.get('REMOTE_ADDR', 'unknown')
    cache_key = f"{key_prefix}_{ip_address}"
    
    # Get current attempts
    attempts = cache.get(cache_key, 0)
    
    if attempts >= max_attempts:
        return False, f"Too many attempts. Please try again in {window_minutes} minutes."
    
    # Increment attempts
    cache.set(cache_key, attempts + 1, window_minutes * 60)
    return True, None


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """Register a new user with rate limiting."""
    # Rate limiting: 5 registrations per 15 minutes per IP
    allowed, error_msg = _check_rate_limit(request, 'register', max_attempts=5, window_minutes=15)
    if not allowed:
        return Response({'error': error_msg}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """Login user and return JWT tokens with rate limiting."""
    # Rate limiting: 10 login attempts per 15 minutes per IP
    allowed, error_msg = _check_rate_limit(request, 'login', max_attempts=10, window_minutes=15)
    if not allowed:
        return Response({'error': error_msg}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    serializer = LoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    """Get current user profile."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update current user profile."""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

