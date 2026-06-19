# Deployment Guide

## 🌐 Deploy ke Vercel

Vercel adalah platform deployment gratis yang sempurna untuk aplikasi Flask dengan database SQLite.

### Prerequisites
- Akun GitHub (untuk push code)
- Akun Vercel (gratis di vercel.com)

### Step 1: Prepare Repository

1. Install Git jika belum ada
2. Di folder project, initialize git:
```bash
git init
git add .
git commit -m "Initial commit: Sistem Absensi v1.0"
```

### Step 2: Push ke GitHub

1. Buat repository baru di GitHub (tanpa README)
2. Push code ke GitHub:
```bash
git remote add origin https://github.com/username/repository-name.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik "New Project"
3. Import repository GitHub Anda
4. Konfigurasi:
   - **Framework**: `Other`
   - **Build Command**: `pip install -r requirements.txt`
   - **Output Directory**: (kosongkan)
   - **Environment Variables**: (optional, kosongkan untuk default)
5. Klik "Deploy"

Vercel akan otomatis build dan deploy aplikasi!

### Step 4: Post-Deployment

Setelah deployed:
1. URL akan ditampilkan (misal: `https://your-app.vercel.app`)
2. Buka URL untuk test
3. Share dengan pengguna

---

## 🔧 Deploy ke Heroku

Alternatif lain untuk deployment.

### Prerequisites
- Akun Heroku (free tier)
- Heroku CLI

### Deployment Steps

1. **Login ke Heroku**:
```bash
heroku login
```

2. **Create Heroku App**:
```bash
heroku create your-app-name
```

3. **Deploy**:
```bash
git push heroku main
```

4. **Open App**:
```bash
heroku open
```

---

## 🖥️ Deploy Lokal (On-Premise)

Untuk deployment di server sendiri.

### Prerequisites
- Linux/Windows Server
- Python 3.8+
- Git
- Nginx atau Apache (sebagai reverse proxy)
- Supervisor atau PM2 (untuk process management)

### Steps

1. **Clone Repository**:
```bash
git clone https://github.com/username/repo.git
cd repo
```

2. **Setup Python Environment**:
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate.bat  # Windows
```

3. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

4. **Run dengan Gunicorn**:
```bash
gunicorn wsgi:app -w 4 -b 0.0.0.0:5000
```

5. **Setup Nginx Reverse Proxy** (Linux):

Create `/etc/nginx/sites-available/absensi`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/absensi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup Process Manager (PM2)**:
```bash
npm install -g pm2
pm2 start wsgi.py --name "absensi"
pm2 save
pm2 startup
```

---

## 🐳 Deploy dengan Docker

Untuk deployment yang consistent dan scalable.

### Create Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "wsgi:app", "-w", "4", "-b", "0.0.0.0:5000"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./uploads:/app/uploads
      - ./instance:/app/instance
    environment:
      - FLASK_ENV=production
```

### Build & Run

```bash
docker-compose up -d
```

---

## 📊 Database Configuration

### Development (SQLite)
Default sudah SQLite. Cocok untuk development dan testing kecil.

### Production (PostgreSQL)

1. **Install PostgreSQL** di server

2. **Update requirements.txt**:
```
psycopg2-binary==2.9.9
```

3. **Update config.py**:
```python
SQLALCHEMY_DATABASE_URI = os.environ.get(
    'DATABASE_URL',
    'postgresql://user:password@localhost/absensi'
)
```

4. **Set Environment Variable**:
```bash
export DATABASE_URL="postgresql://user:password@host/dbname"
```

---

## 🔒 Security Checklist

- [ ] Change SECRET_KEY for production
- [ ] Enable HTTPS
- [ ] Setup authentication for admin dashboard
- [ ] Enable CSRF protection
- [ ] Setup rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for sensitive data
- [ ] Setup proper logging
- [ ] Regular database backup
- [ ] Monitor server performance

---

## 🚀 Optimization Tips

1. **Frontend Optimization**:
   - Minify CSS and JS
   - Compress images
   - Enable caching

2. **Backend Optimization**:
   - Setup database indexing
   - Use CDN for static files
   - Implement caching (Redis)

3. **Server Optimization**:
   - Setup load balancing
   - Use multiple workers (Gunicorn)
   - Monitor resource usage

---

## 📱 Subdomain Setup

Untuk production, setup subdomain:

1. **DNS Configuration**:
   - Add A record: `absensi.yourdomain.com → server_ip`

2. **SSL Certificate** (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly -d absensi.yourdomain.com
```

3. **Nginx SSL Configuration**:
```nginx
server {
    listen 443 ssl http2;
    server_name absensi.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/absensi.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/absensi.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5000;
        # ... other settings
    }
}

server {
    listen 80;
    server_name absensi.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📈 Monitoring & Logging

### Setup Logging

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    file_handler = RotatingFileHandler('logs/absensi.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

### Monitoring Tools
- **Uptime Monitoring**: UptimeRobot (free)
- **Performance**: New Relic, DataDog
- **Logging**: ELK Stack, Sentry

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🆘 Common Deployment Issues

### Issue: Port already in use
**Solution**:
```bash
# Find process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
python app.py --port 8000
```

### Issue: Permission denied
**Solution**:
```bash
sudo chmod +x app.py
sudo chown -R user:user /path/to/app
```

### Issue: Database locked
**Solution**:
```bash
# Remove lock file
rm instance/absensi.db-journal

# Or restart application
sudo systemctl restart absensi
```

### Issue: Static files not loading
**Solution**:
```python
# In app.py, ensure static path is correct
app.static_folder = os.path.join(os.path.dirname(__file__), 'app/static')
app.static_url_path = '/static'
```

---

## 📚 Useful Resources

- [Vercel Python Support](https://vercel.com/docs/serverless-functions/python)
- [Heroku Python Guide](https://devcenter.heroku.com/articles/getting-started-with-python)
- [Flask Deployment](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [PostgreSQL on Heroku](https://devcenter.heroku.com/articles/heroku-postgresql)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Last Updated**: 2024-06-19
