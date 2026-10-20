# UI Style Guide & Design Specification: WellTrash Landing Page

Dokumen ini merupakan panduan gaya antarmuka (*UI Style Document*) resmi dan menyeluruh untuk **Landing Page WellTrash** (`resources/js/Pages/Welcome.tsx` beserta seluruh komponen turunannya). Panduan ini merangkum filosofi visual, sistem token (warna, tipografi, grid, spacing, border-radius), pola komponen, interaksi mikro (*micro-interactions*), serta aturan implementasi berbasis **Tailwind CSS**, **React**, dan **Inertia.js**.

---

## 1. Filosofi & Arah Desain (*Design Direction*)

### 1.1 Konsep Visual: *Editorial Corporate Sustainability*
Landing page WellTrash tidak menggunakan estetika visual startup konsumer biasa atau marketplace sampah, melainkan mengadopsi pendekatan **Editorial Corporate Sustainability**. Konsep ini menggabungkan:
- **Kredibilitas Korporat & B2B**: Dirancang untuk pengambil keputusan perusahaan (Manajer Fasilitas, Direktur Operasional, Tim Keberlanjutan/ESG, Pemilik Bisnis, dan Manajemen Rumah Sakit).
- **Karakter Editorial**: Perpaduan sans-serif modern yang kokoh dengan aksen serif kursif (*italic*) klasik untuk memberikan kesan prestisius dan bernas.
- **Rasa Teknis & Presisi Operasional**: Penggunaan font *monospace* untuk nomor langkah, rasio metrik, dan label metadata teknis, diperkuat oleh garis grid teknik (*engineering blueprint grid*).
- **Keberlanjutan yang Terukur**: Mengedepankan data tonase, bukti operasional autentik, diagram sirkularitas, serta menghindari klaim ramah lingkungan kosong (*no greenwashing*).

### 1.2 Prinsip Desain Inti (*Core Design Principles*)
1. **Border Over Shadow**: Struktur dan hierarki kartu/kontainer dibangun dengan border tipis 1px subtil (`border-ink/10` atau `border-white/10`), bukan dengan bayangan besar (*drop shadow* tebal).
2. **Restraint in Accent Color**: Warna aksen *lime* (`#B7E35C`) digunakan dengan disiplin tinggi—hanya untuk *Call to Action* (CTA) kritis, tag highlight, status aktif, dan aksen headline. Latar belakang dominan tetaplah hijau hutan gelap (`#0C3325`) dan kertas hangat (`#F4F6EF`).
3. **Intentional Hierarchy**: Setiap section memiliki penanda konteks (*eyebrow* dengan DM Mono), judul utama (*headline* dengan DM Sans + aksen Instrument Serif), dan deskripsi terarah (*muted body text*).
4. **Authentic Imagery**: Mengutamakan foto armada, tim operasional berseragam dengan APD lengkap, dan fasilitas pengolahan nyata (WellTrash Farm).

---

## 2. Palet & Sistem Warna (*Color System*)

Konfigurasi warna landing page dikonfigurasi melalui `tailwind.config.js` dan diterapkan secara konsisten pada seluruh section.

### 2.1 Brand & Dominant Colors

| Token Tailwind | Kode Hex | RGB / HSL | Penggunaan di Landing Page |
| :--- | :--- | :--- | :--- |
| `green-deep` | `#0C3325` | `rgb(12, 51, 37)` | Background Hero section, Section Dampak & Pelaporan, Footer, Navbar Solid, Primary CTA Button |
| `green-forest` | `#103C2B` | `rgb(16, 60, 43)` | Latar sekunder kartu gelap, aksen teks serif italic, ikon fitur, hover state tombol gelap |
| `ink` | `#10271D` | `rgb(16, 39, 29)` | Warna teks utama (*headings*, label utama) di atas permukaan terang |

### 2.2 Accent & Highlight Colors

| Token Tailwind | Kode Hex | RGB / HSL | Penggunaan di Landing Page |
| :--- | :--- | :--- | :--- |
| `lime` (`DEFAULT`) | `#B7E35C` | `rgb(183, 227, 92)` | Tombol CTA primer, teks sorotan headline, floating metric badge, text selection (`selection:bg-lime`), Section CTA Penutup |
| `lime/10` s.d. `lime/40` | Alpha | Variatif | Background badge eyebrow, border aksen sudut, ring focus |
| `accent-300` / `lime-300` | `#CBEA89` | `rgb(203, 234, 137)` | Aksen teks headline di atas latar belakang gelap |

### 2.3 Surface & Neutral Backgrounds

| Token Tailwind | Kode Hex | RGB / HSL | Penggunaan di Landing Page |
| :--- | :--- | :--- | :--- |
| `paper` | `#F4F6EF` | `rgb(244, 246, 239)` | Warna latar belakang dasar halaman, Trust Bar, Cara Kerja, Berita |
| `mint` | `#DFE9CE` | `rgb(223, 233, 206)` | Latar belakang Section Keunggulan Operasional (pemisah ritme visual) |
| `white` (`#FFFFFF`) | `#FFFFFF` | `rgb(255, 255, 255)` | Latar belakang Section Solusi, kartu tahapan alur kerja, kartu FAQ, dan panel katalog |

