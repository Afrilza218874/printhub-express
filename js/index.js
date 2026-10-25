// Data Harga Dasar Produk
const HARGA_PRODUK = {
    mmt: {
        nama: "Cetak MMT Spanduk & Banner Luar Ruang",
        hargaDasar: 14000,
        satuan: "m²"
    },
    a3: {
        nama: "Cetak Digital Lembaran A3+ (Brosur/Menu/Kalender/Sertifikat)",
        hargaDasar: 8000,
        satuan: "lembar"
    },
    a4: {
        nama: "Print & Fotocopy Dokumen A4",
        hargaDasar: 1000,
        satuan: "lembar"
    }
};

// Nomor WhatsApp Tujuan (Ganti dengan nomor WA Anda, gunakan kode negara 62)
const NOMOR_WA = "6281234567890";

// Fungsi untuk memformat angka ke Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Fungsi membuka Modal Kalkulator dan langsung memilih produk yang diklik
function bukaKalkulator(kodeProduk) {
    const modal = document.getElementById('modalKalkulator');
    const selectProduk = document.getElementById('pilihProduk');

    // Set pilihan dropdown sesuai tombol produk yang diklik
    selectProduk.value = kodeProduk;

    // Tampilkan modal
    modal.classList.add('active');

    // Sesuaikan tampilan input dan hitung nilai awal
    ubahFormProduk();
}

// Fungsi menutup Modal Kalkulator
function tutupKalkulator() {
    const modal = document.getElementById('modalKalkulator');
    modal.classList.remove('active');
}

// Menutup modal jika pengguna klik area luar kotak modal
window.onclick = function (event) {
    const modal = document.getElementById('modalKalkulator');
    if (event.target === modal) {
        tutupKalkulator();
    }
};

// Mengubah tampilan form input tergantung produk (MMT butuh Panjang x Lebar, A3/A4 hanya butuh Jumlah Lembar)
function ubahFormProduk() {
    const kodeProduk = document.getElementById('pilihProduk').value;
    const inputUkuranMMT = document.getElementById('inputUkuranMMT');
    const labelJumlah = document.getElementById('labelJumlah');

    if (kodeProduk === 'mmt') {
        inputUkuranMMT.style.display = 'block';
        labelJumlah.innerText = 'Jumlah Spanduk / Banner (Pcs):';
    } else {
        inputUkuranMMT.style.display = 'none';
        labelJumlah.innerText = 'Jumlah Cetak (Lembar):';
    }

    hitungTotal();
}

// Fungsi utama untuk menghitung estimasi harga
function hitungTotal() {
    const kodeProduk = document.getElementById('pilihProduk').value;
    const jumlah = parseFloat(document.getElementById('jumlahCetak').value) || 0;

    let totalHarga = 0;
    let teksRincian = "";

    if (kodeProduk === 'mmt') {
        const panjang = parseFloat(document.getElementById('panjangMMT').value) || 0;
        const lebar = parseFloat(document.getElementById('lebarMMT').value) || 0;
        const luas = panjang * lebar;

        totalHarga = luas * jumlah * HARGA_PRODUK.mmt.hargaDasar;
        teksRincian = `Ukuran: ${panjang}m × ${lebar}m (Luas ${luas} m²) × ${jumlah} pcs × Rp 14.000`;
    } else if (kodeProduk === 'a3') {
        totalHarga = jumlah * HARGA_PRODUK.a3.hargaDasar;
        teksRincian = `${jumlah} lembar A3+ × Rp 8.000`;
    } else if (kodeProduk === 'a4') {
        totalHarga = jumlah * HARGA_PRODUK.a4.hargaDasar;
        teksRincian = `${jumlah} lembar A4 × Rp 1.000`;
    }

    // Tampilkan ke layar
    document.getElementById('rincianHitungan').innerText = teksRincian;
    document.getElementById('totalHargaTeks').innerText = formatRupiah(totalHarga);
}

// Fungsi mengirim hasil hitungan langsung ke chat WhatsApp
function pesanViaWA() {
    const kodeProduk = document.getElementById('pilihProduk').value;
    const jumlah = document.getElementById('jumlahCetak').value;
    const totalTeks = document.getElementById('totalHargaTeks').innerText;
    const namaProduk = HARGA_PRODUK[kodeProduk].nama;

    let detailUkuran = "";
    if (kodeProduk === 'mmt') {
        const panjang = document.getElementById('panjangMMT').value;
        const lebar = document.getElementById('lebarMMT').value;
        detailUkuran = `\n- Ukuran: ${panjang}m x ${lebar}m`;
    }

    const pesan = `Halo Admin *PrintHub Express*, saya ingin memesan layanan cetak dengan rincian berikut:\n\n` +
        `- Layanan: *${namaProduk}*${detailUkuran}\n` +
        `- Jumlah: *${jumlah} ${kodeProduk === 'mmt' ? 'Pcs' : 'Lembar'}*\n` +
        `- Estimasi Total: *${totalTeks}*\n\n` +
        `Mohon informasi lebih lanjut untuk pengiriman file desainnya. Terima kasih!`;

    const urlWA = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}
