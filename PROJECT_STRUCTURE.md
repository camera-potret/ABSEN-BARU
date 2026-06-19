# Project Structure & Architecture

## 📁 Directory Structure

```
ABSEN BARU/
│
├── 📄 app.py                          # Main Flask application
├── 📄 wsgi.py                         # WSGI entry point untuk deployment
├── 📄 config.py                       # Configuration settings
├── 📄 setup.py                        # Package setup
├── 📄 requirements.txt                # Python dependencies
│
├── 📁 app/                            # Flask application package
│   ├── 📁 templates/                  # HTML templates
│   │   ├── dashboard.html             # Admin dashboard page
│   │   └── absensi.html               # Peserta absensi page
│   │
│   └── 📁 static/                     # Static files (CSS, JS, images)
│       ├── 📁 css/
│       │   └── style.css              # Main stylesheet (responsive)
│       │
│       └── 📁 js/
│           ├── dashboard.js           # Dashboard logic & API calls
│           └── absensi.js             # Absensi page logic & API calls
│
├── 📁 uploads/                        # Directory untuk file upload
│   └── .gitkeep                       # Ensure folder tracked
│
├── 📁 instance/                       # Instance-specific files
│   └── absensi.db                     # SQLite database (auto-generated)
│
├── 📄 .env.example                    # Environment variables template
├── 📄 .gitignore                      # Git ignore rules
├── 📄 .gitkeep                        # Git keep files
│
├── 📄 Procfile                        # Heroku/Vercel process file
├── 📄 runtime.txt                     # Python runtime version
├── 📄 vercel.json                     # Vercel configuration
│
├── 📚 Documentation/
│   ├── README.md                      # Main documentation
│   ├── QUICK_START.md                 # Quick start guide
│   ├── API_DOCUMENTATION.md           # Complete API reference
│   ├── DEPLOYMENT_GUIDE.md            # Deployment instructions
│   ├── TROUBLESHOOTING.md             # Troubleshooting guide
│   ├── FEATURES.md                    # Features & roadmap
│   ├── CHANGELOG.md                   # Version history
│   ├── CONTRIBUTING.md                # Contributing guide
│   ├── LICENSE                        # MIT License
│   └── PROJECT_STRUCTURE.md           # This file
│
├── 🧪 Testing/
│   ├── test_app.py                    # Unit tests
│   └── create_sample_excel.py         # Generate sample data
│
└── 🔧 Scripts/
    ├── setup.sh                       # Linux/Mac setup script
    └── setup.bat                      # Windows setup script
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                          │
├─────────────────────────────────────────────────────────┤
│  Dashboard (HTML)  │  Absensi Page (HTML)              │
│  style.css         │  style.css                        │
│  dashboard.js      │  absensi.js                       │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVER SIDE (Flask)                   │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                │
│  • GET /              (dashboard page)                 │
│  • GET /absensi/<id>  (absensi page)                   │
│  • API endpoints      (REST API)                       │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ SQL
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE (SQLAlchemy)                  │
├─────────────────────────────────────────────────────────┤
│  Tables:                                                │
│  • kegiatan (event information)                        │
│  • peserta (participants)                              │
│  • absensi (attendance records)                        │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ Key Files Explained

### Backend Files

#### `app.py` (Main Application)
- Flask app initialization
- Database models (Kegiatan, Peserta, Absensi)
- All API endpoints
- Request handlers

**Key Components**:
- Model definitions dengan SQLAlchemy
- Route handlers untuk REST API
- Error handling
- File upload processing

#### `config.py` (Configuration)
- Development, Production, Testing configs
- Database URI settings
- Debug settings
- Security settings

#### `wsgi.py` (WSGI Entry Point)
- Application factory untuk production
- Database initialization
- Used by gunicorn/Vercel

### Frontend Files

#### `dashboard.html` (Admin Dashboard)
- Kegiatan management form
- Import/Export section
- Statistics display
- Peserta list

**Sections**:
- Settings section (kegiatan form)
- QR code display
- Data management (import/export/reset)
- Statistics cards
- Peserta list with filters

#### `absensi.html` (Peserta Absensi Page)
- Event information display
- Tab menu (Masuk/Izin)
- Search form
- Status display

#### `style.css` (Styling)
- Responsive design (mobile-first)
- CSS Grid & Flexbox layouts
- Color scheme & variables
- Animations & transitions
- Media queries untuk responsive

#### `dashboard.js` (Dashboard Logic)
```
loadKegiatan()           ← Fetch event data from API
handleKegiatanSubmit()   ← Save event settings
handleFileUpload()       ← Process Excel import
loadPesertaList()        ← Fetch participants
refreshStats()           ← Update statistics
updateQRCode()           ← Generate QR code
exportExcel()            ← Download Excel report
resetData()              ← Clear all data
```

#### `absensi.js` (Absensi Page Logic)
```
loadKegiatanInfo()       ← Load event details
handleMasukSearch()      ← Search participants
selectPeserta()          ← Select participant
submitMasuk()            ← Mark attendance
submitIzin()             ← Mark absence with reason
```

## 🔄 Data Flow

### Import Peserta
```
User Upload Excel
    ↓