### 2.4 Text & Feedback Colors

| Token Tailwind | Kode Hex / Opacity | Penggunaan di Landing Page |
| :--- | :--- | :--- |
| `text-ink` | `#10271D` | Judul section, nama partner, judul kartu di latar terang |
| `text-muted` | `#5F756A` | Teks paragraf, deskripsi kartu, metadata sekunder |
| `text-white` | `#FFFFFF` | Teks utama pada latar belakang `green-deep` |
| `text-paper/85` | `rgba(244, 246, 239, 0.85)` | Deskripsi hero dan paragraf pada section gelap |
| `text-paper/70` | `rgba(244, 246, 239, 0.70)` | Caption, sub-keterangan pada section gelap |
| `text-green-deep/90` | `rgba(12, 51, 37, 0.90)` | Paragraf di atas background `lime` pada CTA banner |

### 2.5 Aturan Border & Opacity

- **Di atas latar terang (`paper` / `white` / `mint`)**:
  - Garis batas default: `border-ink/10` (10% opasitas `ink`)
  - Garis batas saat hover: `border-ink/25` atau `border-ink/30`
- **Di atas latar gelap (`green-deep`)**:
  - Garis batas default: `border-white/10` (10% opasitas putih)
  - Garis batas pembagi utama: `border-white/15`
  - Garis batas hover/highlight: `border-lime/40` atau `border-white/30`

---

## 3. Tipografi (*Typography System*)

Sistem tipografi menggunakan kombinasi 3 jenis font khusus yang dimuat via Google Fonts di `resources/css/app.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&display=swap');
```

### 3.1 Peran Keluarga Huruf (*Font Families*)

1. **DM Sans (`font-sans`)**:
   - **Fungsi**: Workhorse utama untuk semua teks fungsional, navigasi, tombol, judul section, kartu konten, dan paragraf.
   - **Karakter**: Geometric sans-serif yang modern, sangat terbaca di layar desktop maupun seluler.
2. **Instrument Serif (`font-serif`)**:
   - **Fungsi**: Aksen editorial eksklusif pada kata kunci headline hero, judul section, dan *pull-quote* ("*Waste better. Grow better.*").
   - **Aturan**: Wajib digunakan dalam format miring (*italic*) dengan bobot `font-normal`. Tidak boleh digunakan untuk teks paragraf panjang.
3. **DM Mono (`font-mono`)**:
   - **Fungsi**: Penomoran urutan (`01`, `02`, `03`), angka metrik kuantitatif (`8.000 kg+`, `30+`), eyebrow label section, tanggal berita, dan tag teknis.
   - **Aturan**: Digunakan dengan huruf kapital (*uppercase*) dan *letter-spacing* lebar (*tracking-widest*).

### 3.2 Hierarki & Skala Tipografi (*Type Scale*)

| Level Hirarki | Kelas Tailwind | Ukuran (Desktop / Mobile) | Font Family & Weight | Karakter Tambahan |
| :--- | :--- | :--- | :--- | :--- |
| **Eyebrow / Overline** | `font-mono text-xs uppercase` | 12px (0.75rem) | `DM Mono`, Bold / Semibold | `tracking-widest`, warna `text-muted` atau `text-lime` |
| **Hero Display H1** | `text-4xl sm:text-5xl lg:text-6xl` | 36px s.d. 60px | `DM Sans`, Bold (`font-bold`) | `tracking-tight leading-[1.08]` |
| **Hero Italic Accent** | `font-serif italic font-normal` | Menyesuaikan H1 | `Instrument Serif`, Regular | Berwarna `text-lime` pada dark hero |
| **Section Title H2** | `text-3xl sm:text-4xl lg:text-5xl` | 30px s.d. 48px | `DM Sans`, Bold (`font-bold`) | `tracking-tight leading-tight` atau `leading-[1.15]` |
| **Section Italic Word** | `font-serif italic font-normal` | Menyesuaikan H2 | `Instrument Serif`, Regular | Berwarna `text-green-forest` di section terang |
| **Card / Item Title H3** | `text-xl sm:text-2xl` atau `text-lg sm:text-xl` | 18px s.d. 24px | `DM Sans`, Bold (`font-bold`) | `tracking-tight` |
| **Lead / Subtitle** | `text-base sm:text-lg` | 16px s.d. 18px | `DM Sans`, Regular | `leading-relaxed`, `text-muted` atau `text-paper/85` |
| **Body Text** | `text-xs sm:text-sm` s.d. `text-sm sm:text-base` | 13px s.d. 16px | `DM Sans`, Regular | `leading-relaxed`, `text-muted` atau `text-paper/70` |
| **Metric Stat Number** | `text-2xl sm:text-3xl lg:text-4xl` | 24px s.d. 40px | `DM Mono`, Bold (`font-bold`) | `tracking-tight` |
| **Caption / Meta Info** | `text-xs font-mono` | 12px (0.75rem) | `DM Mono`, Regular / Medium | `text-muted` / `text-paper/60` |

---

