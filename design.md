# Desain UI/UX Operator WellTrash (Mode Mobile / HP)

Dokumen ini mendokumentasikan sistem desain, arsitektur antarmuka (UI), dan pengalaman pengguna (UX) untuk aktor **CleanUP (Operator Lapangan)** WellTrash pada mode smartphone/mobile saat ini.

---

## 1. Konteks Lapangan & Filosofi Desain

Operator lapangan bekerja dalam kondisi dinamis: di atas bak armada, basement gedung mitra, atau TPS tanpa jangkauan sinyal stabil. Desain UI/UX dirancang dengan prinsip:

1. **Thumb-Zone Centric (Pengoperasian Satu Tangan):** Semua aksi utama berada di separuh bawah layar agar mudah dijangkau satu jempol.
2. **Offline-First & Fault-Tolerant:** Tidak boleh ada data timbangan atau foto yang hilang karena sinyal hilang di basement.
3. **High Contrast & Glare Resistance:** Kontras warna tajam agar terbaca di bawah terik matahari lapangan.
4. **Low-Bandwidth Resilient:** Kompresi otomatis foto bukti sebelum unggah ke server untuk menghemat kuota dan mempercepat transmisi.
5. **Touch Target Nyaman:** Seluruh tombol aksi memiliki tinggi minimal 44px dengan feedback visual saat disentuh (`active:scale-95`).

---

## 2. Token Visual & Desain Sistem Mobile

### A. Palet Warna Fungsional

| Token | Hex / Class Tailwind | Fungsi Antarmuka |
|---|---|---|
| **Primary Emerald** | `#059669` / `emerald-600` | Aksi utama, status aktif nav bawah, tombol selesai, submit tugas |
| **Primary Gradient** | `from-green-500 to-green-600` | Header active chip, floating button absen masuk |
| **Background Kanvas** | `#F8FAFC` / `bg-[#F8FAFC]` | Latar belakang layar mobile agar tidak menyilaukan |
| **Surface White** | `#FFFFFF` / `bg-white` | Kartu tugas, bottom sheet modal, navigasi bawah |
| **Offline Amber** | `#F59E0B` / `amber-500` | Badge antrean offline, peringatan sinyal terputus, status menunggu sinkron |
| **Warning Red** | `#EF4444` / `rose-600` | Tombol batal tugas, status dibatalkan, keluar sistem |
| **Text Primary** | `#0F172A` / `slate-900` | Headline tugas, nama mitra, teks utama |
| **Text Muted** | `#64748B` / `slate-500` | Subtitle, alamat mitra, metadata tanggal |

### B. Skala Tipografi Mobile

| Tingkat | Ukuran | Bobot | Penggunaan |
|---|---|---|---|
| **Header Title** | 18–20px (`text-lg`) | ExtraBold (`font-extrabold`) | Judul halaman mobile (Tugas, Absensi, Riwayat) |
| **Card Heading** | 16–18px (`text-base`) | Bold (`font-bold`) | Nama PT / Mitra pada kartu tugas |
| **Body Standard** | 13–14px (`text-sm`) | Medium (`font-medium`) | Input form, deskripsi ringkas, tombol aksi |
| **Secondary Meta** | 11–12px (`text-xs`) | Semibold / Medium | Alamat mitra, label form, catatan PIC |
| **Micro Caption** | 9–10px (`text-[10px]`) | Bold / Black | Label icon tab nav bawah, badge antrean offline |

---

## 3. Struktur Navigasi & Pola Tata Letak (Layout)

```text
┌──────────────────────────────────────────────┐
│  [☰ Menu]   Tugas Hari Ini      [Avatar Profil] │ ← Top Sticky Header (h-16)
├──────────────────────────────────────────────┤
│  [📦 Banner Status Sinkronisasi Offline]      │ ← Banner Reaktif Jaringan
├──────────────────────────────────────────────┤
│  PILIH HARI OPERASIONAL                      │
│  [ Senin ] [ Selasa* ] [ Rabu ] [ Kamis ] →  │ ← Horizontal Scrollable Chips
├──────────────────────────────────────────────┤
│  FILTER: [Semua] [Menunggu] [Selesai]        │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │
│  │ PT. RS Kaliwates             [Dijemput]│  │
│  │ 📍 Jl. Basuki Rahmat No. 1            │  │
│  │ 👤 PIC: dr. Hendra (0812xxxx) [📞][💬] │  │
│  │ [ Mulai Pickup / Input & Selesai ]     │  │ ← Kartu Tugas Vertikal
│  └────────────────────────────────────────┘  │
│                                              │
│                               [ ⏱️ Absen ]    │ ← Floating Action Button (FAB)
├──────────────────────────────────────────────┤
│  [📅 Tugas] [📸 Kegiatan] [🛡️ Absen] [📜 Riwayat] [🔄 2] │ ← Fixed Bottom Nav (h-16)
└──────────────────────────────────────────────┘
```

