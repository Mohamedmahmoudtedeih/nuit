from django.contrib.auth.backends import BaseBackend
from .models import User


class PhoneBackend(BaseBackend):
    """Custom authentication backend for phone-based authentication."""
    
    def authenticate(self, request, phone=None, password=None, **kwargs):
        """Authenticate user using phone number."""
        if phone is None:
            phone = kwargs.get('phone')
        
        if not phone:
            return None
        
        # Normalize phone number - try with and without +
        phone_normalized = phone.strip()
        phone_without_plus = phone_normalized.lstrip('+')
        
        try:
            # Try exact match first
            user = User.objects.get(phone=phone_normalized)
        except User.DoesNotExist:
            try:
                # Try without + sign
                user = User.objects.get(phone=phone_without_plus)
            except User.DoesNotExist:
                try:
                    # Try with + sign
                    user = User.objects.get(phone=f'+{phone_without_plus}')
                except User.DoesNotExist:
                    return None
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
    
    def user_can_authenticate(self, user):
        """Check if user can authenticate."""
        is_active = getattr(user, 'is_active', None)
        return is_active or is_active is None
    
    def get_user(self, user_id):
        """Get user by ID."""
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

