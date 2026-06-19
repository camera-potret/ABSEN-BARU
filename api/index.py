import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import app

# For Vercel serverless function
def handler(request):
    return app(request)

