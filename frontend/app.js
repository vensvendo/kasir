// State Global Aplikasi
let daftarBarang = [];
let keranjang = [];

document.addEventListener('DOMContentLoaded', () => {
    loadTab('penjualan');
});

// Fungsi Navigasi Tab Modular
async function switchTab(tabName) {
    const btnPenjualan = document.getElementById('btn-tab-penjualan');
    const btnStok = document.getElementById('btn-tab-stok');

    if (tabName === 'penjualan') {
        btnPenjualan.className = 'px-4 py-2 rounded-lg font-medium bg-indigo-700 text-white transition shadow';
        btnStok.className = 'px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 text-indigo-100 transition';
    } else {
        btnStok.className = 'px-4 py-2 rounded-lg font-medium bg-indigo-700 text-white transition shadow';
        btnPenjualan.className = 'px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 text-indigo-100 transition';
    }

    await loadTab(tabName);
}

async function loadTab(tabName) {
    const container = document.getElementById('main-content');
    try {
        // Gunakan path absolut root agar Express melayani file dengan tepat
        const response = await fetch(`/${tabName}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        container.innerHTML = html;

        // Eksekusi skrip di dalam HTML yang di-fetch secara manual jika dibutuhkan, 
        // atau jalankan fungsi inisialisasi
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
            script.remove();
        });

        // Jalankan fungsi inisialisasi spesifik
        setTimeout(() => {
            if (tabName === 'penjualan' && typeof initPenjualanTab === 'function') {
                initPenjualanTab();
            } else if (tabName === 'stok' && typeof initStokTab === 'function') {
                initStokTab();
            }
        }, 50);

    } catch (error) {
        console.error('Gagal memuat halaman tab:', error);
        container.innerHTML = `<div class="p-6 text-center text-rose-500 font-semibold">Gagal memuat konten tab (${tabName}.html). Pastikan server berjalan dengan baik.</div>`;
    }
}

// API Helper untuk mengambil data barang
async function fetchBarangAPI() {
    try {
        const response = await fetch('/api/barang');
        const result = await response.json();
        if (result.status === 'success') {
            daftarBarang = result.data;
        }
    } catch (error) {
        console.error('Gagal mengambil data barang:', error);
    }
}

function tutupModal() {
    document.getElementById('modal-sukses').classList.add('hidden');
}
