# Troubleshooting Guide

Panduan untuk menyelesaikan masalah umum yang mungkin terjadi.

## 🔴 Common Issues

### 1. Port 5000 Sudah Digunakan

**Error**:
```
Address already in use
```

**Solusi**:

**Linux/Mac**:
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
python app.py --port 8000
```

**Windows**:
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or use different port
python app.py --port 8000
```

---

### 2. Module Not Found

**Error**:
```
ModuleNotFoundError: No module named 'flask'
```

**Solusi**:

Pastikan virtual environment aktif dan install dependencies:

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate.bat  # Windows

# Install requirements
pip install -r requirements.txt

# Or install specific module
pip install Flask==3.0.0
```

---

### 3. Database Locked / Error

**Error**:
```
sqlite3.OperationalError: database is locked
database disk image is malformed
```

**Solusi**:

```bash
# Backup database first
cp app/instance/absensi.db app/instance/absensi.db.backup

# Delete corrupted database
rm app/instance/absensi.db
rm app/instance/absensi.db-journal

# Restart application
python app.py
```

---

### 4. File Upload Error

**Error**:
```
Error mengimport data
File tidak ditemukan
```

**Solusi**:

1. Pastikan folder `uploads` ada:
```bash
mkdir -p uploads
```

2. Pastikan file Excel format benar:
   - Kolom pertama: Nama peserta
   - Format: .xlsx, .xls, atau .csv

3. Check file size (max 16MB)

---

### 5. QR Code Tidak Muncul

**Error**:
```
QR Code tidak terlihat / blank
```

**Solusi**:

1. **Refresh halaman**:
   - `Ctrl + F5` atau `Cmd + Shift + R`

2. **Clear browser cache**:
   - Buka DevTools (F12)
   - Right-click refresh button
   - Pilih "Empty cache and hard refresh"

3. **Check JavaScript**:
   - Pastikan JavaScript enabled
   - Check browser console untuk errors (F12 > Console)

4. **Generate baru**:
   - Click "Generate Baru" di link ID field
   - Click "Simpan"

---

### 6. Static Files (CSS/JS) Tidak Load

**Error**:
```
404 - static/css/style.css not found
```

**Solusi**:

1. **Check file structure**:
```
app/
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── dashboard.js
│       └── absensi.js
└── templates/
    ├── dashboard.html
    └── absensi.html
```

2. **Restart Flask server**:
   - Stop: `Ctrl + C`
   - Jalankan: `python app.py`

3. **Clear cache dan refresh**

---

### 7. Login/Authentication Error (Jika Ada Custom Auth)

**Error**:
```
401 Unauthorized
```

**Solusi**:
- Check username dan password
- Reset password jika lupa
- Clear cookies: Inspect > Application > Clear all cookies

---

### 8. Data Tidak Tersimpan / Update Lambat

**Error**:
```
Data tidak berubah di dashboard
```

**Solusi**:

1. **Check network**:
   - Open DevTools (F12)
   - Tab Network
   - Lihat response dari API

2. **Check server logs**:
   - Lihat terminal tempat Flask running
   - Check untuk error messages

3. **Restart server**:
   - Stop: `Ctrl + C`
   - Start: `python app.py`

---

### 9. Excel Export Gagal

**Error**:
```
Error mengexport data
File tidak bisa dibuat
```

**Solusi**:

1. Pastikan data ada (minimal 1 peserta)

2. Pastikan library openpyxl terinstall:
```bash
pip install openpyxl==3.11.0
```

3. Try manual export:
```python
python -c "from app import app, db; app.app_context().push(); print('Database OK')"
```

---

### 10. Browser Compatibility Issues

**Error**:
```
Tampilan berantakan di mobile/browser tertentu
```

**Solusi**:

1. **Update browser ke versi terbaru**

2. **Test di DevTools**:
   - F12 > Toggle device toolbar (Ctrl+Shift+M)
   - Pilih device yang berbeda
   - Check responsive

3. **Clear cache**:
   - Ctrl + Shift + Delete
   - Clear all time

---

## 🟡 Performance Issues

### Slow Dashboard Loading

**Solusi**:

1. Check jumlah data peserta
2. Optimize database queries
3. Add indexing:
```python
# In models.py
class Peserta(db.Model):
    ...
    __table_args__ = (
        db.Index('idx_kegiatan_nama', 'kegiatan_id', 'nama'),
    )
```

### High Memory Usage

**Solusi**:

1. Check running processes:
```bash
ps aux | grep python
```

2. Reduce workers:
```bash
gunicorn wsgi:app -w 1
```

---

## 🟢 Testing

### Test Database Connection

```bash
python -c "
from app import db, app
app.app_context().push()
print('Testing database...')
try:
    db.create_all()
    print('✓ Database connection OK')
except Exception as e:
    print('✗ Database error:', e)
"
```

### Test API Endpoints

```bash
# Test GET kegiatan
curl http://localhost:5000/api/kegiatan

# Test GET stats
curl http://localhost:5000/api/stats

# Test dashboard
curl http://localhost:5000/
```

---

## 📋 Checklist Sebelum Deploy

- [ ] Semua dependencies terinstall
- [ ] Database tidak corrupted
- [ ] Static files di folder yang benar
- [ ] Environment variables dikonfigurasi
- [ ] SECRET_KEY di-set untuk production
- [ ] Vercel/Heroku credential ready
- [ ] Domain sudah ready (jika custom domain)
- [ ] Test semua features di localhost
- [ ] Backup data jika ada
- [ ] Documentation updated

---

## 📞 Getting Help

### Jika error masih berlanjut:

1. **Check error message lengkap**:
   - Terminal where Flask running
   - Browser Console (F12)
   - Browser Network tab (F12)

2. **Google error message**:
   - Copy-paste error ke Google
   - Lihat StackOverflow

3. **Check logs**:
   - Flask terminal output
   - System logs (jika server)

4. **Ask community**:
   - GitHub Issues
   - Stack Overflow
   - Reddit

---

## 🔍 Debug Mode

### Enable Debug Logging

```python
# In app.py
import logging
logging.basicConfig(level=logging.DEBUG)

if __name__ == '__main__':
    app.run(debug=True)
```

### Test dengan Python Shell

```bash
python
>>> from app import app, db
>>> app.app_context().push()
>>> from app import Kegiatan, Peserta
>>> Kegiatan.query.all()
[]
>>> exit()
```

---

## 🆘 SOS - Nuclear Option

Jika semua gagal:

```bash
# 1. Backup everything
cp -r . ../backup/

# 2. Remove all Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -name "*.pyc" -delete

# 3. Delete virtual environment
rm -rf venv/

# 4. Fresh setup
python3 -m venv venv
source venv/bin/activate  # atau .bat untuk Windows
pip install -r requirements.txt

# 5. Delete database
rm app/instance/absensi.db

# 6. Try again
python app.py
```

---

**Last Updated**: 2024-06-19
**Version**: 1.0.0