## 4. Spacing, Grid, & Tata Letak (*Layout & Spacing*)

### 4.1 Grid & Kontainer Utama
- **Maksimum Lebar Halaman**: `max-w-[1440px] mx-auto`
- **Padding Horizontal Halaman**:
  - Mobile & Tablet: `px-6` (24px)
  - Desktop: `lg:px-12` (48px)
- **Padding Vertikal Section**:
  - Section Standar: `py-20 lg:py-28` (80px mobile, 112px desktop)
  - Hero Section: `pt-32 pb-20 lg:pt-36 lg:pb-28` (kompensasi fixed navbar)
  - Trust Bar: `py-12 lg:py-16` (48px mobile, 64px desktop)

### 4.2 Skala Spacing Tailwind yang Dominan
- Jarak antar-elemen mikro: `gap-1.5` s.d. `gap-3` (6px s.d. 12px)
- Padding dalam kartu: `p-5 sm:p-6` s.d. `p-7 sm:p-8` (20px s.d. 32px)
- Jarak heading ke paragraf: `mb-3` s.d. `mb-6` (12px s.d. 24px)
- Jarak antar-blok dalam section: `mb-12` s.d. `mb-16` (48px s.d. 64px)

### 4.3 Karakter Radius Sudut (*Border Radius*)
- **`rounded-sm` (2px)**: Standar sudut pada WellTrash! Diterapkan pada kartu konten, tombol utama, input pencarian, badge status, container gambar, dan panel ilustrasi. Menghasilkan karakter tegas, teknis, dan presisi.
- **`rounded-full` (9999px)**: Hanya digunakan untuk elemen bulat fungsional seperti titik status (*indicator dot*), tombol lingkaran kecil, dan widget WhatsApp mengambang.
- **Dilarang**: Penggunaan `rounded-2xl` atau `rounded-3xl` berlebihan pada kartu editorial yang merusak citra korporat.


---

## 5. Rincian Anatomi Setiap Section Landing Page

Berikut adalah spesifikasi mendalam dari setiap bagian antarmuka di `Welcome.tsx`:

### 5.1 Global Header & Navbar (`Navbar.tsx`)

| Elemen | Spesifikasi Visual | Kelas CSS / Tailwind |
| :--- | :--- | :--- |
| **Kontainer Nav** | Fixed top, z-index 50, transisi scroll dinamis | `fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full` |
| **Kondisi Awal (Scroll = 0)** | Transparan dengan garis border halus di bawah | `bg-transparent border-b border-white/10 py-5` |
| **Kondisi Tergulung (Scroll > 20px)** | Blur hijau hutan gelap dengan bayangan ringan | `bg-green-deep/95 backdrop-blur-md border-b border-white/10 py-3.5 shadow-sm` |
| **Logo WellTrash** | Format WebP, tinggi proporsional | `h-10 md:h-12 w-auto object-contain` |
| **Menu Tautan Desktop** | Teks DM Sans medium, jarak renggang | `text-white/80 hover:text-white text-sm font-sans font-medium tracking-tight transition-colors` |
| **Menu Link Aktif** | Warna lime kontras | `text-lime font-semibold` |
| **Tombol PWA Header** | Outline teknis mono | `font-mono text-xs border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 rounded-sm` |
| **Tombol CTA Dashboard** | Latar lime dengan teks green-deep | `bg-lime text-green-deep hover:bg-white font-sans font-semibold text-sm px-5 py-2.5 rounded-sm transition-colors` |
| **Drawer Mobile** | Panel slide-down full width hijau gelap | `bg-green-deep border-b border-white/10 px-6 py-6 space-y-4` |

---

### 5.2 Hero Section

Bagian utama pembuka yang mengomunikasikan proposisi nilai inti dengan pendekatan sinematik operasional.

| Komponen | Spesifikasi Teknis | Kode Tailwind / Styling |
| :--- | :--- | :--- |
| **Latar Belakang Gambar** | `hero_waste_transport.webp`, difilter untuk kontras teks | `filter brightness-[0.88] contrast-[1.08] object-cover object-right lg:object-center` |
| **Gradient Wash** | Gradien ganda (arah kanan & arah atas) | `bg-gradient-to-r from-green-deep via-green-deep/85 lg:via-green-deep/60 to-transparent` & `bg-gradient-to-t from-green-deep via-transparent to-green-deep/50` |
| **Technical Grid Overlay** | Garis grid blueprint teknik ukuran 48px | `opacity-[0.04] pointer-events-none` dengan `linear-gradient(to right, #ffffff 1px, transparent 1px)` |
| **Corner Markers** | Aksen border siku L di pojok section | `w-4 h-4 border-t-2 border-l-2 border-lime/40` (hidden pada mobile, visible pada desktop) |
| **Eyebrow Badge** | Badge kapsul kecil semi-transparan | `font-mono text-xs uppercase tracking-widest text-lime bg-lime/10 border border-lime/25 px-3 py-1 rounded-sm` |
| **Heading H1** | Skala besar dengan kontras sans dan serif | `text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-white leading-[1.08]` |
| **CTA Utama** | Tombol blok warna lime | `bg-lime text-green-deep hover:bg-white rounded-sm font-sans font-semibold text-base px-7 py-3.5 shadow-sm transition-colors` |
| **CTA Sekunder** | Tombol garis batas putih | `border border-white/30 text-white hover:bg-white/10 rounded-sm font-sans font-semibold text-base px-7 py-3.5 transition-colors` |
| **Metrics Stat Bar** | Grid 3 kolom terbagi garis border atas | `grid grid-cols-3 gap-6 pt-10 border-t border-white/15` |
| **Stat Value** | Tipografi monospace lime | `font-mono text-2xl sm:text-3xl font-bold tracking-tight text-lime` |
| **Stat Label** | Deskripsi pendek pendukung | `font-sans text-xs sm:text-sm text-paper/70 font-medium` |


