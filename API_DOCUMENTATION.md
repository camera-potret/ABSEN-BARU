# API Documentation

## Base URL
- Local: `http://localhost:5000`
- Production: `https://your-domain.vercel.app`

## Authentication
Saat ini tidak ada authentication. Untuk production, tambahkan authorization layer.

---

## Endpoints

### 1. Kegiatan Management

#### GET /api/kegiatan
Ambil data kegiatan saat ini.

**Response (200)**:
```json
{
  "id": 1,
  "nama": "Seminar Python",
  "deskripsi": "Seminar tentang Python Programming",
  "jadwal": "2024-06-20T10:00:00",
  "link_id": "link_abc123",
  "wa_group_link": "https://chat.whatsapp.com/...",
  "created_at": "2024-06-19T10:00:00",
  "updated_at": "2024-06-19T10:00:00"
}
```

**Response (200) - Kosong**:
```json
null
```

#### POST /api/kegiatan
Buat atau update kegiatan.

**Request Body**:
```json
{
  "nama": "Seminar Python",
  "deskripsi": "Seminar tentang Python Programming",
  "jadwal": "2024-06-20T10:00:00",
  "link_id": "link_abc123",
  "wa_group_link": "https://chat.whatsapp.com/..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "kegiatan_id": 1
}
```

**Required Fields**: `nama`
**Optional Fields**: `deskripsi`, `jadwal`, `link_id`, `wa_group_link`

---

### 2. Peserta Management

#### GET /api/peserta
Ambil daftar semua peserta.

**Response (200)**:
```json
[
  {
    "id": 1,
    "nama": "Andi Pratama",
    "status": "masuk",
    "alasan_izin": "",
    "waktu_absensi": "2024-06-20T10:05:00"
  },
  {
    "id": 2,
    "nama": "Budi Santoso",
    "status": "izin",
    "alasan_izin": "Sakit",
    "waktu_absensi": "2024-06-20T10:10:00"
  }
]
```

**Status Values**:
- `masuk` - Peserta hadir tepat waktu
- `terlambat` - Peserta hadir terlambat
- `izin` - Peserta izin tidak hadir
- `belum_masuk` - Peserta belum absensi

#### POST /api/peserta/import
Import peserta dari file Excel.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Form Data:
  - `file`: File Excel (.xlsx, .xls, .csv)

**Response (200)**:
```json
{
  "success": true,
  "message": "Data berhasil diimport"
}
```

**Response (400)**:
```json
{
  "error": "File tidak ditemukan"
}
```

**File Format**:
```
Baris 1 (Header): | Nama Peserta |
Baris 2+: | Nama Peserta 1 |
         | Nama Peserta 2 |
```

#### GET /api/peserta/search/{link_id}
Cari peserta berdasarkan nama.

**Query Parameters**:
- `q` (string): Query pencarian

**Example**:
```
GET /api/peserta/search/link_abc123?q=Andi
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "nama": "Andi Pratama"
  }
]
```

**Note**: Hanya menampilkan peserta dengan status `belum_masuk`

---

### 3. Absensi Management

#### POST /api/absensi/masuk
Tandai peserta masuk.

**Request Body**:
```json
{
  "peserta_id": 1,
  "link_id": "link_abc123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "status": "masuk"
}
```

**Possible Status Values**:
- `masuk` - Jika absen sebelum jadwal
- `terlambat` - Jika absen setelah jadwal

#### POST /api/absensi/izin
Tandai peserta izin.

**Request Body**:
```json
{
  "peserta_id": 1,
  "link_id": "link_abc123",
  "alasan": "Sakit demam tinggi"
}
```

**Response (200)**:
```json
{
  "success": true
}
```

---

### 4. Statistik

#### GET /api/stats
Ambil statistik kehadiran.

**Response (200)**:
```json
{
  "total_peserta": 30,
  "masuk": 25,
  "terlambat": 3,
  "izin": 1,
  "belum_masuk": 1
}
```

---

### 5. QR Code

#### GET /api/qrcode
Generate QR code image.

**Response (200)**:
- Content-Type: `image/png`
- Binary PNG image

**Usage**:
```html
<img src="/api/qrcode" alt="QR Code">
```

#### GET /api/qrcode/download
Download QR code sebagai file PNG.

**Response (200)**:
- Content-Type: `image/png`
- Content-Disposition: `attachment; filename=qrcode_[link_id].png`

---

### 6. Export & Utilities

#### GET /api/export/excel
Export data absensi ke Excel.

**Response (200)**:
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File: `absensi_[nama_kegiatan]_[timestamp].xlsx`

**Excel Format**:
```
| No. | Nama | Status | Alasan Izin | Waktu Absensi |
|-----|------|--------|-------------|---------------|
| 1   | Andi | masuk  |             | 2024-06-20... |
```

#### POST /api/reset
Reset semua data (hapus peserta dan absensi).

**Request**: Kosong

**Response (200)**:
```json
{
  "success": true
}
```

**Warning**: Tindakan ini tidak dapat dibatalkan!

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Deskripsi error"
}
```

### 404 Not Found
```json
{
  "error": "Sumber daya tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "error": "Terjadi kesalahan di server"
}
```

---

## Rate Limiting
Saat ini belum ada rate limiting. Untuk production, tambahkan rate limiting untuk mencegah abuse.

---

## CORS
CORS belum dikonfigurasi. Jika frontend di domain berbeda, tambahkan:
```python
from flask_cors import CORS
CORS(app)
```

---

## Data Types

### DateTime Format
Semua datetime menggunakan ISO 8601 format:
```
2024-06-20T15:30:00
```

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Example Usage

### cURL Examples

**Create Kegiatan**:
```bash
curl -X POST http://localhost:5000/api/kegiatan \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Seminar Python",
    "link_id": "link_123"
  }'
```

**Absensi Masuk**:
```bash
curl -X POST http://localhost:5000/api/absensi/masuk \
  -H "Content-Type: application/json" \
  -d '{
    "peserta_id": 1,
    "link_id": "link_123"
  }'
```

**Get Stats**:
```bash
curl http://localhost:5000/api/stats
```

---

## Webhooks
Belum diimplementasikan. Untuk production, tambahkan webhook support untuk real-time notifications.

---

## Changelog

### v1.0.0
- Initial API release
- All basic endpoints implemented

---

**Last Updated**: 2024-06-19
