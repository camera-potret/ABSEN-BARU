"""
Test script untuk memastikan aplikasi berjalan dengan baik
Run: python test_app.py
"""

import unittest
import json
import sys
from datetime import datetime, timedelta

# Add app directory to path
sys.path.insert(0, '.')

from app import app, db, Kegiatan, Peserta, Absensi

class TestAbsensiApp(unittest.TestCase):
    
    def setUp(self):
        """Setup test client dan database"""
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        
        db.create_all()
    
    def tearDown(self):
        """Cleanup"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_get_kegiatan_empty(self):
        """Test get kegiatan when empty"""
        response = self.app.get('/api/kegiatan')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsNone(data)
    
    def test_create_kegiatan(self):
        """Test create kegiatan"""
        kegiatan_data = {
            'nama': 'Test Kegiatan',
            'deskripsi': 'Test Description',
            'jadwal': None,
            'link_id': 'test_link_123',
            'wa_group_link': 'https://chat.whatsapp.com/test'
        }
        
        response = self.app.post(
            '/api/kegiatan',
            data=json.dumps(kegiatan_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        result = json.loads(response.data)
        self.assertIn('success', result)
        self.assertTrue(result['success'])
    
    def test_get_stats(self):
        """Test get statistics"""
        response = self.app.get('/api/stats')
        self.assertEqual(response.status_code, 200)
        
        stats = json.loads(response.data)
        self.assertIn('total_peserta', stats)
        self.assertIn('masuk', stats)
        self.assertIn('terlambat', stats)
        self.assertIn('izin', stats)
        self.assertIn('belum_masuk', stats)
    
    def test_dashboard_page(self):
        """Test dashboard page renders"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sistem Absensi', response.data)
    
    def test_peserta_search(self):
        """Test peserta search functionality"""
        # Create kegiatan
        kegiatan = Kegiatan(
            nama='Test',
            link_id='test_123'
        )
        db.session.add(kegiatan)
        db.session.commit()
        
        # Create peserta
        peserta = Peserta(
            kegiatan_id=kegiatan.id,
            nama='Test Peserta'
        )
        db.session.add(peserta)
        db.session.commit()
        
        # Test search
        response = self.app.get('/api/peserta/search/test_123?q=Test')
        self.assertEqual(response.status_code, 200)
        
        result = json.loads(response.data)
        self.assertTrue(len(result) > 0)
        self.assertEqual(result[0]['nama'], 'Test Peserta')

if __name__ == '__main__':
    unittest.main()