---

### 5.3 Trust Bar & Kategori Industri (`Mitra.tsx`)

Membangun legitimasi instansional melalui kategori sektor dan logo mitra resmi (DLH, Pemkab, Rumah Sakit, BUMN).

| Komponen | Spesifikasi Visual | Catatan Implementasi |
| :--- | :--- | :--- |
| **Latar Belakang** | Warna `paper` dengan border horizontal atas & bawah | `bg-paper border-y border-ink/10 py-12 lg:py-16` |
| **Label Section** | Monospace uppercase di tengah | `font-mono text-xs uppercase tracking-widest text-muted text-center mb-8` |
| **Chips Kategori Industri** | Kapsul putih semi-transparan dengan ikon garis | `bg-white/70 border border-ink/10 px-3 py-1.5 rounded-sm hover:text-green-forest transition-colors` |
| **Pemisah Titik Kategori** | Dot titik antar kategori pada desktop | `text-ink/20 hidden lg:inline` |
| **Grid Logo Mitra** | Grid 6 kolom desktop, 3 kolom tablet, 2 kolom mobile | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6` |
| **Kartu Logo** | Kotak putih dengan ketinggian seragam | `bg-white border border-ink/10 rounded-sm p-4 sm:p-5 h-20 sm:h-24 flex items-center justify-center` |
| **Efek Grayscale Logo** | Default abu-abu pudar, kembali berwarna saat kursor mengarah | `grayscale opacity-65 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300` |

---

### 5.4 Solusi B2B & Pilihan Paket Layanan (`Why.tsx`)

Menerangkan spesialisasi layanan korporat: Corporate Waste, Industrial Waste, dan Recyclable Recovery.

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Latar putih bersih | `bg-white py-20 lg:py-28` |
| **Kartu Solusi (3 Kolom)** | Kartu berlatar kertas halus dengan border | `bg-paper/60 border border-ink/10 rounded-sm p-7 sm:p-8 hover:bg-paper hover:border-ink/25 transition-all` |
| **Nomor Indeks Kartu** | Angka urut monospace | `font-mono text-xs text-muted font-semibold tracking-wider` |
| **Kotak Ikon Solusi** | Kotak putih dengan outline ikon hijau hutan | `w-10 h-10 rounded-sm bg-white border border-ink/10 flex items-center justify-center text-green-forest` |
| **Frame Ilustrasi Teknis** | Wadah ilustrasi vektor SVG arsitektur | `w-full bg-white border border-ink/10 rounded-sm p-2 mb-6 group-hover:border-green-forest/30 transition-colors` |
| **Tautan Navigasi Kartu** | Teks link dengan panah transisi | `text-xs font-semibold text-green-forest hover:text-green-deep group-hover:translate-x-1` |
| **Panel Paket Frekuensi** | Panel ringkasan 3 tier di bawah kartu | `bg-paper border border-ink/10 rounded-sm p-6 lg:p-8` |
| **Tier Item** | Paket Reguler (2-3x), Prime (4-5x), Premium+ (Harian) | `grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-ink/10` |

---

### 5.5 Alur Operasional & Blueprint Fasilitas (`WasteFlow.tsx`)

Menjelaskan 4 tahapan kerja terstruktur (*Waste Assessment*, *Tailored Plan*, *Reliable Collection*, *Impact Reporting*) serta visualisasi fasilitas pemrosesan terpadu.

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Kertas `paper` dengan batas atas | `bg-paper py-20 lg:py-28 border-t border-ink/10` |
| **Grid Langkah (4 Kolom)** | 4 kartu langkah horisontal | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12` |
| **Kartu Langkah** | Kartu putih bersih berstruktur tajam | `bg-white border border-ink/10 rounded-sm p-6 flex flex-col justify-between hover:border-ink/25` |
| **Label Langkah** | DM Mono uppercase dengan indikator titik | `font-mono text-xs font-semibold text-muted` + `w-2 h-2 rounded-full bg-green-forest opacity-40` |
| **Frame Ilustrasi Langkah** | Kotak ilustrasi proses workflow SVG | `w-full bg-paper border border-ink/10 rounded-sm p-2 mb-5` |
| **Showcase Fasilitas Farm** | Kontainer blueprint Material Recovery Facility (MRF) | `bg-white border border-ink/10 rounded-sm p-6 lg:p-8` |
| **Tag Fasilitas MRF** | Tag monospace dengan titik lime | `flex items-center gap-2 text-xs font-mono text-muted bg-paper px-3 py-1.5 rounded-sm border border-ink/10` |
| **Blueprint SVG Container** | Wadah gambar diagram dengan scroll horizontal di mobile | `w-full overflow-x-auto min-w-[680px]` |


