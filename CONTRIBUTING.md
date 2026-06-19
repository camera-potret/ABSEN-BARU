# Contributing Guide

Terima kasih tertarik untuk berkontribusi pada Sistem Absensi!

## Code of Conduct

Proyek ini mengikuti Code of Conduct. Dengan berpartisipasi, Anda diharapkan:
- Respectful dan inclusive
- Tidak ada harassment atau discrimination
- Konstruktif dalam kritik dan saran

## Bagaimana Berkontribusi

### 1. Report Bugs

Jika menemukan bug:

1. **Check existing issues** - Pastikan belum dilaporkan
2. **Provide details**:
   - Browser dan OS yang digunakan
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos jika helpful
3. **Create issue** di GitHub dengan label `bug`

**Template**:
```
## Deskripsi Bug
[Jelaskan bug secara singkat]

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
[Apa yang seharusnya terjadi]

## Actual Behavior
[Apa yang sebenarnya terjadi]

## Environment
- Browser: Chrome 90
- OS: Windows 10
- Version: 1.0.0
```

### 2. Suggest Features

Untuk feature request:

1. **Check existing issues** - Pastikan belum diusulkan
2. **Describe use case** - Jelaskan kenapa feature ini dibutuhkan
3. **Create issue** dengan label `enhancement`

**Template**:
```
## Feature Description
[Jelaskan feature secara detail]

## Use Case
[Kapan dan bagaimana feature ini akan digunakan]

## Possible Implementation
[Saran implementasi, jika ada]
```

### 3. Submit Pull Request

#### Setup Development Environment

```bash
# Fork repository
# Clone fork Anda
git clone https://github.com/username/sistem-absensi.git
cd sistem-absensi

# Add upstream remote
git remote add upstream https://github.com/original/sistem-absensi.git

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate.bat  # Windows

# Install dependencies
pip install -r requirements.txt

# Create branch untuk feature Anda
git checkout -b feature/your-feature-name
```

#### Development Workflow

1. **Make changes**:
   - Follow code style (lihat di bawah)
   - Write meaningful commit messages
   - Add tests jika applicable
   - Update documentation

2. **Test changes**:
   ```bash
   # Run tests
   python test_app.py
   
   # Manual testing
   python app.py
   # Test di browser: http://localhost:5000
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**:
   - Jelaskan changes Anda
   - Reference related issues
   - Pastikan CI/CD passes

#### PR Template

```
## Description
[Jelaskan changes Anda]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## How Has This Been Tested?
[Jelaskan bagaimana Anda test changes ini]

## Screenshots
[Jika applicable, tambahkan screenshots]

## Checklist
- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

### Code Style

#### Python
```python
# Use PEP 8 style
# 4 spaces indentation
# Max line length: 88 characters

# Good example
def get_peserta_by_status(kegiatan_id, status):
    """Get peserta dengan status tertentu."""
    return Peserta.query.filter_by(
        kegiatan_id=kegiatan_id,
        status=status
    ).all()

# Bad example
def getPesertaByStatus(kegiatanId,status):
    return Peserta.query.filter_by(kegiatan_id=kegiatanId,status=status).all()
```

#### JavaScript
```javascript
// Use standard JavaScript style
// 2 spaces indentation
// Use const/let (not var)
// Use arrow functions

// Good example
const getPesertaList = async () => {
  const response = await fetch('/api/peserta');
  const data = await response.json();
  return data;
};

// Bad example
var getPesertaList = function() {
  var response = $.get('/api/peserta');
  return response;
};
```

#### HTML/CSS
```html
<!-- Use semantic HTML -->
<form class="kegiatan-form">
  <label for="nama">Nama *</label>
  <input id="nama" type="text" required>
</form>
```

```css
/* Use BEM methodology untuk class names */
/* .block__element--modifier */

.peserta-item {
  /* ... */
}

.peserta-item__name {
  /* ... */
}

.peserta-item--selected {
  /* ... */
}
```

### Commit Messages

Gunakan conventional commits:

```
feat: add feature description
fix: fix bug description
docs: update documentation
style: formatting changes
refactor: code restructuring
perf: performance improvements
test: add/update tests
chore: maintenance tasks
```

**Contoh**:
```
feat: add email notification untuk peserta izin
fix: fix QR code tidak update saat link ID berubah
docs: update API documentation dengan contoh cURL
```

### Documentation

Update dokumentasi jika:
- Menambah fitur baru
- Mengubah API endpoints
- Mengubah database schema
- Menambah dependencies

Update file yang sesuai:
- `README.md` - Overview dan setup
- `API_DOCUMENTATION.md` - API changes
- `FEATURES.md` - Feature list
- `CHANGELOG.md` - Version changes

### Testing

```bash
# Run semua tests
python test_app.py

# Run specific test
python -m unittest test_app.TestAbsensiApp.test_create_kegiatan

# Generate coverage
pip install coverage
coverage run -m unittest test_app.py
coverage report
```

Minimum coverage: 70%

### Performance Considerations

Saat membuat changes, pertimbangkan:
- Database query efficiency
- Frontend loading time
- Memory usage
- API response time

### Security

- Validasi semua user input
- Escape output untuk prevent XSS
- Gunakan parameterized queries (ORM handles this)
- Tidak store sensitive data in plaintext
- Sanitize file uploads

## Review Process

1. **Automated checks**:
   - Linting
   - Tests
   - Code coverage

2. **Code review**:
   - 1-2 maintainers akan review code
   - Feedback atau approval

3. **Merge**:
   - Setelah approval
   - Squash commits jika perlu
   - Merge ke main branch

## Release Process

Maintainers akan:
1. Update version numbers
2. Update CHANGELOG.md
3. Create GitHub release
4. Deploy ke production

## Getting Help

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: contact@example.com

## License

Dengan berkontribusi, Anda agree bahwa contributions Anda akan dilicensikan di bawah MIT License yang sama.

---

## Additional Resources

- [GitHub Guides](https://guides.github.com/)
- [PEP 8 Style Guide](https://pep8.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

Terima kasih atas kontribusimu! 🎉

**Last Updated**: June 19, 2024
