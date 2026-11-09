# Product Requirements Document (PRD): WellTrash Platform
## Arsitektur: Pure Laravel 12 Monolith (Blade + Tailwind CSS)

<!-- ponytail: Pure Laravel 12 monolith without SPA/React/TypeScript dependencies; single standard server-side rendering stack supports up to 100k daily requests on modest VPS. Upgrade to microservices or dedicated mobile app only if field conditions strictly demand native background offline-first telemetry. -->

---

## 1. Executive Summary & Latar Belakang

- **Nama Produk:** WellTrash Ecosystem (Sistem Operasional Pengelolaan Sampah Komersial B2B, Logistik Armada, & Tata Kelola Finansial Sirkular).
- **Entitas & Lokasi:** WellTrash Jember (Fasilitas MRF: WellTrash Farm, Baratan Wetan, Kec. Patrang, Kab. Jember, Jawa Timur).
- **Fokus Arsitektur:** **100% Laravel Monolith (Blade + Tailwind CSS)**. Menghapus ketergantungan pada React, Inertia.js, dan TypeScript demi menyederhanakan pipeline pengembangan, menghilangkan overhead kompilasi frontend ganda, memaksimalkan kecepatan render server, serta menjamin keandalan akses pada perangkat mobile operator lapangan.
- **Tujuan Utama:**
  1. Digitalisasi manifest sampah B2B legal & akuntabel (RSUD dr. Soebandi, RS Siloam, RS Kaliwates, F&B, dll).
  2. Manajemen dispatch armada penjemputan dan pencatatan tonase timbangan harian.
  3. Presensi geolokasi (GPS) dan otomatisasi estimasi gaji harian operator lapangan.
  4. Penagihan langganan (invoicing) otomatis dan monitoring pembayaran mitra.
  5. Konsolidasi keuangan sirkular 8 divisi operasional (Clean Up, Maggot BSF, Unggas, MDU daur ulang, Minyak Jelantah, dll) beserta pembagian dividen pemegang saham.

---

## 2. Aktor Sistem & Matriks Akses (RBAC)

Aplikasi menggunakan role-based access control terpadu melalui kolom `role` pada tabel `users`:

| Aktor / Role | Tanggung Jawab Utama | Antarmuka Utama | Format Render |
|---|---|---|---|
| **Superadmin / Direksi** | Kontrol penuh sistem, approval mitra, live map armada, tutup buku bulanan, audit cap table investor | `/admin/*` | Desktop-first Blade |
| **Admin Operasional & CS** | Verifikasi invoice, input katalog/berita/CMS, review permohonan lembur & cuti operator | `/admin/*` | Desktop-first Blade |
| **Mitra B2B (`company`)** | Cek jadwal ritase penjemputan, unduh manifest & invoice PDF, upload bukti transfer | `/company/*` | Responsive Blade |
| **Operator Lapangan (`CleanUP`)** | Ambil armada, jalankan rute penjemputan, timbang sampah (kg/kresek), upload foto nota timbangan, presensi GPS | `/cleanup/*` & REST API | Mobile-first Blade (Thumb-zone) |
| **Investor (`Shareholder`)** | Pantau kinerja laba bulanan, lembar saham pribadi, riwayat dividen, unduh slip bagi hasil PDF | `/investor/*` | Responsive Clean Blade |
| **Publik (Tamu)** | Profil kemitraan, katalog pupuk kasgot & larva BSF, edukasi daur ulang, pendaftaran mitra baru | `/`, `/layanan`, dll | Server-side SEO Blade |

---

## 3. Gambaran Alur Sistem End-to-End (Operational Lifecycle)

```text
┌─────────────────┐      ┌─────────────────────────┐      ┌──────────────────────────┐
│  Calon Mitra    │ ───> │  Superadmin Verifikasi  │ ───> │  Penjadwalan Ritase      │
│  Daftar Online  │      │  & Aktifkan Akun        │      │  (Senin, Rabu, Sabtu)    │
└─────────────────┘      └─────────────────────────┘      └────────────┬─────────────┘
                                                                       │
┌─────────────────┐      ┌─────────────────────────┐                   │
│ Pengolahan MRF  │ <─── │ Operator Lapangan       │ <─────────────────┘
│ & Biokonversi   │      │ Jemput, Timbang, Foto   │ (Armada: Viar/Carry/GranMax)
└────────┬────────┘      └─────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐      ┌─────────────────────────────┐
│ 8 Stream Pendapatan Divisi + 13 Pos Beban     │ ───> │ Otomatisasi Laba Bersih,    │
│ (MDU, Maggot BSF, Komersial, Mijel, Sufor)   │      │ Dividen 92.5%, CSR & Zakat  │
└──────────────────────────────────────────────┘      └─────────────────────────────┘
```

