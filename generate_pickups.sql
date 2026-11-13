-- Generate jadwal pickup 30 hari ke depan (hari ini WIB s/d +30) untuk semua mitra aktif,
-- sesuai hari di pickup_schedule. Sama dengan `php artisan pickups:generate`.
-- Aman dijalankan ulang: tanggal yang sudah punya pickup untuk mitra tsb dilewati.

INSERT INTO `pickups` (`company_id`, `pickup_date`, `status`, `created_at`, `updated_at`)
SELECT c.id, d.dt, 'scheduled', NOW(), NOW()
FROM `companies` c
JOIN (
    SELECT DATE(CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '+07:00')) + INTERVAL (a.n + b.n * 10) DAY AS dt
    FROM (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
    CROSS JOIN (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) b
    WHERE a.n + b.n * 10 <= 30
) d
WHERE c.subscription_status = 'active'
  AND JSON_CONTAINS(c.pickup_schedule,
        JSON_QUOTE(ELT(DAYOFWEEK(d.dt), 'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')))
  AND NOT EXISTS (
        SELECT 1 FROM `pickups` p WHERE p.company_id = c.id AND p.pickup_date = d.dt
  );
