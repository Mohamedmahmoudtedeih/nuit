from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re
from .models import Listing
from .serializers import ListingSerializer, ListingCreateSerializer, ListingListSerializer


class ListingViewSet(viewsets.ModelViewSet):
    """ViewSet for Listing model."""
    
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'purpose', 'status', 'ad_type']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return ListingCreateSerializer
        elif self.action == 'list':
            # Use full serializer for admin users to get all images
            if self.request.user.is_staff:
                return ListingSerializer
            return ListingListSerializer
        return ListingSerializer
    
    def _validate_numeric_param(self, value, param_name, min_val=None, max_val=None):
        """Validate and sanitize numeric query parameters."""
        try:
            num_value = float(value)
            if min_val is not None and num_value < min_val:
                raise ValidationError(f"{param_name} must be >= {min_val}")
            if max_val is not None and num_value > max_val:
                raise ValidationError(f"{param_name} must be <= {max_val}")
            return num_value
        except (ValueError, TypeError):
            raise ValidationError(f"{param_name} must be a valid number")
    
    def _sanitize_string_param(self, value, max_length=255):
        """Sanitize string parameters to prevent injection attacks."""
        if not value:
            return None
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[<>"\';\\]', '', str(value))
        # Limit length
        sanitized = sanitized[:max_length].strip()
        return sanitized if sanitized else None
    
    def get_queryset(self):
        """Filter queryset based on query parameters with security validation."""
        queryset = Listing.objects.all()
        
        # Filter by approved status for public listings
        if self.action == 'list' and not self.request.user.is_staff:
            queryset = queryset.filter(status='approved')
        
        # Additional filters with validation
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        location = self.request.query_params.get('location')
        
        # Car-specific filters
        make = self.request.query_params.get('make')
        min_year = self.request.query_params.get('min_year')
        max_year = self.request.query_params.get('max_year')
        
        # Property-specific filters
        property_type = self.request.query_params.get('property_type')
        min_bedrooms = self.request.query_params.get('min_bedrooms')
        min_bathrooms = self.request.query_params.get('min_bathrooms')
        min_area = self.request.query_params.get('min_area')
        
        # Validate and filter numeric parameters (Django ORM automatically prevents SQL injection)
        if min_price:
            try:
                min_price_val = self._validate_numeric_param(min_price, 'min_price', min_val=0)
                queryset = queryset.filter(price__gte=min_price_val)
            except ValidationError:
                pass  # Ignore invalid parameters
        
        if max_price:
            try:
                max_price_val = self._validate_numeric_param(max_price, 'max_price', min_val=0)
                queryset = queryset.filter(price__lte=max_price_val)
            except ValidationError:
                pass
        
        # Sanitize and filter string parameters (Django ORM uses parameterized queries)
        if location:
            location_sanitized = self._sanitize_string_param(location, max_length=255)
            if location_sanitized:
                queryset = queryset.filter(location__icontains=location_sanitized)
        
        # Car filters with validation
        if make:
            make_sanitized = self._sanitize_string_param(make, max_length=100)
            if make_sanitized:
                queryset = queryset.filter(car_details__make__icontains=make_sanitized)
        
        if min_year:
            try:
                min_year_val = self._validate_numeric_param(min_year, 'min_year', min_val=1900, max_val=2100)
                queryset = queryset.filter(car_details__year__gte=int(min_year_val))
            except ValidationError:
                pass
        
        if max_year:
            try:
                max_year_val = self._validate_numeric_param(max_year, 'max_year', min_val=1900, max_val=2100)
                queryset = queryset.filter(car_details__year__lte=int(max_year_val))
            except ValidationError:
                pass
        
        # Property filters with validation
        if property_type:
            property_type_sanitized = self._sanitize_string_param(property_type, max_length=50)
            if property_type_sanitized:
                queryset = queryset.filter(property_details__property_type=property_type_sanitized)
        
        if min_bedrooms:
            try:
                min_bedrooms_val = self._validate_numeric_param(min_bedrooms, 'min_bedrooms', min_val=0, max_val=50)
                queryset = queryset.filter(property_details__bedrooms__gte=int(min_bedrooms_val))
            except ValidationError:
                pass
        
        if min_bathrooms:
            try:
                min_bathrooms_val = self._validate_numeric_param(min_bathrooms, 'min_bathrooms', min_val=0, max_val=50)
                queryset = queryset.filter(property_details__bathrooms__gte=int(min_bathrooms_val))
            except ValidationError:
                pass
        
        if min_area:
            try:
                min_area_val = self._validate_numeric_param(min_area, 'min_area', min_val=0)
                queryset = queryset.filter(property_details__area__gte=min_area_val)
            except ValidationError:
                pass
        
        return queryset.select_related('user', 'car_details', 'property_details').prefetch_related('images')
    
    def perform_create(self, serializer):
        """Set the user when creating a listing."""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Create a listing and return full listing data."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Get the created listing instance
        listing = serializer.instance
        
        # Return full listing data using ListingSerializer
        full_serializer = ListingSerializer(listing, context={'request': request})
        headers = self.get_success_headers(full_serializer.data)
        return Response(full_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_listings(self, request):
        """Get current user's listings."""
        listings = self.get_queryset().filter(user=request.user)
        # Use ListingSerializer to get full data including images
        serializer = ListingSerializer(listings, many=True, context={'request': request})
        return Response({'results': serializer.data})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve a listing (admin only)."""
        if not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        listing = self.get_object()
        listing.status = 'approved'
        listing.save()
        return Response({'message': 'Listing approved successfully.'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject a listing (admin only)."""
        if not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        listing = self.get_object()
        listing.status = 'rejected'
        listing.save()
        return Response({'message': 'Listing rejected.'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_sold(self, request, pk=None):
        """Mark a listing as sold."""
        listing = self.get_object()
        
        # Only the owner or admin can mark as sold
        if listing.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to perform this action.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        listing.status = 'sold'
        listing.save()
        return Response({'message': 'Listing marked as sold.'})

