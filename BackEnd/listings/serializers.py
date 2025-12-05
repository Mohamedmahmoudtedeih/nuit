from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Listing, ListingImage, CarDetails, PropertyDetails


class ListingImageSerializer(serializers.ModelSerializer):
    """Serializer for listing images."""
    
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'image_url', 'order']
        read_only_fields = ['id']
    
    def get_image_url(self, obj):
        """Get full image URL."""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CarDetailsSerializer(serializers.ModelSerializer):
    """Serializer for car details."""
    
    class Meta:
        model = CarDetails
        fields = ['make', 'model', 'year', 'mileage', 'fuel_type', 'transmission', 'color', 'engine_size']


class PropertyDetailsSerializer(serializers.ModelSerializer):
    """Serializer for property details."""
    
    class Meta:
        model = PropertyDetails
        fields = ['property_type', 'bedrooms', 'bathrooms', 'area', 'floor', 'furnished', 'amenities']


class ListingSerializer(serializers.ModelSerializer):
    """Serializer for Listing model."""
    
    images = ListingImageSerializer(many=True, read_only=True)
    car_details = CarDetailsSerializer(read_only=True)
    property_details = PropertyDetailsSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'type', 'purpose', 'price', 'currency',
            'location', 'status', 'ad_type', 'user', 'user_id', 'images',
            'car_details', 'property_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class ListingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating listings."""
    
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    car_details = CarDetailsSerializer(required=False)
    property_details = PropertyDetailsSerializer(required=False)
    
    class Meta:
        model = Listing
        fields = [
            'title', 'description', 'type', 'purpose', 'price', 'currency',
            'location', 'ad_type', 'images', 'car_details', 'property_details'
        ]
    
    def create(self, validated_data):
        """Create listing with images and details."""
        images_data = validated_data.pop('images', [])
        car_details_data = validated_data.pop('car_details', None)
        property_details_data = validated_data.pop('property_details', None)
        
        # Get user from request
        user = self.context['request'].user
        validated_data['user'] = user
        
        # Create listing
        listing = Listing.objects.create(**validated_data)
        
        # Create images
        for index, image in enumerate(images_data):
            ListingImage.objects.create(listing=listing, image=image, order=index)
        
        # Create car details if provided
        if car_details_data:
            CarDetails.objects.create(listing=listing, **car_details_data)
        
        # Create property details if provided
        if property_details_data:
            PropertyDetails.objects.create(listing=listing, **property_details_data)
        
        return listing
    
    def update(self, instance, validated_data):
        """Update listing with images and details."""
        images_data = validated_data.pop('images', None)
        car_details_data = validated_data.pop('car_details', None)
        property_details_data = validated_data.pop('property_details', None)
        
        # Update listing fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update images if provided
        if images_data is not None:
            # Delete existing images
            instance.images.all().delete()
            # Create new images
            for index, image in enumerate(images_data):
                ListingImage.objects.create(listing=instance, image=image, order=index)
        
        # Update car details if provided
        if car_details_data:
            if hasattr(instance, 'car_details'):
                for attr, value in car_details_data.items():
                    setattr(instance.car_details, attr, value)
                instance.car_details.save()
            else:
                CarDetails.objects.create(listing=instance, **car_details_data)
        
        # Update property details if provided
        if property_details_data:
            if hasattr(instance, 'property_details'):
                for attr, value in property_details_data.items():
                    setattr(instance.property_details, attr, value)
                instance.property_details.save()
            else:
                PropertyDetails.objects.create(listing=instance, **property_details_data)
        
        return instance


class ListingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing lists."""
    
    first_image = serializers.SerializerMethodField()
    car_details = CarDetailsSerializer(read_only=True)
    property_details = PropertyDetailsSerializer(read_only=True)
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'type', 'purpose', 'price', 'currency',
            'location', 'status', 'ad_type', 'first_image', 'car_details',
            'property_details', 'created_at'
        ]
    
    def get_first_image(self, obj):
        """Get the first image URL."""
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None

