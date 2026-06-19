from setuptools import setup, find_packages

setup(
    name='absensi-system',
    version='1.0.0',
    description='Sistem Absensi Online - Full Stack Web Application',
    author='Your Name',
    packages=find_packages(),
    install_requires=[
        'Flask==3.0.0',
        'Flask-SQLAlchemy==3.1.1',
        'SQLAlchemy==2.0.23',
        'python-dateutil==2.8.2',
        'openpyxl==3.11.0',
        'qrcode==7.4.2',
        'Pillow==10.0.1',
        'python-dotenv==1.0.0',
        'gunicorn==21.2.0',
        'Werkzeug==3.0.0',
    ],
    python_requires='>=3.8',
    entry_points={
        'console_scripts': [
            'absensi=app:app',
        ],
    },
)
