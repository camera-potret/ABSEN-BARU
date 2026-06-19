@echo off
REM Development Setup Script for Windows

echo.
echo 🚀 Sistem Absensi - Development Setup
echo ======================================
echo.

REM Check Python
echo 📦 Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Found: %PYTHON_VERSION%
echo.

REM Create virtual environment
echo 📁 Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ℹ️  Virtual environment already exists
)

echo.

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo ✅ Dependencies installed
echo.

REM Create sample Excel
echo 📄 Creating sample Excel file...
python create_sample_excel.py

echo.
echo ✅ Setup Complete!
echo.
echo 🎯 Next steps:
echo    1. Activate environment: venv\Scripts\activate.bat
echo    2. Run app: python app.py
echo    3. Open browser: http://localhost:5000
echo.

pause