### 1. Top Sticky Header
- Tinggi tetap: `h-16` (64px) dengan latar `bg-white/80 backdrop-blur-md` dan `border-b border-gray-100`.
- Kiri: Tombol Hamburger Menu (`md:hidden`) untuk membuka side drawer profil.
- Tengah: Judul halaman reaktif yang truncate jika nama layar panjang.
- Kanan: Indikator PWA Install dan thumbnail avatar operator.

### 2. Fixed Bottom Navigation Bar (5 Tab)
- Selalu menempel di dasar viewport (`fixed bottom-0 inset-x-0 z-40`).
- Dilengkapi padding aman iPhone/Android gesture bar: `pb-[env(safe-area-inset-bottom,0px)]`.
- Struktur 5 Tab simetris:
  1. **Tugas** (`cleanup.dashboard`): Kartu jadwal penjemputan sampah hari ini.
  2. **Kegiatan** (`cleanup.kegiatan`): Log pemanfaatan & olah sampah mitra.
  3. **Absensi** (`cleanup.attendance`): Presensi GPS, lembur, dan rekap estimasi gaji.
  4. **Riwayat** (`cleanup.history`): Riwayat tugas selesai dan pembatalan.
  5. **Sinkron** (`cleanup.sync`): Manajemen antrean offline lokal dengan badge angka reaktif (`amber-500` pulse).

### 3. Floating Action Button (FAB) Absensi
- Melayang di atas bottom navigation bar (`bottom-20 right-4`).
- Label & status dinamis mengikuti kondisi hari ini:
  - Belum absen: *"Absen Masuk"* (Hijau Gradient).
  - Sudah masuk: *"Absen Pulang"* (Oranye/Amber Gradient).
  - Lembur disetujui: *"Lembur Masuk"* / *"Lembur Pulang"* (Indigo/Rose).

### 4. Sliding Side Drawer
- Panel overlay geser dari kiri untuk akses cepat ke profil operator, panduan unduh PWA, info versi aplikasi, dan tombol Logout bertema merah.

---

## 4. Alur & Pengalaman Pengguna (UX User Flows)

### Flow 1: Presensi Berbasis GPS & Kamera HP
1. Operator menekan FAB Absensi di pojok kanan bawah.
2. Bottom modal terbuka menampilkan:
   - Tombol **"Ambil Lokasi GPS"**: Mengaktifkan HTML5 Geolocation API (`enableHighAccuracy: true`). Koordinat lintang dan bujur terekam otomatis.
   - Area **"Foto Kehadiran"**: Akses kamera selfie perangkat operator.
   - Kompresi gambar client-side (maksimal 1280×1280px, kualitas 78%) berjalan di latar belakang tanpa memberatkan HP operator.
3. Operator menekan **"Konfirmasi Absen"**; data terkirim langsung ke server.

### Flow 2: Eksekusi Tugas Penjemputan Sampah
1. Operator melihat daftar tugas pada tab **Tugas**.
2. Operator dapat memfilter hari lewat *Horizontal Date Pills* atau memfilter status (*Semua*, *Menunggu*, *Selesai*).
3. Aksi Cepat Kontak:
   - Ikon Panggil: Melakukan direct call ke nomor PIC mitra.
   - Ikon WhatsApp: Membuka percakapan WhatsApp chat dengan PIC.
   - Ikon Navigasi: Menghubungkan alamat ke Google Maps.
4. **Mulai Pickup:** Menekan tombol hitam *"Mulai Pickup"* mengubah status menjadi `on_the_way`.
5. **Input & Selesai:** Saat sampah telah diambil, operator menekan tombol hijau *"Input & Selesai"*.

### Flow 3: Bottom-Sheet Form Input Sampah
1. Modal beranimasi slide-up dari dasar layar HP.
2. **Tab Mode Input:**
   - **Mode "Hanya Trashbag":** Digunakan jika mitra tidak memiliki timbangan. Operator hanya menginput total jumlah kantong sampah (kantong merah/hitam/kuning).
   - **Mode "Timbang + Trashbag":** Menampilkan field berat per kategori:
     - Organik (Kg)
     - Anorganik / Daur Ulang (Kg)
     - Residu (Kg)
     - Total Trashbag (Kantong)
3. **Dokumentasi Bukti Foto (Wajib):**
   - Tombol **Buka Kamera:** Membuka kamera belakang (`capture="environment"`) untuk memotret timbangan/sampah seketika.
   - Tombol **Buka Galeri:** Memilih foto dari penyimpanan galeri perangkat jika sebelumnya sudah dipotret.
   - Thumbnail preview foto seketika muncul dengan tombol ganti kamera/galeri.
