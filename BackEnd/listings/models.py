from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Listing(models.Model):
    """Listing model for cars and properties."""
    
    LISTING_TYPE_CHOICES = [
        ('car', 'Car'),
        ('property', 'Property'),
    ]
    
    LISTING_PURPOSE_CHOICES = [
        ('sale', 'Sale'),
        ('rent', 'Rent'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('sold', 'Sold'),
    ]
    
    AD_TYPE_CHOICES = [
        ('simple', 'Simple'),
        ('star', 'Star'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES)
    purpose = models.CharField(max_length=10, choices=LISTING_PURPOSE_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='AED')
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    ad_type = models.CharField(max_length=10, choices=AD_TYPE_CHOICES, default='simple')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'listings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type', 'purpose']),
            models.Index(fields=['status']),
            models.Index(fields=['ad_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_type_display()} ({self.get_purpose_display()})"


class ListingImage(models.Model):
    """Images for listings."""
    
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listing_images/')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'listing_images'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"Image for {self.listing.title}"


class CarDetails(models.Model):
    """Car-specific details for car listings."""
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='car_details')
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    mileage = models.IntegerField(help_text="Mileage in kilometers")
    fuel_type = models.CharField(max_length=50)
    transmission = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    engine_size = models.CharField(max_length=50, blank=True, null=True)
    
    class Meta:
        db_table = 'car_details'
    
    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"


class PropertyDetails(models.Model):
    """Property-specific details for property listings."""
    
    PROPERTY_TYPE_CHOICES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('villa', 'Villa'),
        ('land', 'Land'),
        ('commercial', 'Commercial'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='property_details')
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    area = models.DecimalField(max_digits=10, decimal_places=2, help_text="Area in square feet")
    floor = models.IntegerField(blank=True, null=True)
    furnished = models.BooleanField(default=False)
    amenities = models.JSONField(default=list, blank=True, help_text="List of amenities")
    
    class Meta:
        db_table = 'property_details'
    
    def __str__(self):
        return f"{self.get_property_type_display()} - {self.bedrooms}BR/{self.bathrooms}BA"

