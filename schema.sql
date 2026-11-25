-- =============================================================
-- Pyme360 Growth — Tabla de Leads y Cualificación Comercial PMV
-- Ejecutar en phpMyAdmin de Hostinger antes de subir procesar-lead.php
-- =============================================================

CREATE TABLE IF NOT EXISTS leads (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(255)  NOT NULL,
  email               VARCHAR(255)  NOT NULL,
  phone               VARCHAR(100)  DEFAULT '',
  business_name       VARCHAR(255)  NOT NULL,
  sector              VARCHAR(100)  DEFAULT '',
  accommodation_type  VARCHAR(50)   DEFAULT '',
  units               VARCHAR(50)   DEFAULT '',
  location            VARCHAR(100)  DEFAULT '',
  objetivo            VARCHAR(100)  DEFAULT '',
  presupuesto         VARCHAR(100)  DEFAULT '',
  score_100           INT           DEFAULT NULL,
  primary_need        VARCHAR(10)   DEFAULT '',
  selected_needs      VARCHAR(255)  DEFAULT '',
  recommended_brand   VARCHAR(50)   DEFAULT '',
  complementary_brand VARCHAR(50)   DEFAULT '',
  utm_source          VARCHAR(100)  DEFAULT '',
  utm_medium          VARCHAR(100)  DEFAULT '',
  utm_campaign        VARCHAR(150)  DEFAULT '',
  utm_content         VARCHAR(150)  DEFAULT '',
  utm_term            VARCHAR(150)  DEFAULT '',
  newsletter_consent  TINYINT(1)    DEFAULT 0,
  privacy_consent     TINYINT(1)    DEFAULT 1,
  email_sent_status   VARCHAR(50)   DEFAULT 'sent',
  booking_status      VARCHAR(50)   DEFAULT 'unbooked',
  followup_due_at     TIMESTAMP     NULL DEFAULT NULL,
  followup_sent_at    TIMESTAMP     NULL DEFAULT NULL,
  problem             TEXT          DEFAULT '',
  created_at          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created (created_at),
  INDEX idx_booking (booking_status, followup_due_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Migración para tablas existentes (si ya existía la tabla leads)
-- =============================================================
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS accommodation_type VARCHAR(50) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS units VARCHAR(50) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS score_100 INT DEFAULT NULL;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS primary_need VARCHAR(10) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_needs VARCHAR(255) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS recommended_brand VARCHAR(50) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS complementary_brand VARCHAR(50) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(150) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_content VARCHAR(150) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_term VARCHAR(150) DEFAULT '';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS newsletter_consent TINYINT(1) DEFAULT 0;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS privacy_consent TINYINT(1) DEFAULT 1;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_sent_status VARCHAR(50) DEFAULT 'sent';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS booking_status VARCHAR(50) DEFAULT 'unbooked';
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_due_at TIMESTAMP NULL DEFAULT NULL;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_sent_at TIMESTAMP NULL DEFAULT NULL;
