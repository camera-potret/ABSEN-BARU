#!/usr/bin/env bash
# ============================================
# Sistem Absensi - Run Script for Termux (Android)
# ============================================

echo ""
echo "🚀 Sistem Absensi - Starting Application on Termux"
echo "============================================"
echo ""

# Check python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed!"
    echo "Please run: pkg install python in Termux"
    exit 1
fi

# Detect python command
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
fi

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "⚠️ Virtual environment (venv) not found!"
    echo "Creating venv..."
    $PYTHON_CMD -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment."
        echo "Trying to run directly without venv..."
    else
        echo "✅ Virtual environment created."
    fi
fi

# Activate venv if it exists
if [ -f "venv/bin/activate" ]; then
    echo "✅ Activating virtual environment..."
    source venv/bin/activate
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Checking/Installing dependencies..."
    pip install -r requirements.txt
fi

echo "✅ Starting Flask application..."
echo ""
echo "📱 Aplikasi berjalan di: http://127.0.0.1:5000"
echo "🛑 Tekan CTRL+C untuk menghentikan"
echo ""

$PYTHON_CMD app.py