4. **Validasi & Store-and-Forward:**
   - Foto divalidasi ukuran maksimalnya (10 MB) lalu dikompresi otomatis menjadi WebP/JPEG ringan.
   - Jika tombol submit ditekan:
     - **Saat Online:** Dikirim langsung ke server. Jika sukses, modal tertutup dan kartu bertanda hijau selesai.
     - **Saat Offline / Sinyal Hilang:** Data beserta foto disimpan langsung ke IndexedDB (`offlinePickupQueue`). Kartu berubah menampilkan badge amber *"Tersimpan di HP (Menunggu Sinyal)"*. Operator tetap dapat lanjut bekerja tanpa terganggu loading gagal.

### Flow 4: Toleransi 48 Jam & Sinkronisasi Offline
1. Sinyal sering hilang di basement gedung bertingkat.
2. Sistem menyertakan timestamp `offline_recorded_at` saat tombol rekam ditekan di HP.
3. Backend memvalidasi toleransi penundaan unggah hingga **48 jam** dari waktu pencatatan asli.
4. Saat HP kembali menangkap sinyal 4G/WiFi:
   - Banner `CleanUPOfflineSync` mendeteksi event `window.addEventListener('online')`.
   - Proses auto-sync mengunggah antrean satu per satu disertai progress bar.
   - Operator juga dapat membuka tab **Sinkron** untuk memantau status atau melakukan sinkronisasi paksa secara manual.

### Flow 5: Kepegawaian, Izin, & Rekap Finansial
1. Pada tab **Absensi**:
   - Operator melihat kartu performa bulan aktif: Total Hari Kerja, Hari Memenuhi Syarat (≥ 8 jam), Total Jam Lembur.
   - **Estimasi Gaji Transparan:** Kalkulasi otomatis harian (Upah Pokok Rp 67.692/hari + Upah Lembur) tertera jelas sehingga operator dapat melacak estimasi penghasilan mereka.
2. Tab Switcher Sub-Menu:
   - **Absensi:** Riwayat kartu log masuk/pulang harian.
   - **Izin / Sakit:** Form pengajuan izin/sakit disertai upload foto surat dokter.
   - **Lembur:** Pengajuan rencana jam kerja lembur yang menunggu persetujuan admin.


---

## 5. Ringkasan Komponen UI Mobile Operator

| Komponen | File Path | Fungsi Utama di Mode HP |
|---|---|---|
| **CleanUPSidebar** | `resources/js/Components/CleanUPSidebar.tsx` | Navigasi bawah fixed 5 tab + sliding drawer menu |
| **AbsensiFloatingButton** | `resources/js/Components/AbsensiFloatingButton.tsx` | Floating button presensi GPS + selfie modal |
| **CleanUPOfflineSync** | `resources/js/Components/CleanUPOfflineSync.tsx` | Banner pendeteksi online/offline & auto-uploader |
| **Dashboard** | `resources/js/Pages/CleanUP/Dashboard.tsx` | Jadwal hari, filter status, kartu tugas, modal input sampah |
| **Attendance** | `resources/js/Pages/CleanUP/Attendance.tsx` | Kartu rekap gaji, riwayat presensi, izin, lembur |
| **Activities** | `resources/js/Pages/CleanUP/Activities.tsx` | Log dokumentasi pemanfaatan sampah per mitra |
| **Sync** | `resources/js/Pages/CleanUP/Sync.tsx` | Layar inspeksi antrean lokal IndexedDB & trigger upload |
| **History** | `resources/js/Pages/CleanUP/History.tsx` | Arsip penjemputan selesai & pembatalan tugas |
| **offlinePickupQueue** | `resources/js/utils/offlinePickupQueue.ts` | Enkapsulasi penyimpanan IndexedDB & background sync |
| **compressImage** | `resources/js/utils/compressImage.ts` | Kompresi gambar client-side (HTML5 Canvas) |

---

## 6. Fitur Pendukung & Rekomendasi Evolusi UX

1. **PWA Standalone Display:** Dilengkapi Web App Manifest dan Service Worker agar dapat diinstal di homescreen Android/iOS seperti aplikasi native tanpa address bar browser.
2. **Safe Area Inset:** Mendukung `env(safe-area-inset-bottom)` agar navigasi bawah tidak tertutup navigation bar bawaan ponsel.
3. **Penyimpanan Lokal Anti-Hilang:** Penyimpanan blob foto dan payload di IndexedDB browser tahan saat HP di-restart atau baterai habis di jalan.
4. **Haptic Feedback (Tahap Lanjutan):** Menambahkan getaran perangkat pendek (`navigator.vibrate([30])`) saat tombol scan kamera selesai atau upload sukses.
5. **Geo-Fencing Radius Check (Tahap Lanjutan):** Peringatan jarak radius bila operator melakukan check-in di luar area koordinat mitra yang ditentukan.

