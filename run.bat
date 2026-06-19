@echo off
REM ============================================
REM Sistem Absensi - Quick Run Script
REM ============================================
echo.
echo 🚀 Sistem Absensi - Starting Application
echo ============================================
echo.

REM Check if venv exists
if not exist venv (
    echo ❌ Virtual environment not found!
    echo Creating venv...
    python -m venv venv
)

REM Activate venv and run app
echo ✅ Activating virtual environment...
call venv\Scripts\activate.bat

echo ✅ Starting Flask application...
echo.
echo 📱 Aplikasi berjalan di: http://localhost:5000
echo 🛑 Tekan CTRL+C untuk menghentikan
echo.

python app.py

pause
