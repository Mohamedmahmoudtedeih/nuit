from django.contrib import admin
from .models import Listing, ListingImage, CarDetails, PropertyDetails


class ListingImageInline(admin.TabularInline):
    """Inline admin for listing images."""
    model = ListingImage
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    """Admin interface for Listing model."""
    
    list_display = ['title', 'type', 'purpose', 'price', 'status', 'ad_type', 'user', 'created_at']
    list_filter = ['type', 'purpose', 'status', 'ad_type', 'created_at']
    search_fields = ['title', 'description', 'location', 'user__phone', 'user__full_name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ListingImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'type', 'purpose', 'price', 'currency', 'location')
        }),
        ('Status & Type', {
            'fields': ('status', 'ad_type', 'user')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(CarDetails)
class CarDetailsAdmin(admin.ModelAdmin):
    """Admin interface for CarDetails model."""
    
    list_display = ['listing', 'make', 'model', 'year', 'mileage']
    search_fields = ['make', 'model', 'listing__title']


@admin.register(PropertyDetails)
class PropertyDetailsAdmin(admin.ModelAdmin):
    """Admin interface for PropertyDetails model."""
    
    list_display = ['listing', 'property_type', 'bedrooms', 'bathrooms', 'area']
    search_fields = ['listing__title']
    list_filter = ['property_type']

