# Sistem Absensi Online

Aplikasi web full-stack untuk mengelola absensi peserta dengan fitur lengkap dan responsif di semua ukuran layar.

## Fitur Utama

### Dashboard Admin
- ✅ **Pengaturan Kegiatan**: Konfigurasi nama, deskripsi, jadwal, ID link, dan link grup WA
- 📥 **Import Data**: Import daftar peserta dari file Excel (.xlsx, .xls, .csv)
- 📊 **Statistik Real-time**: Tampilan langsung jumlah peserta masuk, terlambat, izin, dan belum masuk
- 👥 **Daftar Peserta**: Lihat status setiap peserta dengan filter berdasarkan nama dan status
- 🔄 **QR Code**: Generate dan download QR code yang langsung terupdate saat ID link berubah
- 📤 **Export Data**: Ekspor laporan absensi dalam format Excel
- 🔄 **Reset Data**: Hapus semua data (absensi) dengan satu klik
- 🔗 **Link Absensi Dinamis**: Link berubah otomatis saat ID link diubah

### Halaman Absensi (Peserta)
- 🔍 **Pencarian Nama**: Cari dan pilih nama dari daftar peserta
- ✅ **Absensi Masuk**: Tandai kehadiran dengan sistem otomatis deteksi terlambat
- 📋 **Absensi Izin**: Isi alasan izin jika tidak bisa hadir
- 💬 **Link Grup WA**: Akses langsung ke grup WhatsApp (jika dikonfigurasi)
- ⚡ **Real-time Update**: Data di dashboard terupdate otomatis tanpa refresh

## Teknologi yang Digunakan

### Backend
- **Flask**: Framework Python untuk web
- **SQLAlchemy**: ORM untuk database management
- **SQLite**: Database (dapat diubah ke PostgreSQL untuk production)
- **OpenPyXL**: Library untuk membaca/menulis file Excel
- **QRCode**: Generate QR code

### Frontend
- **HTML5**: Struktur halaman
- **CSS3**: Styling responsif dengan media queries
- **Vanilla JavaScript**: Interaktifitas tanpa framework eksternal

### Deployment
- **Vercel**: Hosting gratis untuk aplikasi Python

## Installation & Setup

### 1. Clone atau Download Project
```bash
cd "ABSEN BARU"
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Database
Database akan otomatis dibuat saat aplikasi pertama kali dijalankan.

### 4. Run Aplikasi Lokal
```bash
python app.py
```

Aplikasi akan berjalan di `http://localhost:5000`

### 5. Struktur Folder
```
ABSEN BARU/
├── app.py                      # Main Flask application
├── wsgi.py                     # Entry point untuk Vercel
├── requirements.txt            # Python dependencies
├── vercel.json                 # Konfigurasi Vercel
├── README.md                   # File ini
├── app/
│   ├── templates/
│   │   ├── dashboard.html      # Halaman dashboard admin
│   │   └── absensi.html        # Halaman form absensi peserta
│   └── static/
│       ├── css/
│       │   └── style.css       # Styling responsif
│       └── js/
│           ├── dashboard.js    # Logic dashboard
│           └── absensi.js      # Logic absensi
└── uploads/                    # Folder untuk upload file
```

## Cara Penggunaan

### Sebagai Admin

1. **Buka Dashboard**: Akses `http://localhost:5000/`
2. **Setup Kegiatan**:
   - Isi nama kegiatan (wajib)
   - Isi deskripsi (opsional)
   - Set jadwal kegiatan
   - ID Link akan auto-generate (dapat diubah)
   - Link Grup WA (opsional)
   - Klik **Simpan**
3. **Import Data Peserta**:
   - Siapkan file Excel dengan kolom nama peserta di kolom pertama
   - Klik **Import Excel**
   - Pilih file dan upload
4. **Monitor Absensi**:
   - Lihat statistik real-time di dashboard
   - Klik tab untuk melihat detail peserta per status
   - Gunakan filter untuk mencari peserta tertentu
5. **Export Data**: Klik **Export Excel** untuk download laporan
6. **Reset Data**: Klik **Reset** untuk menghapus semua absensi (kegiatan tetap ada)

### Sebagai Peserta

