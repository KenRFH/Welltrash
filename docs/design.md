# WellTrash Design System

Dokumen ini menjadi acuan visual dan pengalaman pengguna untuk website WellTrash. Seluruh halaman baru sebaiknya mengikuti prinsip, token, dan pola komponen yang dijelaskan di sini.

## 1. Design Direction

### Brand positioning

WellTrash diposisikan sebagai partner pengelolaan sampah untuk bisnis, bukan sekadar jasa angkut sampah. Desain harus menyampaikan:

- Profesional dan dapat dipercaya
- Terukur dan berorientasi pada operasional
- Peduli lingkungan tanpa terlihat generik
- Modern, tenang, dan relevan untuk pengambil keputusan B2B
- Dekat dengan konteks lokal, tetapi memiliki standar korporat

### Visual concept

Konsep utama adalah **editorial corporate sustainability**.

Ciri-cirinya:

- Headline besar dengan hierarki yang kuat
- Grid yang terstruktur dan banyak ruang kosong
- Warna hijau gelap sebagai fondasi
- Warna lime hanya digunakan sebagai aksen penting
- Perpaduan sans-serif modern dan serif italic
- Fotografi operasional yang autentik
- Border tipis untuk memisahkan informasi
- Bentuk sederhana dan tidak terlalu dekoratif

### Hal yang harus dihindari

- Tampilan seperti marketplace konsumen
- Terlalu banyak kartu dengan sudut sangat bulat
- Gradient warna yang berlebihan
- Glassmorphism
- Bayangan besar pada semua elemen
- Penggunaan lime pada terlalu banyak area
- Ikon berwarna-warni yang tidak konsisten
- Klaim lingkungan yang tidak dapat diukur
- Foto stok yang terlalu artifisial

---

## 2. Color System

### Primary colors

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `brand-950` | `#08271B` | Footer dan area paling gelap |
| `brand-900` | `#0C3325` | Section gelap dan kartu unggulan |
| `brand-800` | `#103C2B` | Tombol utama gelap dan overlay |
| `brand-700` | `#17462F` | Ikon, link, dan teks interaktif |
| `brand-500` | `#4E792F` | Aksen teks hijau |

### Accent colors

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `accent-500` | `#B7E35C` | CTA, status aktif, dan highlight |
| `accent-300` | `#CBEA89` | Aksen headline pada latar gelap |

### Neutral colors

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `surface` | `#F4F6EF` | Latar halaman utama |
| `surface-muted` | `#DFE9CE` | Section pendukung |
| `surface-white` | `#FFFFFF` | Kartu dan area konten |
| `text-primary` | `#10271D` | Teks utama |
| `text-secondary` | `#5F756A` | Body dan deskripsi |
| `text-tertiary` | `#789083` | Metadata dan nomor |

### Color usage rules

- Gunakan `brand-900` atau `brand-950` untuk section yang perlu terasa premium.
- Gunakan `accent-500` hanya untuk CTA, status aktif, dan informasi penting.
- Body text pada latar terang menggunakan `text-secondary`.
- Body text pada latar gelap menggunakan putih dengan opacity sekitar 60–70%.
- Border menggunakan warna teks atau putih dengan opacity sekitar 10–20%.
- Jangan menggunakan lime sebagai warna body text panjang.

---

## 3. Typography

### Font families

#### DM Sans

Digunakan untuk:

- Heading utama
- Body text
- Navigasi
- Tombol
- Label
- Data dan statistik

#### Instrument Serif

Digunakan sebagai aksen editorial:

- Frasa penting dalam hero
- Kata kunci pada headline
- Kutipan besar

Gunakan dalam gaya italic. Jangan gunakan untuk body text atau seluruh headline.

#### DM Mono

Digunakan untuk:

- Nomor urutan
- Metadata teknis
- Label data
- Penanda tahapan

### Type scale

| Elemen | Ukuran desktop | Ukuran mobile | Karakter |
| --- | --- | --- | --- |
| Display hero | 88–120px | 48–64px | Medium, tracking rapat |
| Page title | 72–96px | 48–56px | Medium, tracking rapat |
| Section title | 56–76px | 40–48px | Medium |
| Card title | 20–28px | 20–24px | Semibold |
| Body large | 18px | 16–18px | Regular |
| Body | 16px | 14–16px | Regular |
| Small text | 12–14px | 12–14px | Regular atau medium |
| Eyebrow | 10–12px | 10–11px | Bold, uppercase |

