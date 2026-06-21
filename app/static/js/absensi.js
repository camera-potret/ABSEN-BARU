// ==================== ABSENSI.JS ====================

let currentKegiatan = null;
let selectedPeserta = null;
let allPeserta = [];

// ==================== LOADING FUNCTIONS ====================
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadKegiatanInfo();
    setupEventListeners();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Tab switching
    window.switchTab = switchTab;
    
    // Search inputs
    document.getElementById('masuk-search').addEventListener('input', handleMasukSearch);
    document.getElementById('izin-search').addEventListener('input', handleIzinSearch);
    
    // Submit buttons
    document.getElementById('submit-masuk-btn').addEventListener('click', submitMasuk);
    document.getElementById('submit-izin-btn').addEventListener('click', submitIzin);
    
    // Go to absensi button (if exists)
    const goToAbsensiBtn = document.getElementById('go-to-absensi-btn');
    if (goToAbsensiBtn) {
        goToAbsensiBtn.addEventListener('click', () => {
            window.location.href = `/absensi/${linkId}`;
        });
    }
}

// ==================== KEGIATAN INFO ====================
async function loadKegiatanInfo() {
    showLoading();
    try {
        const response = await fetch('/api/kegiatan');
        const data = await response.json();
        
        if (!data) {
            document.body.innerHTML = '<p style="padding: 20px; text-align: center;">Kegiatan belum dikonfigurasi</p>';
            return;
        }
        
        currentKegiatan = data;
        
        // Update page info
        document.getElementById('kegiatan-nama').textContent = data.nama;
        document.title = data.nama;
        
        if (data.deskripsi) {
            document.getElementById('kegiatan-deskripsi').textContent = data.deskripsi;
        } else {
            document.getElementById('kegiatan-deskripsi').style.display = 'none';
        }
        
        if (data.jadwal) {
            const jadwalDate = new Date(data.jadwal);
            document.getElementById('kegiatan-jadwal').textContent = jadwalDate.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // WA group link
        if (data.wa_group_link) {
            const waContainer = document.getElementById('wa-link-container');
            const waLink = document.getElementById('wa-link');
            waLink.href = data.wa_group_link;
            waContainer.style.display = 'block';
        }
        
        // Load peserta
        await loadPeserta();
    } catch (error) {
        console.error('Error loading kegiatan info:', error);
        showAlert('Error memuat informasi kegiatan', 'error');
    } finally {
        hideLoading();
    }
}

async function loadPeserta() {
    try {
        const response = await fetch('/api/peserta');
        const data = await response.json();
        allPeserta = data;
    } catch (error) {
        console.error('Error loading peserta:', error);
        showAlert('Error memuat data peserta', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== TAB MANAGEMENT ====================
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activate button
    event.target.classList.add('active');
    
    // Clear previous selections
    selectedPeserta = null;
    updateSelectedPeserta(tabName);
    clearSearch(tabName);
}

// ==================== MASUK SEARCH ====================
function handleMasukSearch() {
    const query = document.getElementById('masuk-search').value.trim();
    
    if (query.length === 0) {
        document.getElementById('masuk-suggestions').classList.remove('active');
        return;
    }
    
    const suggestions = allPeserta.filter(p => {
        return p.nama.toLowerCase().includes(query.toLowerCase()) && p.status === 'belum_masuk';
    });
    
    renderSuggestions('masuk', suggestions, query);
}

function handleIzinSearch() {
    const query = document.getElementById('izin-search').value.trim();
    
    if (query.length === 0) {
        document.getElementById('izin-suggestions').classList.remove('active');
        return;
    }
    
    const suggestions = allPeserta.filter(p => {
        return p.nama.toLowerCase().includes(query.toLowerCase()) && p.status === 'belum_masuk';
    });
    
    renderSuggestions('izin', suggestions, query);
}

function renderSuggestions(type, suggestions, query) {
    const container = document.getElementById(type + '-suggestions');
    
    if (suggestions.length === 0) {
        container.innerHTML = '<div class="suggestion-item" style="color: #999;">Peserta tidak ditemukan</div>';
        container.classList.add('active');
        return;
    }
    
    container.innerHTML = suggestions.map((p, idx) => `
        <div class="suggestion-item" onclick="selectPeserta('${type}', ${p.id}, '${p.nama}')">
            <strong>${highlightQuery(p.nama, query)}</strong>
        </div>
    `).join('');
    
    container.classList.add('active');
}

function highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background-color: #FFFF00;">$1</mark>');
}

function selectPeserta(type, pesertaId, pesertaNama) {
    selectedPeserta = { id: pesertaId, nama: pesertaNama };
    
    // Clear search
    document.getElementById(type + '-search').value = '';
    document.getElementById(type + '-suggestions').classList.remove('active');
    
    updateSelectedPeserta(type);
    
    if (type === 'izin') {
        document.getElementById('izin-form-container').style.display = 'block';
        document.getElementById('alasan-izin').focus();
    }
}

function updateSelectedPeserta(type) {
    const container = document.getElementById('selected-peserta-' + type);
    
    if (!selectedPeserta) {
        container.innerHTML = '<span class="empty">Pilih peserta untuk melanjutkan</span>';
        document.getElementById('submit-' + type + '-btn').style.display = 'none';
        return;
    }
    
    container.innerHTML = `
        <div class="peserta-chip">
            ${selectedPeserta.nama}
            <span class="remove-btn" onclick="clearSelectedPeserta('${type}')">✕</span>
        </div>
    `;
    
    document.getElementById('submit-' + type + '-btn').style.display = 'block';
}

function clearSelectedPeserta(type) {
    selectedPeserta = null;
    updateSelectedPeserta(type);
    
    if (type === 'izin') {
        document.getElementById('izin-form-container').style.display = 'none';
        document.getElementById('alasan-izin').value = '';
    }
    
    clearSearch(type);
}

function clearSearch(type) {
    document.getElementById(type + '-search').value = '';
    document.getElementById(type + '-suggestions').classList.remove('active');
}

// ==================== SUBMIT ABSENSI ====================
async function submitMasuk() {
    if (!selectedPeserta) {
        showAlert('Pilih peserta terlebih dahulu', 'error');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch('/api/absensi/masuk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                peserta_id: selectedPeserta.id,
                link_id: linkId
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            showSuccessMessage(`✅ ${selectedPeserta.nama} - ${translateStatus(result.status)}`);
            
            // Clear selection
            clearSelectedPeserta('masuk');
            
            // Reload peserta
            await loadPeserta();
        } else {
            showAlert('Error menyimpan data', 'error');
            hideLoading();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error menyimpan data', 'error');
        hideLoading();
    }
}

async function submitIzin() {
    if (!selectedPeserta) {
        showAlert('Pilih peserta terlebih dahulu', 'error');
        return;
    }
    
    const alasan = document.getElementById('alasan-izin').value.trim();
    
    showLoading();
    try {
        const response = await fetch('/api/absensi/izin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                peserta_id: selectedPeserta.id,
                link_id: linkId,
                alasan: alasan
            })
        });
        
        if (response.ok) {
            showSuccessMessage(`📋 ${selectedPeserta.nama} - Izin${alasan ? ' (' + alasan.substring(0, 30) + '...)' : ''}`);
            
            // Clear form
            clearSelectedPeserta('izin');
            
            // Reload peserta
            await loadPeserta();
        } else {
            showAlert('Error menyimpan data', 'error');
            hideLoading();
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error menyimpan data', 'error');
        hideLoading();
    }
}

// ==================== UI FEEDBACK ====================
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

function showSuccessMessage(message) {
    const msgDiv = document.getElementById('success-message');
    msgDiv.textContent = message;
    msgDiv.style.display = 'block';
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 3000);
}

// ==================== UTILITIES ====================
function translateStatus(status) {
    const translations = {
        'masuk': 'Masuk',
        'terlambat': 'Terlambat',
        'izin': 'Izin',
        'belum_masuk': 'Belum Masuk'
    };
    return translations[status] || status;
}