---

### 5.6 Pencatatan, Dampak, & ESG Reporting (`Impact.tsx`)

Section gelap berkarakter kuat yang memadukan foto operasional autentik, metrik tonase limbah, dan diagram pemulihan material (*circularity pipeline*).

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Hijau hutan pekat (`green-deep`) | `bg-green-deep text-white py-20 lg:py-28 relative overflow-hidden` |
| **Struktur Grid** | 12 Kolom (5 kolom foto & metrik, 7 kolom fitur & diagram) | `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center` |
| **Frame Foto Operasional** | Foto karyawan dan fasilitas dengan border lembut | `border border-white/10 rounded-sm overflow-hidden bg-green-forest h-[380px] sm:h-[460px] lg:h-[500px]` |
| **Floating Metric Card** | Kartu mengambang berwarna lime pekat | `bg-lime text-green-deep p-6 rounded-sm border border-lime shadow-xl sm:absolute sm:-bottom-6 sm:-right-6` |
| **Angka Metrik Mengambang** | Tipografi mono tebal | `font-mono text-3xl sm:text-4xl font-bold tracking-tight text-green-deep` |
| **Kartu Fitur Pelaporan** | 4 sub-kartu berlatar transparan hijau hutan | `border border-white/10 bg-green-forest/40 p-5 rounded-sm hover:border-lime/40 transition-colors` |
| **Wadah Diagram Sirkularitas** | Kotak diagram visualisasi alur material ESG | `border border-white/10 rounded-sm p-4 sm:p-5 bg-green-forest/30 mb-8` |
| **Pill Target Pemulihan** | Badge target pengalihan TPA | `font-mono text-xs text-lime bg-green-deep px-2.5 py-1 rounded-sm border border-white/10` |

---

### 5.7 Keunggulan Operasional (`Welcome.tsx` - `#keunggulan`)

Menegaskan 3 pilar operasional WellTrash dengan latar pembeda berwarna *mint* (`#DFE9CE`).

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Hijau lembut `mint` | `bg-mint text-ink py-20 lg:py-28 border-t border-ink/10` |
| **Struktur Grid** | 7 Kolom teks & kartu pilar, 5 kolom ilustrasi arsitektur | `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center` |
| **Kartu Pilar (01, 02, 03)** | Kotak putih semi-transparan dengan border tipis | `border border-ink/10 bg-white/80 p-5 sm:p-6 rounded-sm hover:border-ink/25 transition-colors` |
| **Kotak Ikon Pilar** | Kotak mint berbingkai dengan ikon garis | `w-10 h-10 rounded-sm bg-mint border border-ink/10 flex items-center justify-center shrink-0` |
| **Indeks Angka Pilar** | Label urutan bold hijau hutan | `font-mono text-xs font-bold text-green-forest` |
| **Panel Ilustrasi Ekosistem** | Visual arsitektur platform terpadu WellTrash | `bg-white/80 border border-ink/10 rounded-sm p-6 lg:p-8 flex items-center justify-center` |

---

### 5.8 Katalog Daur Ulang (`Welcome.tsx` - `#katalog`)

Menampilkan etalase produk bernilai tambah hasil daur ulang (*upcycled products*).

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Latar putih `bg-white` | `bg-white py-20 lg:py-28 border-t border-ink/10` |
| **Kartu Produk** | Kartu rasio proporsional dengan gambar thumbnail | `bg-paper border border-ink/10 rounded-sm p-5 hover:border-ink/30 transition-all group flex flex-col justify-between` |
| **Thumbnail Produk** | Rasio kotak 1:1 dengan efek zoom hover halus | `aspect-square bg-white rounded-sm overflow-hidden mb-4 border border-ink/5` |
| **Label Harga Produk** | Format mata uang Rupiah monospace | `font-mono text-xs font-bold text-green-forest` |
| **Empty State** | Border putus-putus (*dashed*) jika belum ada katalog | `py-16 text-center rounded-sm border border-dashed border-ink/20 bg-paper` |
| **Ilustrasi Empty State** | Vektor ilustrasi wadah katalog kosong | `CatalogEmptyIllustration` |

---

### 5.9 Dokumentasi Aktivitas Lapangan (`ActivitiesSection.tsx`)

