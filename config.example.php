<?php
// =============================================================
// Pyme360 — Configuración del servidor
// IMPORTANTE: Este archivo NUNCA debe subirse a GitHub.
// Créalo directamente en Hostinger > Administrador de Archivos
// dentro de public_html/
// =============================================================

// --- Base de Datos MySQL (obtener desde hPanel > Bases de datos) ---
define('DB_HOST', 'localhost');
define('DB_NAME', 'tu_nombre_de_base_de_datos');  // ej: u123456789_pyme360
define('DB_USER', 'tu_usuario_de_bd');             // ej: u123456789_pyme360
define('DB_PASS', 'tu_contraseña_de_bd');

// --- Email de aviso (buzón creado en hPanel > Email) ---
define('SMTP_FROM', 'info@pyme360.online');
define('SMTP_PASS', 'tu_contraseña_de_email');
define('NOTIFY_TO', 'info@pyme360.online');        // dónde quieres recibir los leads