### Typography rules

- Headline besar menggunakan line-height sekitar `0.9–1.05`.
- Heading memakai letter-spacing negatif.
- Body text menggunakan line-height sekitar `1.6–1.8`.
- Eyebrow menggunakan uppercase dan letter-spacing lebar.
- Maksimal panjang body text adalah sekitar 60–70 karakter per baris.
- Hindari penggunaan `font-black` kecuali untuk label kecil atau penekanan khusus.

---

## 4. Layout

### Container

- Lebar maksimum: `1440px`
- Padding desktop: `48px`
- Padding tablet dan mobile: `24px`

### Section spacing

| Ukuran layar | Padding vertikal |
| --- | --- |
| Desktop | 96–128px |
| Tablet | 80–96px |
| Mobile | 64–96px |

### Grid

- Gunakan grid 12 kolom sebagai acuan desktop.
- Section editorial umumnya menggunakan komposisi `7/5` atau `6/6`.
- Daftar layanan menggunakan 3 kolom.
- Tahapan proses menggunakan 4 kolom.
- Pada mobile, seluruh grid berubah menjadi 1 kolom.
- Pada tablet, grid 3 atau 4 kolom dapat berubah menjadi 2 kolom.

### Borders

Border merupakan elemen visual utama untuk membentuk struktur:

- Ketebalan: `1px`
- Warna terang: hijau gelap dengan opacity 10–15%
- Warna gelap: putih dengan opacity 10–20%
- Gunakan border sebagai pemisah sebelum menggunakan shadow.

---

## 5. Spacing

Gunakan skala spacing yang konsisten:

| Token | Nilai |
| --- | --- |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |
| `space-32` | 128px |

Aturan:

- Jarak heading ke body: 20–32px.
- Jarak eyebrow ke heading: 20–28px.
- Jarak antar-section: minimal 80px.
- Padding kartu: 28–40px.
- Jarak antar-item list: 16–24px.

---

## 6. Shape and Radius

Desain WellTrash menggunakan bentuk yang tegas dan minim dekorasi.

### Radius

| Komponen | Radius |
| --- | --- |
| CTA berbentuk pill | 999px |
| Ikon lingkaran | 999px |
| Tombol kecil | 999px atau 12px |
| Kartu konten | 0–4px |
| Media editorial | 0–4px |
| Kontrol segmented | 999px |

Gunakan kartu kotak untuk section editorial. Radius besar hanya digunakan untuk CTA dan kontrol interaktif.

---

## 7. Iconography

### Gaya ikon

- Outline icon
- Stroke sekitar `1.5–2px`
- Sudut garis membulat
- Ukuran standar 20–24px
- Ukuran ikon fitur 24–28px
- Gunakan satu warna

### Penggunaan

- Ikon selalu mendukung informasi, bukan sekadar dekorasi.
- Ikon fitur dapat ditempatkan dalam lingkaran hijau muda.
- Ikon pada area gelap dapat menggunakan warna lime.
- Hindari penggunaan emoji.

---

## 8. Photography

### Arah fotografi

Gunakan foto yang menunjukkan:

- Tim operasional asli
- Armada pengangkutan
- Fasilitas pemilahan
- Aktivitas edukasi
- Kolaborasi dengan mitra
- Material dan proses recovery

### Treatment

- Hero memakai overlay hijau gelap.
- Foto tim dapat menggunakan grayscale dan berubah berwarna saat hover.
- Foto jurnal memakai rasio lanskap.
- Foto anggota tim memakai rasio potret `4:5`.
- Pastikan subjek utama tidak terpotong.
- Alt text harus menjelaskan isi dan fungsi gambar.

### Hindari

- Foto alam yang tidak berhubungan dengan operasional
- Ilustrasi daun generik
- Foto sampah ekstrem sebagai visual utama
- Foto yang terlalu staged
- Foto dengan watermark

---

## 9. Shared Components

### Navbar

Navbar memiliki dua variasi:

#### Transparent navbar

Digunakan pada hero dengan background foto atau warna gelap.

- Logo dan teks putih
- Border bawah putih transparan
- Item aktif menggunakan lime

#### Solid navbar

Digunakan pada halaman internal.

- Background `surface`
- Teks hijau gelap
- Dapat menggunakan efek backdrop blur
- Item aktif menggunakan `brand-700`

#### Mobile navigation

- Navigasi berubah menjadi tombol menu.
- Menu terbuka pada panel hijau gelap.
- Seluruh target sentuh minimal 44px.
- Menu harus tertutup setelah halaman dipilih.