Penyajian kegiatan edukasi, CSR, dan operasional dengan tata letak editorial asimetris (7 kolom unggulan, 5 kolom vertikal stack).

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Latar putih `bg-white` | `bg-white py-20 lg:py-28 border-t border-ink/10` |
| **Kartu Unggulan (Col 7)** | Kartu gambar besar dengan overlay teks gelap di bawah | `lg:col-span-7 group relative rounded-sm overflow-hidden min-h-[380px] lg:min-h-[480px] flex items-end border border-ink/10 bg-green-deep` |
| **Gradien Overlay Unggulan** | Gradien hijau pekat dari bawah ke atas | `bg-gradient-to-t from-green-deep via-green-deep/60 to-transparent opacity-90 group-hover:opacity-95` |
| **Kartu Sekunder (Col 5)** | Stack 2 kartu berlatar `paper` | `bg-paper border border-ink/10 rounded-sm p-6 flex flex-col justify-between hover:border-ink/30` |
| **Format Tanggal** | Tanggal lokal Indonesia format DM Mono | `font-mono text-xs text-lime block mb-2 font-medium` (pada gelap) / `text-green-forest` (pada terang) |
| **Placeholder Ilustrasi** | Ilustrasi editorial otomatis jika tidak ada foto | `EditorialPlaceholderIllustration` |


---

### 5.10 Wawasan & Berita (`NewsSection.tsx`)

Artikel editorial seputar regulasi lingkungan, pengelolaan limbah komersial, dan kepatuhan ESG.

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Latar kertas `paper` | `bg-paper py-20 lg:py-28 border-t border-ink/10` |
| **Grid Berita (3 Kolom)** | 3 kartu artikel simetris | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| **Thumbnail Rasio 16:10** | Wadah gambar dengan rasio aspek lanskap editorial | `aspect-[16/10] bg-paper rounded-sm overflow-hidden mb-5 border border-ink/5` |
| **Efek Hover Gambar** | Gambar membesar maksimal 5% | `group-hover:scale-105 transition-transform duration-300` |
| **Judul Artikel** | Potong otomatis maksimal 2 baris | `font-sans font-bold text-lg text-ink mb-2 line-clamp-2 group-hover:text-green-forest transition-colors` |
| **Deskripsi Kutipan** | Potong otomatis maksimal 3 baris | `font-sans text-xs sm:text-sm text-muted line-clamp-3 leading-relaxed` |
| **Footer Kartu Berita** | Border atas pemisah dengan teks "Baca Artikel →" | `pt-4 mt-6 border-t border-ink/10 flex items-center justify-between text-xs font-semibold` |

---

### 5.11 Accordion FAQ Interaktif (`FaqSection.tsx`)

Menjawab keraguan operasional dan dilengkapi Schema.org JSON-LD structured data untuk optimasi mesin pencari (SEO).

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Latar putih bersih | `py-20 lg:py-28 bg-white border-t border-ink/10` |
| **Lebar Kontainer** | Terpusat maksimal 896px | `max-w-4xl border-t border-ink/10 divide-y divide-ink/10` |
| **Tombol Toggle Pertanyaan** | Teks pertanyaan tebal rata kiri dengan icon kanan | `w-full flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-green-forest py-6` |
| **Indikator Status (+ / −)** | Simbol monospace besar berwarna hijau hutan | `font-mono text-xl text-green-forest shrink-0` |
| **Kotak Jawaban** | Teks jawaban terbuka secara halus | `mt-4 pt-2 text-muted font-sans text-base leading-relaxed max-w-3xl` |
| **Mikrodata SEO** | Script JSON-LD tersemat otomatis | `<script type="application/ld+json">` (`@type: FAQPage`) |

---

### 5.12 Banner Konversi Utama (*Final Conversion CTA*)

Titik konversi utama di akhir halaman sebelum footer, menggunakan latar penuh *lime* yang energik dan menonjol.

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Warna penuh `lime` dengan grafis vektor tersembunyi | `bg-lime text-green-deep py-20 lg:py-28 border-t border-ink/10 relative overflow-hidden` |
| **Background Illustration** | Vektor abstraksi arsitektur sirkular | `CtaBackgroundIllustration` dengan posisi `absolute inset-0 pointer-events-none` |
| **Eyebrow Label** | Monospace hijau gelap semi-transparan | `font-mono text-xs uppercase tracking-widest text-green-deep/80 block mb-4 font-semibold` |
| **Heading Utama** | Ukuran besar teks hijau gelap | `text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-green-deep leading-tight max-w-3xl mx-auto mb-6` |
| **Tombol Primer (Bisnis)** | Tombol solid hijau pekat | `bg-green-deep text-white hover:bg-green-forest rounded-sm font-sans font-semibold text-base px-8 py-4 transition-colors` |
| **Tombol Sekunder (WA)** | Tombol outline hijau gelap dengan hover fill | `border border-green-deep/30 text-green-deep hover:bg-green-deep/10 rounded-sm font-sans font-semibold text-base px-8 py-4 transition-colors` |

---

### 5.13 Global Footer (`Footer.tsx`)

Penutup halaman bernuansa formal dan berwibawa dengan informasi legal dan kontak resmi.

