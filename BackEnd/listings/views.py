from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
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
            return ListingListSerializer
        return ListingSerializer
    
    def get_queryset(self):
        """Filter queryset based on query parameters."""
        queryset = Listing.objects.all()
        
        # Filter by approved status for public listings
        if self.action == 'list' and not self.request.user.is_staff:
            queryset = queryset.filter(status='approved')
        
        # Additional filters
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
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Car filters
        if make:
            queryset = queryset.filter(car_details__make__icontains=make)
        if min_year:
            queryset = queryset.filter(car_details__year__gte=min_year)
        if max_year:
            queryset = queryset.filter(car_details__year__lte=max_year)
        
        # Property filters
        if property_type:
            queryset = queryset.filter(property_details__property_type=property_type)
        if min_bedrooms:
            queryset = queryset.filter(property_details__bedrooms__gte=min_bedrooms)
        if min_bathrooms:
            queryset = queryset.filter(property_details__bathrooms__gte=min_bathrooms)
        if min_area:
            queryset = queryset.filter(property_details__area__gte=min_area)
        
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
        serializer = self.get_serializer(listings, many=True)
        return Response(serializer.data)
    
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

