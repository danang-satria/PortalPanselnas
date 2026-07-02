# Portal Panselnas PHTC 2026 🚀

Portal resmi tidak berbayar untuk pencarian hasil kelulusan seleksi SDM KDKMP dan KNMP 2026. Dibangun dengan fokus pada **Kecepatan**, **Desain Premium**, dan **Keandalan Tinggi** dalam mengelola ratusan ribu data peserta (termasuk status kelulusan dari tahap CAT hingga penempatan Satdik Layer 3).

## 🌟 Fitur Utama

- **Pencarian Real-Time Cepat (Ultra-Fast Search):** Mencari ratusan ribu data peserta berdasarkan Nomor Peserta atau Nama hanya dalam hitungan milidetik.
- **Desain UI/UX Premium:** Antarmuka gelap (Dark Mode) modern menggunakan *Tailwind CSS* dipadukan dengan efek kaca (*Glassmorphism*) dan animasi halus dari *Framer Motion*.
- **Distribusi Penempatan Terperinci:** Dashboard visual yang menampilkan total sebaran peserta ke berbagai Satuan Pendidikan (Satdik) menggunakan sistem navigasi Paginasi.
- **Kamus Status Cerdas:** Halaman khusus berisi glosarium (kamus) interaktif untuk menerjemahkan akronim kelulusan Panselnas (misal: `P1/L`, `TMS-1`, dsb).
- **SEO & Social Media Ready:** Konfigurasi Meta tags, OpenGraph, dan Twitter Cards yang otomatis muncul menarik apabila link situs ini dibagikan di WhatsApp, Telegram, atau Twitter.

## 🛠 Teknologi yang Digunakan

- **[Next.js (App Router)](https://nextjs.org/)** - Framework React mutakhir untuk arsitektur *frontend* dan *serverless API*.
- **[SQLite (better-sqlite3)](https://github.com/WiseLibs/better-sqlite3)** - Database ringan dan baca-cepat (*read-only*) yang ditanamkan langsung tanpa memerlukan server database terpisah.
- **[Tailwind CSS](https://tailwindcss.com/)** - *Styling* utilitas untuk merakit antarmuka tingkat lanjut.
- **[Framer Motion](https://www.framer.com/motion/)** - *Library* animasi tingkat produksi untuk interaksi mulus.
- **[Python](https://www.python.org/)** - Digunakan sebagai *Toolkit* ekstraksi PDF raksasa (PyMuPDF/Fitz) dan perakitan file `database.db`.

## 📦 Menjalankan Proyek di Komputer Anda (Localhost)

Karena ini menggunakan Next.js standar, Anda bisa menjalankan situs ini di komputer Anda dengan sangat mudah.

### Prasyarat
1. Node.js (versi 18+)
2. File `database.db` (harus sudah tersedia di direktori *root*).

### Cara Install & Jalan
```bash
# 1. Install semua dependensi Next.js
npm install

# 2. Jalankan server pengembangan
npm run dev
```

Buka `http://localhost:3000` di peramban (browser) Anda untuk melihat portal ini beraksi!

## 🧰 Toolkit Python (Ekstraktor PDF)

Jika Anda ingin mengekstrak data dari pengumuman PDF resmi Panselnas atau membangun ulang file `database.db`, Anda dapat menggunakan alat Python serbaguna yang sudah disediakan.

Pastikan Anda memiliki *Library* Python yang dibutuhkan:
```bash
pip install pandas pymupdf
```

Lalu jalankan alat *Command Line* (CLI):
```bash
python panselnas.py
```
Anda akan disajikan dengan menu otomatis untuk melakukan seluruh sinkronisasi *database*.

## 🚀 Panduan Deploy (Vercel)

Proyek ini telah direkayasa secara khusus agar dapat berjalan di atas server *Vercel* secara gratis, meskipun *Vercel* tidak memberikan fitur *"Write"* pada *database* di sistem serverless mereka.

**Cara Deploy:**
1. Masukkan kode ini ke repositori **GitHub** Anda.
2. Buka [Vercel Dashboard](https://vercel.com/new).
3. Import repositori GitHub Anda.
4. (Opsional) Biarkan *Root Directory* pada pengaturan standar / *default*.
5. Klik **Deploy**!

---

*Dibuat dengan penuh dedikasi untuk mempermudah akses informasi seleksi PHTC 2026.*