| Komponen | Spesifikasi Visual | Kelas CSS / Catatan |
| :--- | :--- | :--- |
| **Latar Belakang** | Hijau hutan pekat (`green-deep`) | `bg-green-deep text-white border-t border-white/10 pt-16 pb-12 font-sans relative` |
| **Logo Footer** | Ikon daun sirkular lime dengan teks "welltrash" | Icon bulat `w-8 h-8 rounded-full bg-lime text-green-deep` + teks `font-bold text-2xl tracking-tight` |
| **Tagline Merek** | Instrument Serif italic warna lime | `font-serif italic text-lime text-lg` ("*Waste better. Grow better.*") |
| **Kolom Navigasi** | Tautan anchor jump ke section halaman | `text-sm font-sans text-paper/80 hover:text-lime transition-colors` |
| **Kolom Kontak Bisnis** | Alamat kantor Patrang Jember, email, dan telepon | Ikon garis lime `w-5 h-5 text-lime` + teks alamat presisi |
| **Bottom Bar Legalitas** | Copyright tahun berjalan dan domisili hukum | `pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-paper/60 border-t border-white/10` |

---

### 5.14 Floating WhatsApp Widget (`WhatsAppWidget.tsx`)

Saluran komunikasi langsung bagi calon mitra yang membutuhkan konsultasi instan.

| Properti | Nilai / Implementasi |
| :--- | :--- |
| **Posisi Layar** | `fixed bottom-6 right-6 z-[99]` |
| **Bentuk & Dimensi** | Lingkaran `w-14 h-14 rounded-full` |
| **Warna Dasar** | Hijau resmi WhatsApp `#25D366` dengan bayangan tebal `shadow-lg hover:shadow-xl` |
| **Animasi Hover** | Mengambang ke atas 4px (`hover:-translate-y-1 transition-all duration-300`) |
| **Beacon Notifikasi** | Titik merah animasi ping berkedip di pojok kanan atas widget (`animate-ping bg-red-400` + solid `bg-red-500`) |
| **Tooltip Interaktif** | Label mengambang di sebelah kiri widget bertuliskan "Hubungi Kami" saat kursor melayang (`group-hover:opacity-100`) |


---

## 6. Pola Komponen & Kelas Standar (*Reusable CSS Patterns*)

Berikut adalah ringkasan kelas Tailwind siap pakai untuk konsistensi pembangunan antarmuka baru:

### 6.1 Tombol (*Buttons*)

```html
<!-- Primary Button (Di latar belakang gelap/Hero) -->
<button class="bg-lime text-green-deep hover:bg-white rounded-sm font-sans font-semibold text-sm px-6 py-3 transition-colors duration-200 inline-flex items-center justify-center gap-2">
  <span>Label Tombol</span>
</button>

<!-- Primary Button (Di latar belakang terang/CTA Lime) -->
<button class="bg-green-deep text-white hover:bg-green-forest rounded-sm font-sans font-semibold text-sm px-6 py-3 transition-colors duration-200 inline-flex items-center justify-center gap-2">
  <span>Label Tombol</span>
</button>

<!-- Secondary Outline Button (Di latar belakang gelap) -->
<button class="border border-white/30 text-white hover:bg-white/10 rounded-sm font-sans font-semibold text-sm px-6 py-3 transition-colors duration-200 inline-flex items-center justify-center gap-2">
  <span>Pelajari Layanan</span>
</button>

<!-- Secondary Outline Button (Di latar belakang terang) -->
<button class="border border-ink/20 text-ink hover:bg-ink/5 rounded-sm font-sans font-semibold text-sm px-6 py-3 transition-colors duration-200 inline-flex items-center justify-center gap-2">
  <span>Hubungi Kami</span>
</button>

<!-- Action Link dengan Panah Interaktif -->
<a class="group inline-flex items-center gap-1.5 text-xs font-semibold text-green-forest hover:text-green-deep transition-colors">
  <span>Detail Layanan</span>
  <span class="group-hover:translate-x-1 transition-transform duration-200">→</span>
</a>
```

### 6.2 Kartu Standar (*Cards*)

```html
<!-- Kartu Terang Standar (Paper Surface) -->
<div class="bg-white border border-ink/10 rounded-sm p-6 hover:border-ink/25 transition-all duration-200">
  <div class="flex items-center justify-between mb-4">
    <span class="font-mono text-xs font-bold text-green-forest">01</span>
  </div>
  <h3 class="font-sans font-bold text-lg text-ink mb-2">Judul Kartu</h3>
  <p class="font-sans text-sm text-muted leading-relaxed">Deskripsi kartu informasi.</p>
</div>

<!-- Kartu Gelap (Dark Green-Forest Surface) -->
<div class="border border-white/10 bg-green-forest/40 p-5 rounded-sm hover:border-lime/40 transition-colors duration-200">
  <span class="font-mono text-xs text-lime block mb-2 font-medium">01</span>
  <h3 class="font-sans font-bold text-base text-white mb-2">Judul Fitur</h3>
  <p class="text-paper/70 font-sans text-xs sm:text-sm leading-relaxed">Deskripsi fitur analitik.</p>
</div>
```

### 6.3 Tag & Eyebrow Label

```html
<!-- Dark Background Eyebrow -->
<span class="font-mono text-xs uppercase tracking-widest text-lime block mb-3 font-semibold">
  PENCATATAN & PELAPORAN
</span>

<!-- Light Background Eyebrow -->
<span class="font-mono text-xs uppercase tracking-widest text-muted block mb-3 font-semibold">
  SOLUSI KAMI
</span>

<!-- Eyebrow Badge Pill (Hero) -->
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-lime/10 border border-lime/25 text-lime font-mono text-xs tracking-wider uppercase">
  <span class="w-1.5 h-1.5 rounded-full bg-lime"></span>
  <span>Pengelolaan Limbah Terpadu</span>
</div>
```


