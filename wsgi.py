import os
import sys
from app import app, db

# Create application context
with app.app_context():
    db.create_all()

# Export app for Vercel and other WSGI servers
# This must be at module level for Vercel to find it
application = app

if __name__ == '__main__':
    app.run()