1. **Onboarding Mitra B2B:** Mitra mendaftar via web -> Admin verifikasi fisik/kontrak -> Set koordinat geolokasi -> Terbit jadwal ritase mingguan.
2. **Dispatch & Eksekusi Lapangan:** Tiap pagi sistem generate tugas penjemputan -> Operator `CleanUP` login lewat HP -> Pilih kendaraan armada -> Menuju lokasi -> Timbang sampah & foto nota -> Data tonase tersimpan real-time.
3. **Penyaluran ke WellTrash Farm (Hilir):** Sampah organik masuk biokonversi Maggot BSF; sampah non-organik dipilah ke MDU (15 kategori daur ulang); minyak jelantah dikumpulkan ke Divisi Mijel.
4. **Billing & ESG Reporting:** Tagihan invoice dibuat otomatis bulanan -> Mitra unduh invoice PDF & upload bukti bayar -> Admin approve -> Rekap tonase terakumulasi untuk sertifikat ESG.
5. **Penutupan Buku & Dividen (WT-Finance):** Jurnal harian mencatat kas operasional -> Akhir bulan Admin tutup buku (*period lock*) -> Sistem menghitung Laba Bersih -> Alokasi: 92.5% Dividen (20 investor), 5% CSR, 2.5% Zakat.

---

## 4. Spesifikasi Modul Fungsional (Pure Laravel Monolith)

### 4.1 Modul Publik & Web Landing (Blade SSR)
- **Rute:** `/`, `/tentang-kami`, `/layanan`, `/activity`, `/news`, `/katalog`.
- **Fitur:** Katalog produk hilir (Maggot segar/kering, kasgot), peta jangkauan Jember, sitemap XML otomatis (`/generate-sitemap`), dan formulir kemitraan.

### 4.2 Modul Mitra B2B (`/company/*`)
- **Fitur:** Kalender ritase penjemputan, manifest digital riwayat tonase + foto bukti timbangan lapangan, daftar invoice bulanan (unduh PDF DomPDF), upload bukti bayar, dan upgrade paket langganan.

### 4.3 Modul Operator Lapangan CleanUP (`/cleanup/*`)
- **Desain UI:** Mobile-first Blade (antarmuka jempol, kontras tinggi di bawah terik matahari, tombol minimal 44px).
- **Fitur:** Pemilihan armada harian (Viar R3, Carry, GranMax), kartu rute penjemputan mitra, input timbangan (kg & jumlah kresek) + upload foto kamera nota, presensi GPS (Clock-in/Clock-out browser native), klaim lembur, dan rekap estimasi gaji harian.

### 4.4 Modul Admin & Dispatcher (`/admin/*`)
- **Fitur:** Peta monitoring Leaflet/OSM untuk tracking armada dan mitra, approval registrasi mitra B2B + penentuan titik koordinat lat/long, manajemen kendaraan operasional, persetujuan lembur & cuti tim lapangan, verifikasi pembayaran invoice, dan CMS konten.

### 4.5 Modul Keuangan & Dividen Sirkular (WT-Finance)
- **Fitur:**
  - **11 Pos OPEX:** Listrik, air, service, bbm, oli, atk, sapronak, retribusi, entertain, gaji, sewa.
  - **2 Pos CAPEX:** Tool kit, sparepart.
  - **8 Divisi Revenue:** Clean Up, Larva BSF, Unggas, MDU (15 kategori daur ulang), Return Produk, Biopond, Sufor, Mijel.
  - **PnL Engine & Period Lock:** `Laba Bersih = Revenue - OPEX`. Alokasi 92.5% Dividen (terdistribusi proporsional ke 20 investor), 5% CSR, 2.5% Zakat. Penguncian periode mencegah manipulasi historis. Ekspor slip dividen dan laporan keuangan PDF.