---

## 7. Aturan Aksesibilitas & Responsivitas (*Accessibility & Responsive Rules*)

### 7.1 Breakpoints Responsif

| Breakpoint | Nilai Min-Width | Penyesuaian Layout pada Landing Page |
| :--- | :--- | :--- |
| **Mobile (`default`)** | `< 640px` | 1 Kolom penuh, padding horizontal `px-6`, navigasi berpindah ke menu drawer, tombol CTA berlebar penuh (`w-full`), tabel/diagram diberi pembungkus `overflow-x-auto`. |
| **Tablet (`sm:`)** | `≥ 640px` | Grid 2 kolom untuk langkah dan berita, tombol CTA sejajar horizontal (`sm:w-auto sm:flex-row`). |
| **Desktop (`md:` & `lg:`)** | `≥ 768px` & `≥ 1024px` | Navbar desktop lengkap terlihat, grid 3 atau 4 kolom penuh, tata letak asimetris 7/5 aktif, padding horizontal `lg:px-12`. |
| **Ultra-wide (`max-w-[1440px]`)** | `1440px` | Konten dibatasi secara elegan di tengah layar (*auto-centering*). |

### 7.2 Standar Aksesibilitas (WCAG AA)
1. **Rasio Kontras Teks**:
   - Teks hitam/`ink` di atas `paper` (`#F4F6EF`): Rasio kontras 13.8:1 (Lolos AAA).
   - Teks putih di atas `green-deep` (`#0C3325`): Rasio kontras 14.2:1 (Lolos AAA).
   - Teks `green-deep` di atas `lime` (`#B7E35C`): Rasio kontras 9.5:1 (Lolos AAA).
   - Teks `lime` di atas `green-deep`: Rasio kontras 9.5:1 (Lolos AAA).
2. **Fokus Keyboard (*Focus Visible*)**:
   - Semua elemen tautan dan kontrol interaktif memiliki outline fokus yang terlihat jelas (`focus:outline-none focus:ring-1 focus:ring-lime` atau `focus:ring-green-forest`).
3. **Ukuran Target Sentuh Mobile**:
   - Semua tombol dan link interaktif pada mobile memiliki area klik minimal `44px × 44px`.
4. **Motion Preferences**:
   - Diatur pada `resources/css/app.css` dengan media query `@media (prefers-reduced-motion: reduce)` yang mematikan smooth-scrolling untuk kenyamanan pengguna dengan gangguan vestibular.

---

## 8. Panduan Nada & Bahasa Teks (*Tone of Voice & Content Style*)

1. **Gaya Penulisan B2B**:
   - Nada bicara harus lugas, percaya diri, profesional, berorientasi operasional, dan menghargai kepatuhan hukum (*regulatory compliance*).
2. **Kosa Kata Baku yang Direkomendasikan**:
   - Gunakan: `Limbah komersial`, `Pengangkutan terjadwal`, `Mitra bisnis`, `Material terpilah`, `Pelaporan ESG`, `Ekonomi sirkular`, `Pemulihan material (recovery)`.
   - Hindari: Istilah informal seperti "tukang sampah", "buang sampah", atau klaim berlebihan tanpa bukti audit seperti "100% bebas sampah seketika".
3. **CTA yang Spesifik**:
   - Selalu gunakan CTA berbasis tindakan bisnis konkret: `"Jadwalkan Konsultasi"`, `"Hubungi Tim Bisnis"`, `"Konsultasi via WhatsApp"`, `"Pelajari Layanan"`.

---

## 9. Ringkasan Checklist Kualitas Desain (*Quality Assurance*)

Sebelum merilis perubahan visual pada landing page, pastikan:

- [ ] Seluruh warna mematuhi token yang ditetapkan (`green-deep`, `green-forest`, `lime`, `paper`, `mint`, `ink`, `muted`).
- [ ] Tidak ada penggunaan border-radius bulat besar (`rounded-2xl` / `rounded-3xl`) pada kartu editorial.
- [ ] Semua font termuat dengan sempurna (DM Sans, Instrument Serif, DM Mono).
- [ ] Heading tidak kehilangan aksen miring Instrument Serif yang menjadi ciri khas identitas WellTrash.
- [ ] Skala gambar tidak melebihi 105% pada efek hover (`group-hover:scale-105`).
- [ ] Diagram teknis dan blueprint memiliki wadah scroll horizontal pada viewport seluler.
- [ ] Schema.org JSON-LD FAQ terstruktur tetap valid dan tidak mengalami syntax error.
- [ ] Widget WhatsApp mengambang tidak menutupi informasi teks penting pada layar ponsel.
- [ ] Tautan navigasi responsif dan menutup menu otomatis setelah diklik.
- [ ] Nilai data tonase sampah sinkron dengan data statistik resmi perusahaan.

