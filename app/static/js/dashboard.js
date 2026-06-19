// ==================== DASHBOARD.JS ====================

let currentKegiatan = null;
let pesertaList = [];
let allPeserta = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadKegiatan();
    setupEventListeners();
    
    // Refresh stats setiap 2 detik
    setInterval(refreshStats, 2000);
    setInterval(loadPesertaList, 2000);
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Form submission
    document.getElementById('kegiatan-form').addEventListener('submit', handleKegiatanSubmit);
    
    // File input
    document.getElementById('file-input').addEventListener('change', handleFileUpload);
    
    // Peserta filtering
    document.getElementById('peserta-filter').addEventListener('keyup', filterPeserta);
    document.getElementById('status-filter').addEventListener('change', filterPeserta);
}

// ==================== KEGIATAN MANAGEMENT ====================
async function loadKegiatan() {
    try {
        const response = await fetch('/api/kegiatan');
        const data = await response.json();
        
        if (data) {
            currentKegiatan = data;
            populateForm(data);
            updateQRCode();
            loadPesertaList();
            refreshStats();
        } else {
            // Create default kegiatan
            const linkId = generateLinkId();
            document.getElementById('link_id').value = linkId;
            document.getElementById('nama').focus();
        }
    } catch (error) {
        console.error('Error loading kegiatan:', error);
        showAlert('Error memuat data kegiatan', 'error');
    }
}

function populateForm(kegiatan) {
    document.getElementById('nama').value = kegiatan.nama || '';
    document.getElementById('deskripsi').value = kegiatan.deskripsi || '';
    document.getElementById('link_id').value = kegiatan.link_id || '';
    document.getElementById('wa_group_link').value = kegiatan.wa_group_link || '';
    
    if (kegiatan.jadwal) {
        document.getElementById('jadwal').value = kegiatan.jadwal.slice(0, 16);
    }
    
    document.getElementById('kegiatan-title').textContent = kegiatan.nama || 'Sistem Absensi';
}

async function handleKegiatanSubmit(e) {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value.trim();
    if (!nama) {
        showAlert('Nama kegiatan tidak boleh kosong', 'error');
        return;
    }
    
    const data = {
        nama: nama,
        deskripsi: document.getElementById('deskripsi').value.trim(),
        jadwal: document.getElementById('jadwal').value || null,
        link_id: document.getElementById('link_id').value,
        wa_group_link: document.getElementById('wa_group_link').value.trim()
    };
    
    try {
        const response = await fetch('/api/kegiatan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            await loadKegiatan();
            updateQRCode();
            showAlert('Data kegiatan berhasil disimpan!', 'success');
        } else {
            showAlert('Error menyimpan data kegiatan', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error menyimpan data kegiatan', 'error');
    }
}

function generateNewLink() {
    const newLink = generateLinkId();
    document.getElementById('link_id').value = newLink;
    showAlert('ID Link berhasil direset. Jangan lupa simpan perubahan!', 'info');
}

function generateLinkId() {
    return 'link_' + Math.random().toString(36).substring(2, 10);
}

// ==================== FILE UPLOAD ====================
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/peserta/import', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('Data berhasil diimport!', 'success');
            await loadPesertaList();
            await refreshStats();
        } else {
            const result = await response.json();
            showAlert(result.error || 'Error mengimport data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error mengimport data', 'error');
    }
    
    // Reset file input
    e.target.value = '';
}

// ==================== PESERTA MANAGEMENT ====================
async function loadPesertaList() {
    try {
        const response = await fetch('/api/peserta');
        const data = await response.json();
        
        allPeserta = data;
        filterPeserta();
    } catch (error) {
        console.error('Error loading peserta:', error);
    }
}

function filterPeserta() {
    const searchTerm = document.getElementById('peserta-filter').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    pesertaList = allPeserta.filter(p => {
        const matchSearch = p.nama.toLowerCase().includes(searchTerm);
        const matchStatus = statusFilter === '' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });
    
    renderPesertaList();
}

function renderPesertaList() {
    const container = document.getElementById('peserta-list');
    
    if (pesertaList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Belum ada data peserta</p>';
        return;
    }
    
    container.innerHTML = pesertaList.map(p => `
        <div class="peserta-item ${p.status}">
            <div class="peserta-info">
                <div class="peserta-nama">
                    ${p.nama}
                    <span class="peserta-status-badge ${p.status}">${translateStatus(p.status)}</span>
                </div>
                ${p.waktu_absensi ? `<div class="peserta-status">Waktu: ${formatDateTime(p.waktu_absensi)}</div>` : ''}
                ${p.alasan_izin ? `<div class="peserta-alasan">Alasan: ${p.alasan_izin}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// ==================== STATS ====================
async function refreshStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        document.getElementById('total-peserta').textContent = stats.total_peserta;
        document.getElementById('masuk-count').textContent = stats.masuk;
        document.getElementById('terlambat-count').textContent = stats.terlambat;
        document.getElementById('izin-count').textContent = stats.izin;
        document.getElementById('belum-masuk-count').textContent = stats.belum_masuk;
    } catch (error) {
        console.error('Error refreshing stats:', error);
    }
}

// ==================== QR CODE ====================
function updateQRCode() {
    if (!currentKegiatan) return;
    
    const qrImg = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-qr-btn');
    const linkContainer = document.getElementById('absensi-link-container');
    
    const imageUrl = `/api/qrcode?t=${Date.now()}`;
    qrImg.src = imageUrl;
    qrImg.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
    
    linkContainer.style.display = 'block';
    document.getElementById('absensi-link').value = `${window.location.origin}/absensi/${currentKegiatan.link_id}`;
}

function copyAbsensiLink() {
    const linkInput = document.getElementById('absensi-link');
    linkInput.select();
    document.execCommand('copy');
    showAlert('Link berhasil dicopy!', 'success');
}

function exportExcel() {
    window.location.href = '/api/export/excel';
}

async function resetData() {
    if (!confirm('Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan!')) {
        return;
    }
    
    try {
        const response = await fetch('/api/reset', {
            method: 'POST'
        });
        
        if (response.ok) {
            currentKegiatan = null;
            allPeserta = [];
            pesertaList = [];
            
            // Clear form
            document.getElementById('kegiatan-form').reset();
            const linkId = generateLinkId();
            document.getElementById('link_id').value = linkId;
            
            // Update UI
            renderPesertaList();
            await refreshStats();
            
            showAlert('Data berhasil direset!', 'success');
            
            // Wait 2 seconds then reload
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error mereset data', 'error');
    }
}

// ==================== UTILITIES ====================
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

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function translateStatus(status) {
    const translations = {
        'masuk': '✅ Masuk',
        'terlambat': '⏰ Terlambat',
        'izin': '📋 Izin',
        'belum_masuk': '❌ Belum Masuk'
    };
    return translations[status] || status;
}