### Buttons

#### Primary lime

- Background `accent-500`
- Teks `brand-800`
- Digunakan pada background gelap

#### Primary dark

- Background `brand-800`
- Teks putih
- Digunakan pada background terang atau lime

#### Secondary outline

- Background transparan
- Border menyesuaikan warna area
- Tidak digunakan untuk aksi paling penting

#### Interaction

- Transisi 200–300ms
- Arrow bergeser sedikit ke kanan ketika hover
- Warna background berubah secara halus
- Hindari efek scale yang berlebihan

### Eyebrow

Digunakan untuk memberi konteks sebelum heading:

- Uppercase
- Bold
- Tracking lebar
- Memiliki garis horizontal pendek di kiri

Contoh:

```text
— SOLUSI KAMI
```

### Feature cards

- Gunakan border, bukan shadow.
- Ikon ditempatkan di bagian atas.
- Judul berada dekat bagian bawah untuk kartu tinggi.
- Deskripsi maksimal 2–4 baris.
- Hover dapat mengubah background atau warna ikon.

### CTA section

- Background lime.
- Headline besar dan singkat.
- Satu tombol utama berwarna hijau gelap.
- Jangan menambahkan banyak aksi sekunder.

### Footer

- Background `brand-950`.
- Teks utama putih.
- Teks pendukung putih transparan.
- Memiliki tiga area:
  - Deskripsi brand
  - Navigasi
  - Kontak
- Copyright dipisahkan dengan border tipis.

---

## 10. Page-specific Direction

### Beranda

Tujuan utama:

- Menjelaskan positioning B2B
- Membangun kepercayaan
- Mengarahkan pengguna ke halaman layanan

Karakter:

- Hero foto penuh
- Headline sangat besar
- Statistik operasional
- Ringkasan layanan
- Section dampak berwarna gelap
- CTA konsultasi

Urutan konten:

1. Navbar transparan
2. Hero
3. Trust bar atau statistik
4. Ringkasan solusi
5. Dampak dan pelaporan
6. CTA
7. Footer

### Tentang

Tujuan utama:

- Menjelaskan visi perusahaan
- Membangun kedekatan dan kredibilitas
- Memperlihatkan manusia di balik layanan

Karakter:

- Editorial
- Headline dominan
- Foto lebar
- Banyak ruang kosong
- Visi dan misi sebagai konten utama
- Foto tim dengan treatment konsisten

Urutan konten:

1. Navbar solid
2. Editorial page title
3. Foto tim atau operasional
4. Cerita perusahaan
5. Nilai perusahaan
6. Visi dan misi
7. Tim
8. CTA
9. Footer

### Aktivitas

Tujuan utama:

- Mendokumentasikan kegiatan
- Menunjukkan bukti aktivitas
- Menyampaikan pengetahuan dan dampak

Karakter:

- Seperti jurnal atau publikasi
- Setiap artikel memiliki foto besar
- Layout baris berselang-seling
- Metadata terlihat jelas
- Hover sederhana pada foto dan arrow

Setiap item harus memiliki:

- Kategori
- Tanggal
- Judul
- Ringkasan
- Gambar
- Link menuju detail

### Layanan

Tujuan utama:

- Membantu pengguna memahami pilihan layanan
- Mempermudah perbandingan
- Mengarahkan pengguna ke konsultasi atau WhatsApp

Karakter:

- Lebih fungsional dan conversion-oriented
- Hero berwarna hijau gelap
- Kontrol segmented untuk tipe layanan
- Maksimal tiga paket utama dalam satu baris
- Satu paket dapat ditandai sebagai rekomendasi

Informasi minimal paket:

- Nama
- Target pengguna
- Harga atau status custom
- Frekuensi pengangkutan
- Kapasitas
- Fitur
- CTA

Harga harus selalu disertai keterangan bahwa nilai akhir dapat berubah berdasarkan hasil asesmen.

---

## 11. Responsive Behavior

### Desktop

- Container maksimal 1440px.
- Gunakan komposisi asimetris untuk tampilan editorial.
- Headline dapat mengambil 60–75% lebar layar.
- Navbar menampilkan semua item.

### Tablet

- Grid 4 kolom menjadi 2 kolom.
- Grid 3 kolom dapat menjadi 2 kolom.
- Ukuran display dikurangi agar tidak memotong viewport.
- Section dua kolom tetap dapat dipertahankan jika konten cukup pendek.

