#!/bin/bash
# ============================================
# Sistem Absensi - Quick Run Script (Linux/Mac)
# ============================================

echo ""
echo "🚀 Sistem Absensi - Starting Application"
echo "============================================"
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating venv..."
    python3 -m venv venv
fi

# Activate venv and run app
echo "✅ Activating virtual environment..."
source venv/bin/activate

echo "✅ Starting Flask application..."
echo ""
echo "📱 Aplikasi berjalan di: http://localhost:5000"
echo "🛑 Tekan CTRL+C untuk menghentikan"
echo ""

python app.py
