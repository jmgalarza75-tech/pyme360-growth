-- =============================================================
-- Pyme360 Growth — Tabla de Leads
-- Ejecutar en phpMyAdmin de Hostinger antes de subir procesar-lead.php
-- =============================================================

CREATE TABLE IF NOT EXISTS leads (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  phone         VARCHAR(100)  NOT NULL,
  business_name VARCHAR(255)  NOT NULL,
  sector        VARCHAR(100)  DEFAULT '',
  location      VARCHAR(100)  DEFAULT '',
  objetivo      VARCHAR(100)  DEFAULT '',
  presupuesto   VARCHAR(100)  DEFAULT '',
  problem       TEXT          DEFAULT '',
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
