# PRD: WellTrash Finance (WT-Finance Standalone)

<!-- ponytail: Standalone web architecture using pure Laravel 12 + Blade + Tailwind; single database per deployment ceiling ~50k tx/mo. Upgrade to multi-tenant or ERP sync when revenue > Rp 500jt/mo. -->

## 1. Executive Summary
- **Produk:** WT-Finance (Sistem Internal Keuangan & Manajemen Dividen Standalone)
- **Konteks:** Migrasi dari spreadsheet operasional 92 kolom (`LK WELLTRASH SEP 2026.xlsx`) ke web app mandiri.
- **Tujuan:** Menghilangkan redundansi pencatatan, mengotomatisasi kalkulasi laba bersih & bagi hasil (92.5% dividen, 5% CSR, 2.5% zakat), mengunci periode buku (*period lock*), dan mengisolasi akses Cap Table pemegang saham.

---

## 2. Aktor & Matriks Hak Akses (RBAC)

| Role | Akses Transaksi (Kas & Divisi) | Akses Cap Table & Dividen | Tutup Buku Bulanan | Ekspor & Laporan |
|---|---|---|---|---|
| **Superadmin (Founder/Direksi)** | Full (CRUD) | Full (CRUD semua investor) | Ya | Full (PDF & XLSX) |
| **Finance Admin (Staf Kasir/Akuntansi)** | Full (CRUD pada periode open) | Read-only (tanpa detail privat) | Tidak | Laporan Kas & Laba Rugi |
| **Division Operator (PIC MDU/BSF/Armada)** | Create/Read divisi terkait | Tidak ada | Tidak | Slip Timbangan/Ritase |
| **Shareholder (Investor)** | Tidak ada | Read-only profil & dividen pribadi | Tidak | Slip Dividen Pribadi (PDF) |

---

## 3. Spesifikasi Modul Operasional (Berdasarkan Excel Riil)

### 3.1 Modul Pengeluaran (Expense Journal)
Mendukung 11 pos OPEX dan 2 pos CAPEX dengan input harian terpadu:
- **OPEX:**
  1. `listrik`: PLN gudang, kantor, fasilitas biokonversi.
  2. `air`: Air minum galon & utilitas cuci.
  3. `service`: Perawatan unit (R2/R3 Viar, Carry, GranMax).
  4. `bbm`: Konsumsi harian per armada (Viar, Hijet, GranMax, Ignis).
  5. `oli`: Penggantian oli berkala mesin & armada.
  6. `atk`: Kertas nota, printer, lakban, perlengkapan kantor.
  7. `sapronak`: Sarana produksi ternak (unggas & larva).
  8. `retribusi`: Iuran resmi (RPT & TPA sampah).
  9. `entertain`: Konsumsi lembur kru & makan bersama mitra/tamu.
  10. `gaji`: THP Manajemen & Operator harian/mingguan.
  11. `sewa`: Sewa unit armada tambahan (e.g., GranMax) & gudang.
- **CAPEX:**
  12. `tool_kit`: Pengadaan alat kerja (e.g., jet cleaner, MCB, meteran).
  13. `sparepart`: Penggantian suku cadang utama armada/pabrik.

### 3.2 Modul Pemasukan (Revenue Stream 8 Divisi)
1. **DIV. CLEAN UP (Layanan B2B Sampah):**
   - Atribut: Nama faskes/mitra (Puskesmas, RS Siloam, RS dr. Soebandi, SPPG), status cek, kode SP/PG, nominal.
2. **DIV. LARVA (Biokonversi BSF):**
   - Atribut: FM (Fresh Maggot) Jual/Beli (kg), Pre-pupae (kg), Telur BSF (gram), Kasgot (Rp), harga satuan, subtotal.
3. **DIV. UNGGAS:**
   - Atribut: Populasi panen jantan/betina (ekor), tarif per ekor, subtotal.
4. **DIV. MDU (Material Daur Ulang - 15 Kategori):**
   - Kategori: Kardus, Duplex, Foil, Kaleng, PET (Bening, BM, Warna), PP Gelas (Bening, Sablon, Tutup), Tembok, Emberan, Tepak, Putihan, Omplong.
   - Atribut: Pembeli/pengepul (e.g., CV Alam Jaya, CV Dluwang), berat (kg), harga/kg, kelompok batch (`MDU00`, `MDU01`, `MDU02`).