### Mobile

- Semua grid utama menjadi satu kolom.
- Padding horizontal 24px.
- Navbar menggunakan menu hamburger.
- CTA dapat menggunakan lebar penuh.
- Statistik dapat menjadi grid dua kolom atau horizontal scroll.
- Hindari teks rata tengah kecuali hero atau CTA tertentu.
- Media diletakkan sebelum konten jika visual membantu konteks.
- Tombol dan kontrol memiliki tinggi minimal 44px.

---

## 12. Motion

Motion harus terasa tenang dan fungsional.

### Durasi

- Hover: 200–300ms
- Image zoom: 500–700ms
- Menu mobile: 200–300ms
- Smooth scroll dapat digunakan untuk navigasi dalam halaman

### Pola

- Arrow bergeser 4px saat hover.
- Foto dapat melakukan zoom hingga maksimal 105%.
- Warna ikon atau background dapat berubah saat hover.
- Jangan menggunakan animasi bounce.
- Hormati preferensi `prefers-reduced-motion`.

---

## 13. Content Guidelines

### Tone of voice

- Profesional
- Ringkas
- Meyakinkan
- Transparan
- Berorientasi pada manfaat bisnis
- Tidak terlalu teknis

### Terminologi utama

Gunakan secara konsisten:

- Pengelolaan sampah
- Pengangkutan
- Mitra bisnis
- Operasional
- Material terpilah
- Pemulihan material
- Dampak terukur
- Pelaporan ESG
- Ekonomi sirkular

### CTA

CTA utama yang disarankan:

- Jadwalkan Konsultasi
- Konsultasi Gratis
- Hubungi Tim Bisnis
- Lihat Layanan
- Pilih Paket
- Minta Estimasi

Hindari CTA yang tidak spesifik seperti “Klik di sini”.

### Claims

- Gunakan angka hanya jika sumber datanya tersedia.
- Bedakan data aktual, estimasi, dan potensi.
- Hindari istilah “zero waste” jika belum dapat dibuktikan.
- Sertakan konteks pada persentase dampak.

---

## 14. Accessibility

- Semua gambar memiliki alt text.
- Kontras teks dan background minimal memenuhi WCAG AA.
- Status aktif tidak hanya dibedakan melalui warna.
- Semua tombol memiliki label yang jelas.
- Tombol ikon harus memiliki `aria-label`.
- Navigasi dapat digunakan dengan keyboard.
- Focus state tidak boleh dihilangkan tanpa pengganti.
- Gunakan elemen heading secara berurutan.
- Area klik minimal 44 × 44px pada mobile.
- Informasi tidak boleh hanya disampaikan melalui ikon.

---

## 15. Implementation Notes

### Current stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4

### Font loading

Font diimpor melalui `src/index.css`:

- DM Sans
- Instrument Serif
- DM Mono

### Existing shared patterns

Implementasi saat ini memiliki:

- `Navbar`
- `Footer`
- `CTA`
- `Icon`
- `PageLink`
- Halaman Beranda
- Halaman Tentang
- Halaman Aktivitas
- Halaman Layanan

### Routing

Demo saat ini menggunakan hash routing:

| Halaman | URL |
| --- | --- |
| Beranda | `#/` |
| Tentang | `#/about` |
| Aktivitas | `#/activities` |
| Layanan | `#/services` |

Jika dipindahkan ke Laravel dan Inertia, pertahankan struktur halaman serta komponen visual, tetapi gunakan routing dan komponen `Link` dari Inertia.

---

## 16. Design Review Checklist

Sebelum halaman dianggap selesai, periksa:

- [ ] Halaman memiliki satu tujuan utama yang jelas.
- [ ] CTA utama mudah ditemukan.
- [ ] Warna lime tidak digunakan berlebihan.
- [ ] Heading memiliki hierarki yang jelas.
- [ ] Body text tidak terlalu lebar.
- [ ] Semua gambar relevan dan memiliki alt text.
- [ ] Border digunakan secara konsisten.
- [ ] Tampilan mobile tidak hanya berupa desktop yang diperkecil.
- [ ] Semua kontrol memiliki hover, focus, dan active state.
- [ ] Tidak ada klaim dampak tanpa konteks.
- [ ] Navbar dan footer konsisten.
- [ ] Halaman dapat digunakan dengan keyboard.
- [ ] Kontras teks memenuhi standar aksesibilitas.
- [ ] Build berhasil tanpa error.
