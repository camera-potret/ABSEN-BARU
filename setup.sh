#!/bin/bash
# Development Setup Script

echo "🚀 Sistem Absensi - Development Setup"
echo "======================================"
echo ""

# Check Python
echo "📦 Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✅ Found: $PYTHON_VERSION"
echo ""

# Create virtual environment
echo "📁 Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "ℹ️  Virtual environment already exists"
fi

echo ""

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Dependencies installed"
echo ""

# Create sample Excel
echo "📄 Creating sample Excel file..."
python3 create_sample_excel.py

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Activate environment: source venv/bin/activate"
echo "   2. Run app: python app.py"
echo "   3. Open browser: http://localhost:5000"
echo ""