5. **DIV. RETURN PRODUK:**
   - Atribut: Return (kg), SOD (kg), harga, nominal.
6. **BIOPOND (CAPEX Production Asset):**
   - Atribut: Ukuran bak (S, B, K pcs), harga unit, nominal.
7. **DIV. SUFOR / BUBUR (Pakan Olahan Ternak):**
   - Atribut: Buyer (e.g., Ade Sda, Romdoni Jbr), Putih (kg), Mix (kg), Bubur (kg), harga/kg, handling ongkir, total transfer.
8. **DIV. MIJEL (Minyak Jelantah):**
   - Atribut: Mijel Jerigen (kg), Mijel Botol (kg), harga beli/jual, margin nominal.

---
## 4. Financial Calculation Engine

### 4.1 Logika Perhitungan Real-Time
1. Total Revenue = SUM(Revenue Divisi 1 s/d 8)
2. Total OPEX = SUM(Pengeluaran Pos 1 s/d 11)
3. Total CAPEX = SUM(Pengeluaran Pos 12 s/d 13)
4. Laba Bersih Operasional = Total Revenue - Total OPEX
5. Alokasi Hasil Usaha (Dividen) = 92.5% * Laba Bersih
6. Alokasi CSR = 5.0% * Laba Bersih
7. Alokasi Zakat Perusahaan = 2.5% * Laba Bersih

### 4.2 Cap Table & Distribusi Dividen (Baseline 20 Entitas)
- **Total Saham Dasar:** 1.342 s/d 1.375 lembar.
- **Formula Hak Investor:**
  Dividen Individu = (Lembar Saham Investor / Total Lembar Saham Aktif) * Alokasi Hasil Usaha (92.5%)
- **Daftar Pemegang Saham Terdata:**
  1. Agus Sholehul Huda (2 lbr)
  2. Bambang Hermanto (10 lbr)
  3. Dian Puspita Ningtyas (1 lbr)
  4. Dwi Endah Kurniawati (10 lbr)
  5. Haikal Alizan Syah (10 lbr)
  6. Khaliesya Sakinah (40 lbr)
  7. Mashudi (107 lbr)
  8. Purwadji Basudarmo (10 lbr)
  9. Totok Sudarto (2 lbr)
  10. Achmadi Kholison / Mashudi (1 lbr)
  11. Rizal Abdillah / Mashudi (1 lbr)
  12. Moch. Salim (4 lbr)
  13. Siti Mubarokah (4 lbr)
  14. Desy Wulandari (1 lbr)
  15. Anne Girah Purwati (1 lbr)
  16. Slamet Harianto (1 lbr)
  17. Anton Prabowo / Mashudi (2 lbr)
  18. Imro'atul Khasanah / Mashudi (10 lbr)
  19. Chandra Kelana (96 lbr)
  20. Republik Larva / Mashudi (1.029 lbr)
  *(+ Bridge Investment Mashudi 33 lembar)*

---

## 5. Skema Basis Data Relasional

```sql
-- 1. Periode Pencatatan Bulanan
CREATE TABLE finance_periods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    period_code VARCHAR(7) NOT NULL UNIQUE, -- e.g. '2026-09'
    month TINYINT UNSIGNED NOT NULL,
    year SMALLINT UNSIGNED NOT NULL,
    status ENUM('draft', 'active', 'closed') DEFAULT 'active',
    share_dividend_pct DECIMAL(5,2) DEFAULT 92.50,
    share_csr_pct DECIMAL(5,2) DEFAULT 5.00,
    share_zakat_pct DECIMAL(5,2) DEFAULT 2.50,
    closed_at TIMESTAMP NULL,
    closed_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 2. Transaksi Kas & Jurnal Divisi
CREATE TABLE finance_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT UNSIGNED NOT NULL,
    transaction_date DATE NOT NULL,
    type ENUM('expense', 'revenue') NOT NULL,
    category_group ENUM('opex', 'capex', 'clean_up', 'larva', 'unggas', 'mdu', 'return_produk', 'biopond', 'sufor', 'mijel') NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    qty DECIMAL(12,2) NULL,
    unit VARCHAR(20) NULL,
    unit_price DECIMAL(15,2) NULL,
    amount DECIMAL(15,2) NOT NULL,
    receipt_path VARCHAR(255) NULL,
    metadata JSON NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (period_id) REFERENCES finance_periods(id) ON DELETE RESTRICT
);

-- 3. Master Pemegang Saham (Cap Table)
CREATE TABLE finance_shareholders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    shares_count INT UNSIGNED NOT NULL DEFAULT 1,
    share_type ENUM('founder', 'investor', 'bridge') DEFAULT 'investor',
    bank_name VARCHAR(50) NULL,
    bank_account_number VARCHAR(50) NULL,
    bank_account_holder VARCHAR(150) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- 4. Distribusi Dividen Per Periode
CREATE TABLE finance_dividends (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT UNSIGNED NOT NULL,
    shareholder_id BIGINT UNSIGNED NOT NULL,
    shares_count INT UNSIGNED NOT NULL,
    ownership_percentage DECIMAL(7,4) NOT NULL,
    dividend_amount DECIMAL(15,2) NOT NULL,
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    transfer_proof_path VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY uq_period_shareholder (period_id, shareholder_id),
    FOREIGN KEY (period_id) REFERENCES finance_periods(id) ON DELETE CASCADE,
    FOREIGN KEY (shareholder_id) REFERENCES finance_shareholders(id) ON DELETE RESTRICT
);
```

