# Rencana Pengembangan Aplikasi Mobile CleanUP Operator (Flutter Android APK)

Dokumen ini adalah panduan teknis implementasi aplikasi mobile Android mandiri (Flutter) untuk aktor **CleanUP (Operator Lapangan)** yang terhubung ke backend Laravel Welltrash melalui REST API.

---

## 1. Arsitektur & Lingkungan

- **Target OS:** Android 7.0+ (Min SDK 24, Target SDK 34)
- **Framework:** Flutter (Dart 3.x)
- **Backend API:** Laravel 12 + Laravel Sanctum
- **Base URL:**
  - Emulator Android: `http://10.0.2.2:8000/api` (atau port MAMP sesuai konfigurasi: `http://10.0.2.2:8888/api`)
  - HP Fisik (WiFi sama): `http://<IP_LAPTOP>:8000/api`
  - Production: `https://welltrash.domain.com/api`

---

## 2. Inisialisasi Proyek di Folder Terpisah

Jalankan perintah berikut di folder luar workspace ini:

```bash
flutter create --org com.welltrash --project-name welltrash_operator welltrash_operator
cd welltrash_operator
flutter pub add http shared_preferences image_picker geolocator intl
```

### Konfigurasi Android (`android/app/src/main/AndroidManifest.xml`)

Tambahkan izin berikut sebelum tag `<application>`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.CAMERA"/>

    <application
        android:label="Welltrash Operator"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">
        <!-- ... -->
    </application>