---

## 5. Arsitektur Teknologi & Mengapa Pure Laravel Blade

```text
[ Browser Klien / HP Lapangan ] ──(HTTP HTML5 Form & SSR)──> [ Nginx / Apache Server ]
                                                                       │
                                                            [ Laravel 12 Monolith ]
                                                            ├── Routes & Middleware
                                                            ├── Blade + Tailwind CSS
                                                            ├── Eloquent ORM
                                                            └── DomPDF
                                                                       │
                                                            [ MySQL / SQLite ]
```

1. **Zero Frontend Overhead:** Menghilangkan kompilasi ganda (TypeScript/React/Babel). Tidak ada lag hidrasi di perangkat HP operator berbiaya rendah.
2. **Keamanan Bawaan Framework:** CSRF token (`@csrf`) otomatis di semua formulir, auto-escaping Blade untuk proteksi XSS, session auth berbasis HTTP-only cookies.
3. **Produktivitas Pengembang Tinggi:** Satu bahasa (PHP) untuk routing, validasi (`FormRequest`), manipulasi basis data, dan antarmuka. Satu orang pengembang mampu merawat seluruh ekosistem tanpa gesekan stack.


---

## 6. Skema Basis Data Relasional Terpadu

```text
users ───────────┬──< companies (1:1 per profil akun mitra)
                 ├──< attendances (1:N riwayat presensi GPS harian)
                 ├──< leave_requests (1:N izin & cuti operator)
                 └──< finance_shareholders (1:1 investor portal)

companies ───────┬──< pickups (1:N jadwal dan log penjemputan harian)
                 ├──< company_activities (1:N log pemilahan / sirkularitas)
                 └──< invoices (1:N tagihan langganan bulanan)

vehicles ───────────< pickups (armada yang ditugaskan per ritase)

finance_periods ─┬──< finance_transactions (jurnal kas harian OPEX/CAPEX & 8 Divisi)
                 └──< finance_dividends (rincian transfer bagi hasil per investor)

finance_shareholders ──< finance_dividends (rekap kepemilikan saham & histori dividen)
```

- **Integritas Data:** Semua kalkulasi keuangan menggunakan kolom `DECIMAL(15,2)` untuk mencegah pembulatan floating point liar.
- **Audit Trail:** Penutupan buku (`finance_periods.status = 'closed'`) dilindungi constraint database & Eloquent policy agar transaksi historis tidak dapat dimanipulasi setelah tutup buku.

---

## 7. Prinsip Simplifikasi ("The Lazy Senior Dev Ladder")

1. **YAGNI (You Aren't Gonna Need It):** Jangan buat SPA, GraphQL, atau microservice untuk operasional 30–50 mitra B2B di tingkat kabupaten. Monolith Laravel menyederhanakan backup, maintenance, dan deployment.
2. **Native Platform First:**
   - Gunakan fitur native HTML5 (`<input type="date">`, `<input type="file" capture="environment">` untuk kamera HP tanpa plugin aneh).
   - Gunakan CSS Tailwind murni untuk layout dan animasi mikro, hindari runtime framer-motion atau JS bundle besar.
   - Gunakan geolokasi browser native (`navigator.geolocation`) untuk absensi GPS operator.
3. **Penyimpanan Dokumen:** Simpan PDF manifest dan bukti pembayaran langsung di storage lokal Laravel (`storage/app/public`) dengan hash filename unik.

---

## 8. Roadmap & Tahapan Rilis

- **Sprint 1 (Fondasi Blade & Auth):** Bersihkan sisa dependensi React, pastikan semua halaman Admin, Company, dan CleanUP render via Blade.
- **Sprint 2 (Modul Lapangan CleanUP):** Sempurnakan form timbangan mobile dan presensi GPS menggunakan Blade komponen responsif.
- **Sprint 3 (WT-Finance & Dividen):** Migrasi tabel keuangan, form input 8 divisi + OPEX harian, kalkulasi laba rugi, dan slip dividen PDF via DomPDF.
- **Sprint 4 (Testing & UAT Lapangan):** Validasi ritase harian bersama operator armada di lapangan dan verifikasi akurasi data dividen 20 investor.