---

## 6. Antarmuka Pengguna & Fitur Aplikasi Standalone

1. **Dashboard Eksekutif (`/dashboard`):**
   - Kartu Metrik: Omzet Bulan Ini, Beban OPEX, Laba Bersih, Estimasi Dividen Beredar.
   - Grafik Komparasi MoM & Komposisi Beban Operasional.
2. **Jurnal Kas Harian (`/transactions`):**
   - Filter cepat berdasarkan tanggal, tipe (Expense/Revenue), dan Divisi.
   - Form modal entri cepat: Otomatis menghitung `Qty x Harga = Total`.
   - Upload foto nota bukti kas.
3. **Rekapitulasi Laba Rugi (`/reports/pnl`):**
   - Tampilan setara format cetak resmi: Pendapatan vs Beban per pos akun.
   - Breakdown Benefit: Dividen (92.5%), CSR (5.0%), Zakat (2.5%).
4. **Cap Table & Bagi Hasil (`/shareholders`):**
   - Pengaturan lembar saham, persentase hak bagi hasil, dan kalkulasi otomatis per periode.
   - Ekspor rekapitulasi transfer dividen ke format bank.
5. **Portal Investor Mandiri (`/investor/portal`):**
   - Tampilan bersih untuk login investor: lembar saham pribadi, histori pembagian dividen tiap bulan, status pembayaran, dan unduh slip dividen PDF resmi.
6. **Cetak PDF Resmi (`/reports/export-pdf`):**
   - Format standar laporan keuangan bulanan terbitan direksi WellTrash.

---

## 7. Tech Stack & Infrastructure (Pure Laravel Monolith)

- **Backend & Core:** Laravel 12 (PHP 8.2+), Eloquent ORM, Session Auth & CSRF Protection bawaan Laravel.
- **Frontend & Rendering:** Laravel Blade Templates + Tailwind CSS (Boring & robust server-rendered HTML. Menggunakan Blade Components dan native HTML5 form, Alpine.js / Vanilla JS untuk kalkulasi realtime modal tanpa build step TypeScript/React yang kompleks).
- **Database:** SQLite (lingkungan pengembangan lokal) / MySQL atau MariaDB (produksi).
- **PDF Engine:** `barryvdh/laravel-dompdf` (tanpa dependensi chromium eksternal yang berat).
- **Icons:** Inline SVG / Heroicons Blade (tanpa dependensi paket react).

---

## 8. Milestone Pelaksanaan

1. **Sprint 1 (Database & Auth):** Inisialisasi basis data, seeder 20 pemegang saham, dan RBAC middleware.
2. **Sprint 2 (Daily Journal & 8 Divisions):** Input harian OPEX/CAPEX dan omzet 8 divisi.
3. **Sprint 3 (PnL Engine & Dividends):** Rekapitulasi otomatis, alokasi 92.5%/5%/2.5%, dan period lock.
4. **Sprint 4 (Investor Portal & PDF Export):** Dasbor pribadi investor, cetak slip PDF, dan verifikasi UAT data September 2026.