</manifest>
```

---

## 3. Struktur Folder Flutter yang Direkomendasikan

```
lib/
├── config/
│   └── api_constants.dart       # Base URL & route path constants
├── models/
│   ├── user.dart
│   ├── pickup.dart
│   ├── company.dart
│   └── attendance.dart
├── services/
│   ├── api_client.dart          # HTTP client (Bearer token injection)
│   ├── auth_service.dart        # Login, logout, persistent token
│   ├── pickup_service.dart      # Fetch jadwal, update status, submit bukti
│   └── attendance_service.dart  # Clock in/out, lembur, izin
├── screens/
│   ├── auth/login_screen.dart
│   ├── home/dashboard_screen.dart
│   ├── pickup/pickup_detail_screen.dart
│   ├── attendance/attendance_screen.dart
│   └── activity/activity_screen.dart
└── main.dart
```

---

## 4. Spesifikasi Kontrak REST API

Semua request yang membutuhkan autentikasi wajib menyertakan header:
```
Authorization: Bearer <SANCTUM_TOKEN>
Accept: application/json
```

### A. Autentikasi

#### 1. Login Operator
- **Endpoint:** `POST /operator/login`
- **Body (JSON):**
  ```json
  {
    "email": "operator@welltrash.test",
    "password": "password123",
    "device_name": "android-redmi"
  }
  ```
- **Response Sukses (200):**
  ```json
  {
    "success": true,
    "message": "Login berhasil.",
    "token": "1|abcdef123456...",
    "user": {
      "id": 1,
      "name": "Operator CleanUP",
      "email": "operator@welltrash.test",
      "role": "CleanUP",
      "daily_salary": 67692
    }
  }
  ```

#### 2. Profil Sesi & Logout
- `GET /operator/me` → Info operator aktif.
- `POST /operator/logout` → Menghapus token saat ini.

---

### B. Penjemputan Sampah (Pickups)

#### 1. Jadwal Hari Ini
- **Endpoint:** `GET /operator/pickups?date=YYYY-MM-DD`
- **Response (200):**
  ```json
  {
    "success": true,
    "date": "2026-10-26",
    "is_today": true,
    "pickups": [
      {
        "id": 12,
        "company_id": 3,
        "pickup_date": "2026-10-26",
        "status": "scheduled",
        "company": {
          "id": 3,
          "company_name": "PT Resto Nusantara",
          "pic_name": "Bambang",
          "phone": "08123456789",
          "address": "Jl. Kaliurang KM 5"
        }
      }
    ]
  }
  ```

#### 2. Update Status Perjalanan / Pembatalan
- **Endpoint:** `PUT /operator/pickups/{id}/status`
- **Body (JSON):**
  ```json
  {
    "status": "on_the_way" // Opsi: on_the_way | failed
  }
  ```
  *(Jika status `failed`, wajib menyertakan `"cancellation_reason": "Toko tutup"`)*

#### 3. Submit Penyelesaian Pengambilan (Upload Bukti)
- **Endpoint:** `POST /operator/pickups/{id}/submit`
- **Format:** `multipart/form-data`
- **Fields:**
  - `trash_bag_count`: Integer (opsional jika berat diisi)
  - `organic_weight`: Decimal/Float (kg)
  - `anorganic_weight`: Decimal/Float (kg)
  - `residue_weight`: Decimal/Float (kg)
  - `evidence_pickup_path`: File Foto (Wajib, Max 5MB)
  - `offline_recorded_at`: String ISO-8601 (opsional, untuk toleransi grace period offline s/d 48 jam)

---

### C. Presensi & Gaji (Attendance)

#### 1. Status Hari Ini
- **Endpoint:** `GET /operator/attendance/status`
- **Response (200):**
  ```json
  {
    "success": true,
    "date": "2026-10-26",
    "attendance": {
      "id": 5,
      "date": "2026-10-26",
      "clock_in_at": "2026-10-26 08:02:11",
      "clock_out_at": null,
      "status": "incomplete"
    },
    "todayApprovedOvertime": false
  }
  ```

#### 2. Clock In & Clock Out
- **Clock In:** `POST /operator/attendance/clock-in` (`multipart/form-data` dengan field `lat`, `lng`, `photo`)
- **Clock Out:** `POST /operator/attendance/clock-out` (`lat`, `lng`, `photo`)

#### 3. Rekap Bulanan & Estimasi Gaji
- **Endpoint:** `GET /operator/attendance/summary?month=YYYY-MM`
- Memberikan total jam kerja, jumlah hari memenuhi syarat (`>= 8 jam`), dan estimasi gaji pokok + lembur.

---

### D. Lembur, Izin, & Dokumentasi Aktivitas

1. **Permohonan Lembur:** `POST /operator/attendance/overtime/request` (`date`, `reason`)
2. **Absen Masuk Lembur:** `POST /operator/attendance/overtime/clock-in` (hanya bisa jika request lembur disetujui admin)
3. **Absen Pulang Lembur:** `POST /operator/attendance/overtime/clock-out`
4. **Pengajuan Izin/Sakit:** `POST /operator/leave-request` (`date`, `type`: `izin|sakit`, `reason`, `proof_image`)
5. **Dokumentasi Olah Sampah:**
   - List Mitra Aktif: `GET /operator/companies`
   - Upload Kegiatan: `POST /operator/activities` (`company_id`, `activity_date`, `note`, `media` foto/video)

---

## 5. Strategi Offline Sync & Toleransi 48 Jam

Di lapangan, operator sering menghadapi kendala sinyal ketika mengambil sampah di basement atau area minim jaringan.

1. **Penyimpanan Antrean Lokal:**
   - Gunakan `shared_preferences` (menyimpan JSON array antrean) atau SQLite (`sqflite`).
   - Simpan: `pickup_id`, berat sampah, path foto lokal perangkat, dan timestamp `offline_recorded_at` saat tombol "Simpan" ditekan di lapangan.

2. **Sinkronisasi Otomatis:**
   - Saat aplikasi mendeteksi koneksi internet kembali aktif, jalankan background upload satu per satu.
   - Kirimkan field `offline_recorded_at: "YYYY-MM-DDTHH:mm:ss"`.
   - Backend memvalidasi `offline_recorded_at` dengan toleransi maksimal 48 jam (`now()->subHours(48)`).

---

## 6. Alur Layar Aplikasi (Screen Flow)

1. **Splash / Auth Check:**
   - Cek apakah token tersimpan di `SharedPreferences`. Jika ada, panggil `GET /operator/me`.
   - Token valid → Langsung buka Dashboard; jika kadaluarsa → Login Screen.

2. **Dashboard / Jadwal Penjemputan:**
   - Menampilkan tanggal hari ini dan daftar kartu penjemputan.
   - Status badge: `scheduled` (Abu/Biru), `on_the_way` (Kuning), `completed` (Hijau), `failed` (Merah).
   - Aksi cepat: Tombol panggil/WhatsApp ke nomor PIC mitra, tombol buka Google Maps ke alamat mitra.

3. **Layar Penyelesaian Penjemputan (Form Submit):**
   - Buka kamera bawaan via `image_picker` (ImageSource.camera).
   - Preview foto bukti timbangan / trash bag.
   - Input berat sampah (Organik, Anorganik, Residuo) atau jumlah trash bag.
   - Tombol "Selesaikan Penjemputan" (kirim ke API / simpan ke antrean offline jika no-internet).

4. **Layar Presensi & GPS:**
   - Ambil koordinat GPS via `geolocator.getCurrentPosition()`.
   - Ambil swafoto / foto tempat kerja.
   - Tombol Clock In / Clock Out yang otomatis nonaktif jika sudah presensi.

5. **Layar Riwayat & Rekap Gaji:**
   - Menampilkan total hari kerja bulan ini & estimasi penerimaan gaji operator.

---

## 7. Langkah Build & Release APK

Setelah selesai koding di folder terpisah, bangun APK release mandiri:

1. **Buat Keystore Android (opsional untuk release publik):**
   ```bash
   keytool -genkey -v -keystore android/app/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```

2. **Build APK Release:**
   ```bash
   flutter build apk --release
   ```
   File APK output akan berada di:
   `build/app/outputs/flutter-apk/app-release.apk`

3. **Instal Langsung ke Device Android Pengujian:**
   ```bash
   flutter install
   # Atau via adb:
   adb install build/app/outputs/flutter-apk/app-release.apk
   ```