1. **Buka Link Absensi**: Scan QR Code atau buka link dari admin
2. **Isi Data**:
   - Tab **Masuk**: Cari nama, klik, kemudian klik **Konfirmasi Masuk**
   - Tab **Izin**: Cari nama, isi alasan, kemudian klik **Konfirmasi Izin**
3. **Ikuti Grup WA**: Jika link grup WA tersedia, klik tombol untuk bergabung

## Format File Excel untuk Import

Buat file Excel dengan format berikut:

```
| No. | Nama Peserta      |
|-----|-------------------|
| 1   | Andi Pratama      |
| 2   | Budi Santoso      |
| 3   | Citra Dewi        |
| ... | ...               |
```

**Catatan**: 
- Baris pertama akan dianggap sebagai header dan akan dilewati
- Gunakan kolom pertama untuk nama peserta
- File bisa berformat .xlsx, .xls, atau .csv

## Deteksi Terlambat Otomatis

Sistem secara otomatis mendeteksi peserta yang terlambat berdasarkan jadwal kegiatan:
- Jika peserta absen **sebelum jadwal**: Status = **Masuk** ✅
- Jika peserta absen **setelah jadwal**: Status = **Terlambat** ⏰

## Deploy ke Vercel

### 1. Persiapan
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Push ke GitHub
- Buat repository di GitHub
- Push code ke GitHub

### 3. Deploy ke Vercel
- Buka [vercel.com](https://vercel.com)
- Klik "New Project"
- Pilih repository GitHub Anda
- Klik "Deploy"
- Vercel akan otomatis build dan deploy aplikasi

### 4. Set Environment Variables (jika diperlukan)
Di Vercel dashboard:
- Go to Settings > Environment Variables
- Tambahkan variabel yang dibutuhkan jika ada

## API Endpoints

### Kegiatan
- `GET /api/kegiatan` - Ambil data kegiatan
- `POST /api/kegiatan` - Buat/update kegiatan

### Peserta
- `GET /api/peserta` - Ambil daftar peserta
- `POST /api/peserta/import` - Import peserta dari Excel
- `GET /api/peserta/search/<link_id>` - Cari peserta

### Absensi
- `POST /api/absensi/masuk` - Tandai masuk
- `POST /api/absensi/izin` - Tandai izin
- `GET /api/stats` - Ambil statistik

### Utilities
- `GET /api/qrcode` - Generate QR code
- `GET /api/qrcode/download` - Download QR code
- `GET /api/export/excel` - Export data ke Excel
- `POST /api/reset` - Reset semua data

## Troubleshooting

### Database Error
- Hapus file `absensi.db` di folder app
- Restart aplikasi

### Port 5000 Sudah Digunakan
```bash
python app.py --port 8000
```

### File Upload Error
- Pastikan folder `uploads` ada dan writable
- Cek ukuran file (max 16MB)

### QR Code Tidak Muncul
- Refresh halaman
- Clear browser cache
- Pastikan JavaScript diaktifkan

## Browser Support
- ✅ Chrome/Edge (terbaru)
- ✅ Firefox (terbaru)
- ✅ Safari (terbaru)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## Tips Optimasi

1. **Untuk Performa Lebih Baik**:
   - Gunakan PostgreSQL untuk production
   - Setup caching dengan Redis
   - Compress static files

2. **Untuk Keamanan**:
   - Gunakan HTTPS
   - Setup authentication untuk dashboard
   - Validate input data

3. **Untuk Skalabilitas**:
   - Setup database backup
   - Monitor server performance
   - Implement rate limiting

## License
MIT License - Bebas digunakan untuk keperluan pribadi dan komersial

## Support
Jika ada pertanyaan atau bug report, silakan buat issue di repository.

## Changelog

### v1.0.0 (Initial Release)
- ✅ Dashboard lengkap dengan management kegiatan
- ✅ Import/Export Excel
- ✅ QR Code generation
- ✅ Real-time statistics
- ✅ Responsive design
- ✅ Multi-tab absensi form
- ✅ Automatic late detection
- ✅ Vercel deployment ready

---

**Dibuat dengan ❤️ untuk kemudahan pengelolaan absensi**
