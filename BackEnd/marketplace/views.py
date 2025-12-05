from django.http import JsonResponse

def api_root(request):
    """API root endpoint showing available endpoints."""
    return JsonResponse({
        'message': 'Marketplace API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'profile': '/api/auth/profile/',
                'token_refresh': '/api/auth/token/refresh/',
            },
            'listings': {
                'list': '/api/listings/',
                'create': '/api/listings/',
                'detail': '/api/listings/{id}/',
                'my_listings': '/api/listings/my_listings/',
            }
        },
        'documentation': 'See README.md for full API documentation'
    })