handle_peserta_import()
    ↓
Parse Excel file
    ↓
Clear existing peserta
    ↓
Insert new peserta into DB
    ↓
Response: Success/Error
    ↓
Dashboard updates
```

### Absensi Masuk
```
Peserta Search & Select
    ↓
Click Submit Button
    ↓
submitMasuk() JS function
    ↓
POST /api/absensi/masuk
    ↓
Server checks jadwal (early = masuk, late = terlambat)
    ↓
Create Absensi record
    ↓
Return status
    ↓
Frontend shows success
    ↓
Auto-refresh: peserta hilang dari list
```

## 📊 Database Schema

### Kegiatan Table
```sql
id              INTEGER PRIMARY KEY
nama            VARCHAR(255) NOT NULL
deskripsi       TEXT
jadwal          DATETIME
link_id         VARCHAR(50) UNIQUE
wa_group_link   VARCHAR(255)
created_at      DATETIME DEFAULT NOW
updated_at      DATETIME DEFAULT NOW
```

### Peserta Table
```sql
id              INTEGER PRIMARY KEY
kegiatan_id     INTEGER FOREIGN KEY (kegiatan.id)
nama            VARCHAR(255) NOT NULL
created_at      DATETIME DEFAULT NOW
```

### Absensi Table
```sql
id              INTEGER PRIMARY KEY
kegiatan_id     INTEGER FOREIGN KEY (kegiatan.id)
peserta_id      INTEGER FOREIGN KEY (peserta.id)
status          VARCHAR(20) DEFAULT 'belum_masuk'
alasan_izin     TEXT
waktu_absensi   DATETIME
created_at      DATETIME DEFAULT NOW
```

**Relationships**:
- Kegiatan → Peserta (1-to-many)
- Kegiatan → Absensi (1-to-many)
- Peserta → Absensi (1-to-many)

## 🌐 API Architecture

### Endpoint Categories

**Kegiatan Endpoints**:
- `GET /api/kegiatan` - Fetch kegiatan
- `POST /api/kegiatan` - Create/update kegiatan

**Peserta Endpoints**:
- `GET /api/peserta` - Get semua peserta
- `POST /api/peserta/import` - Import dari Excel
- `GET /api/peserta/search/<link_id>` - Search peserta

**Absensi Endpoints**:
- `POST /api/absensi/masuk` - Mark attendance
- `POST /api/absensi/izin` - Mark absence with reason
- `GET /api/stats` - Get statistics

**Utility Endpoints**:
- `GET /api/qrcode` - Generate QR image
- `GET /api/qrcode/download` - Download QR
- `GET /api/export/excel` - Export data
- `POST /api/reset` - Reset all data

## 🎨 Frontend Architecture

### State Management
```javascript
// Global variables
let currentKegiatan = null;      // Current event
let selectedPeserta = null;      // Selected participant
let allPeserta = [];             // All participants cache
let pesertaList = [];            // Filtered participants
```

### Event Listeners
- Form submissions
- Input changes
- Button clicks
- Tab switches
- Search inputs

### API Communication
```javascript
fetch('/api/endpoint', {
  method: 'GET/POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => handleResponse(data))
.catch(error => handleError(error))
```

## 🚀 Deployment Architecture

### Development
```
Python app.py
    ↓
Flask development server (port 5000)
    ↓
SQLite database
```

### Production (Vercel)
```
GitHub Repo
    ↓
Vercel receives push
    ↓
Build: pip install requirements
    ↓
Deploy: gunicorn wsgi:app
    ↓
SQLite database (persistent storage)
    ↓
CDN: Static files
```

### Production (Heroku/On-Premise)
```
GitHub/Git push
    ↓
Server receives code
    ↓
Build: pip install requirements
    ↓
Run: gunicorn wsgi:app
    ↓
PostgreSQL database
    ↓
Nginx reverse proxy
    ↓
User access via domain
```

## 📦 Dependencies Relationship

```
Flask (web framework)
├── Werkzeug (WSGI)
├── Jinja2 (templating)
└── click (CLI)

SQLAlchemy (ORM)
├── SQLAlchemy-core
└── greenlet

openpyxl (Excel handling)
├── et_xmlfile
└── lxml

qrcode (QR generation)
├── Pillow (image processing)
└── segno

gunicorn (WSGI server)
└── Various dependencies
```

## 🔐 Security Architecture

### Input Validation
- User input validated di server side
- Files validated sebelum processing
- JSON validation untuk API

### Data Protection
- Passwords (jika ada) hashed dengan werkzeug
- CSRF protection ready (Flask-WTF)
- XSS prevention di Jinja2 template

### Database Security
- Parameterized queries via ORM
- SQL injection protection
- Foreign key constraints

## 📈 Scalability Considerations

### Current (SQLite)
- Good untuk ≤ 10,000 peserta
- Automatic cleanup tidak ada
- Single file database

### Recommendations untuk Scale
- Migrate ke PostgreSQL
- Add indexing on frequently queried columns
- Implement caching layer (Redis)
- Separate read/write databases
- Load balancing untuk multiple servers

---

**Last Updated**: June 19, 2024
**Project Version**: 1.0.0
