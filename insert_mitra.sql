-- Insert 34 akun mitra (users + companies). Aman dijalankan ulang (skip yang sudah ada).
-- Password semua akun: 12345678
START TRANSACTION;

-- SPPG Trisnogambar
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Trisnogambar','sppgtrisnogambar@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Trisnogambar','SPPG Trisnogambar','tes','-','SPPG','Premium+','documents/mous/mou_sppgtrisnogambar.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgtrisnogambar@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Rambipuji
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Rambipuji','sppgrambipuji@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Rambipuji','SPPG Rambipuji','tes','-','SPPG','Premium+','documents/mous/mou_sppgrambipuji.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgrambipuji@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Kaliwates 1
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Kaliwates 1','sppgkaliwates1@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Kaliwates 1','SPPG Kaliwates 1','tes','-','SPPG','Premium+','documents/mous/mou_sppgkaliwates1.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgkaliwates1@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Kreongan
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Kreongan','sppgkreongan@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Kreongan','SPPG Kreongan','tes','-','SPPG','Premium+','documents/mous/mou_sppgkreongan.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgkreongan@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Baratan 1
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Baratan 1','sppgbaratan1@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Baratan 1','SPPG Baratan 1','tes','-','SPPG','Premium+','documents/mous/mou_sppgbaratan1.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgbaratan1@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Manggisan 2
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Manggisan 2','sppgmanggisan2@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Manggisan 2','SPPG Manggisan 2','tes','-','SPPG','Premium+','documents/mous/mou_sppgmanggisan2.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgmanggisan2@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Tanggul Wetan 1
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Tanggul Wetan 1','sppgtanggulwetan1@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Tanggul Wetan 1','SPPG Tanggul Wetan 1','tes','-','SPPG','Premium+','documents/mous/mou_sppgtanggulwetan1.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgtanggulwetan1@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Tanggul Wetan 2
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Tanggul Wetan 2','sppgtanggulwetan2@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Tanggul Wetan 2','SPPG Tanggul Wetan 2','tes','-','SPPG','Premium+','documents/mous/mou_sppgtanggulwetan2.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgtanggulwetan2@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Sumbersari 1 Sumatra
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Sumbersari 1 Sumatra','sppgsumbersari1sumatra@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Sumbersari 1 Sumatra','SPPG Sumbersari 1 Sumatra','tes','-','SPPG','Premium+','documents/mous/mou_sppgsumbersari1sumatra.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgsumbersari1sumatra@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Lengkong
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Lengkong','sppglengkong@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Lengkong','SPPG Lengkong','tes','-','SPPG','Premium+','documents/mous/mou_sppglengkong.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppglengkong@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Antirogo 1
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Antirogo 1','sppgantirogo1@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Antirogo 1','SPPG Antirogo 1','tes','-','SPPG','Premium+','documents/mous/mou_sppgantirogo1.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgantirogo1@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Jatian
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Jatian','sppgjatian@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Jatian','SPPG Jatian','tes','-','SPPG','Premium+','documents/mous/mou_sppgjatian.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgjatian@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Mayang 1 Tegalrejo
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Mayang 1 Tegalrejo','sppgmayang1tegalrejo@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Mayang 1 Tegalrejo','SPPG Mayang 1 Tegalrejo','tes','-','SPPG','Premium+','documents/mous/mou_sppgmayang1tegalrejo.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgmayang1tegalrejo@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Mayang 2 Klayu
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Mayang 2 Klayu','sppgmayang2klayu@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Mayang 2 Klayu','SPPG Mayang 2 Klayu','tes','-','SPPG','Premium+','documents/mous/mou_sppgmayang2klayu.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgmayang2klayu@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Mayang 3 Polres
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Mayang 3 Polres','sppgmayang3polres@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Mayang 3 Polres','SPPG Mayang 3 Polres','tes','-','SPPG','Premium+','documents/mous/mou_sppgmayang3polres.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgmayang3polres@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- SPPG Karang Kedawung
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('SPPG Karang Kedawung','sppgkarangkedawung@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'SPPG Karang Kedawung','SPPG Karang Kedawung','tes','-','SPPG','Premium+','documents/mous/mou_sppgkarangkedawung.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='sppgkarangkedawung@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Klinik Rolas Banjarsari
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Klinik Rolas Banjarsari','klinikrolasbanjarsari@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Klinik Rolas Banjarsari','Klinik Rolas Banjarsari','tes','-','Klinik/PKM','Premium+','documents/mous/mou_klinikrolasbanjarsari.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='klinikrolasbanjarsari@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Depo Bangunan
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Depo Bangunan','depobangunan@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Depo Bangunan','Depo Bangunan','tes','-','Depo/Mall','Premium+','documents/mous/mou_depobangunan.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='depobangunan@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Amapiano
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Amapiano','amapiano@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Amapiano','Amapiano','tes','-','Resto/Cafe','Premium+','documents/mous/mou_amapiano.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='amapiano@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- RS Kaliwates
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('RS Kaliwates','rskaliwates@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'RS Kaliwates','RS Kaliwates','tes','-','Rumah Sakit','Premium+','documents/mous/mou_rskaliwates.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='rskaliwates@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- RS DKT
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('RS DKT','rsdkt@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'RS DKT','RS DKT','tes','-','Rumah Sakit','Premium+','documents/mous/mou_rsdkt.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='rsdkt@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Hotel GM
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Hotel GM','hotelgm@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Hotel GM','Hotel GM','tes','-','Hotel','Premium+','documents/mous/mou_hotelgm.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='hotelgm@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Klinik Rolas Gajahmada
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Klinik Rolas Gajahmada','klinikrolasgajahmada@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Klinik Rolas Gajahmada','Klinik Rolas Gajahmada','tes','-','Klinik/PKM','Premium+','documents/mous/mou_klinikrolasgajahmada.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='klinikrolasgajahmada@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- RS Siloam
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('RS Siloam','rssiloam@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'RS Siloam','RS Siloam','tes','-','Rumah Sakit','Premium+','documents/mous/mou_rssiloam.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='rssiloam@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- RS Jember Klinik
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('RS Jember Klinik','rsjemberklinik@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'RS Jember Klinik','RS Jember Klinik','tes','-','Rumah Sakit','Premium+','documents/mous/mou_rsjemberklinik.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='rsjemberklinik@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- RS Muhammadiyah
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('RS Muhammadiyah','rsmuhammadiyah@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'RS Muhammadiyah','RS Muhammadiyah','tes','-','Rumah Sakit','Premium+','documents/mous/mou_rsmuhammadiyah.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='rsmuhammadiyah@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Hotel Aston
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Hotel Aston','hotelaston@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Hotel Aston','Hotel Aston','tes','-','Hotel','Premium+','documents/mous/mou_hotelaston.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='hotelaston@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Lippo Mall
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Lippo Mall','lippomall@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Lippo Mall','Lippo Mall','tes','-','Depo/Mall','Premium+','documents/mous/mou_lippomall.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='lippomall@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- VILLIGER TOBACCO
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('VILLIGER TOBACCO','villigertobacco@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'VILLIGER TOBACCO','VILLIGER TOBACCO','tes','-','Industri','Premium+','documents/mous/mou_villigertobacco.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='villigertobacco@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- TEMPUREJO
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('TEMPUREJO','tempurejo@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'TEMPUREJO','TEMPUREJO','tes','-','Industri','Premium+','documents/mous/mou_tempurejo.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='tempurejo@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Millenium Home Center
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Millenium Home Center','milleniumhomecenter@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Millenium Home Center','Millenium Home Center','tes','-','Depo/Mall','Premium+','documents/mous/mou_milleniumhomecenter.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='milleniumhomecenter@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Puskesmas Mayang
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Puskesmas Mayang','puskesmasmayang@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Puskesmas Mayang','Puskesmas Mayang','tes','-','Klinik/PKM','Premium+','documents/mous/mou_puskesmasmayang.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='puskesmasmayang@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Puskesmas Mumbulsari
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Puskesmas Mumbulsari','puskesmasmumbulsari@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Puskesmas Mumbulsari','Puskesmas Mumbulsari','tes','-','Klinik/PKM','Premium+','documents/mous/mou_puskesmasmumbulsari.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='puskesmasmumbulsari@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Klinik Bhakti Pratama
INSERT IGNORE INTO `users` (`name`,`email`,`password`,`role`,`daily_salary`,`created_at`,`updated_at`) VALUES ('Klinik Bhakti Pratama','klinikbhaktipratama@welltrash.com','$2y$12$RXNTPIcnIUGAuNgYnL13EunExA1mBZd5phDOBVwHBgkZZJ4z278Hu','company',0,NOW(),NOW());
INSERT INTO `companies` (`user_id`,`pic_name`,`company_name`,`address`,`phone`,`business_category`,`subscription_plan`,`signed_mou_path`,`pickup_schedule`,`subscription_status`,`created_at`,`updated_at`)
  SELECT u.id,'Klinik Bhakti Pratama','Klinik Bhakti Pratama','tes','-','Klinik/PKM','Premium+','documents/mous/mou_klinikbhaktipratama.pdf','[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]','active',NOW(),NOW() FROM `users` u
  WHERE u.email='klinikbhaktipratama@welltrash.com' AND NOT EXISTS (SELECT 1 FROM `companies` c WHERE c.user_id=u.id);

-- Kalau mitra sudah pernah diimpor: samakan paket & jadwal
UPDATE `companies` c JOIN `users` u ON u.id=c.user_id SET c.subscription_plan='Premium+', c.pickup_schedule='[\"Senin\",\"Selasa\",\"Rabu\",\"Kamis\",\"Jumat\",\"Sabtu\",\"Minggu\"]' WHERE u.email IN ('sppgtrisnogambar@welltrash.com','sppgrambipuji@welltrash.com','sppgkaliwates1@welltrash.com','sppgkreongan@welltrash.com','sppgbaratan1@welltrash.com','sppgmanggisan2@welltrash.com','sppgtanggulwetan1@welltrash.com','sppgtanggulwetan2@welltrash.com','sppgsumbersari1sumatra@welltrash.com','sppglengkong@welltrash.com','sppgantirogo1@welltrash.com','sppgjatian@welltrash.com','sppgmayang1tegalrejo@welltrash.com','sppgmayang2klayu@welltrash.com','sppgmayang3polres@welltrash.com','sppgkarangkedawung@welltrash.com','klinikrolasbanjarsari@welltrash.com','depobangunan@welltrash.com','amapiano@welltrash.com','rskaliwates@welltrash.com','rsdkt@welltrash.com','hotelgm@welltrash.com','klinikrolasgajahmada@welltrash.com','rssiloam@welltrash.com','rsjemberklinik@welltrash.com','rsmuhammadiyah@welltrash.com','hotelaston@welltrash.com','lippomall@welltrash.com','villigertobacco@welltrash.com','tempurejo@welltrash.com','milleniumhomecenter@welltrash.com','puskesmasmayang@welltrash.com','puskesmasmumbulsari@welltrash.com','klinikbhaktipratama@welltrash.com');

COMMIT;
