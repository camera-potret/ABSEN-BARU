import os
import sys

# Ensure app folder is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db

# Create application context and initialize database
with app.app_context():
    db.create_all()

# Export app for Vercel and other WSGI servers
application = app

if __name__ == '__main__':
    app.run()
