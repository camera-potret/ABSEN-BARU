import os
import sys
from app import app, db

# Create application context
with app.app_context():
    db.create_all()

# Export app for Vercel
if __name__ == '__main__':
    app.run()
