# Sistem Absensi - Quick Start Guide

## 🚀 Mulai Cepat

### Langkah 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Langkah 2: Jalankan Aplikasi
```bash
python app.py
```

### Langkah 3: Buka Browser
```
http://localhost:5000
```

## 📋 Format Data Import

### File Excel untuk Import Peserta
1. Buat file Excel (.xlsx atau .xls)
2. Kolom pertama berisi nama peserta
3. Baris pertama adalah header (akan dilewati)

Contoh:
```
Header Row (dilewati):
| Nama              |

Data:
| Andi Pratama      |
| Budi Santoso      |
| Citra Dewi        |
```

## 🎯 Workflow Penggunaan

### Admin/Pengelola:
1. Setup kegiatan di dashboard
2. Generate QR code dan share link
3. Import daftar peserta
4. Monitor absensi secara real-time
5. Export data saat diperlukan

### Peserta:
1. Scan QR code atau buka link dari admin
2. Pilih tab "Masuk" atau "Izin"
3. Cari nama di daftar
4. Konfirmasi kehadiran atau isi alasan izin

## 🔄 Update Otomatis

Dashboard akan refresh statistik setiap 2 detik secara otomatis.
Tidak perlu manual refresh!

## 💾 Database

- **Development**: SQLite (file `absensi.db`)
- **Production**: Bisa menggunakan PostgreSQL

## 📱 Responsive

Aplikasi sudah fully responsive untuk:
- Desktop
- Tablet
- Mobile

## 🌐 Deploy ke Vercel

Aplikasi sudah siap untuk di-deploy ke Vercel.
Follow instruksi di README.md untuk deploy.

## ⚠️ Important Notes

1. **Reset Data**: Saat reset, semua data absensi akan dihapus
2. **ID Link**: Ubah ID link untuk membuat QR code baru
3. **Excel Import**: Peserta yang sudah ada akan di-replace

## 🐛 Troubleshooting

### Port sudah terpakai?
```bash
python app.py --port 8000
```

### Error database?
Hapus file `absensi.db` dan restart

### QR code tidak muncul?
- Refresh halaman
- Clear cache browser
- Cek JavaScript aktif

---

**Need help? Check README.md for more details**
