<?php
/**
 * Pyme360 · Endpoint público de baja (List-Unsubscribe one-click, RFC 8058)
 * ----------------------------------------------------------------------------
 * Sube este archivo a la raíz pública de pyme360.online (Hostinger) como
 *   https://pyme360.online/unsubscribe.php
 * y pon en el .env del server local:
 *   PUBLIC_BASE_URL="https://pyme360.online/unsubscribe.php"   (ver nota abajo)
 *
 * Gmail/Yahoo llaman a este endpoint por POST (one-click) sin abrir navegador,
 * y por GET cuando el usuario pulsa el enlace del pie del correo. Ambos casos
 * registran la baja y responden 200.
 *
 * Cómo llega la baja a tu CRM local:
 *  1) Se guarda en bajas.csv (protegido, en el propio hosting).
 *  2) Se envía un aviso a info@pyme360.online, para que tu server lo capte por
 *     IMAP (tarea 12) o lo metas a mano en suppressed_emails.
 *
 * NOTA sobre PUBLIC_BASE_URL: unsubscribeUrl() del server concatena
 *   `${PUBLIC_BASE_URL}/unsubscribe?email=...`. Con este PHP el path ya es el
 *   archivo, así que hay DOS formas de encajarlo:
 *   (A) Recomendado: crear en Hostinger una regla/redirección para que
 *       /unsubscribe (sin .php) sirva este archivo, y poner
 *       PUBLIC_BASE_URL="https://pyme360.online".  (deja las URLs limpias)
 *   (B) Alternativa sin tocar reglas: renombrar este archivo a carpeta
 *       /unsubscribe/index.php  y poner PUBLIC_BASE_URL="https://pyme360.online".
 */

// ── Config ───────────────────────────────────────────────────────────────────
$NOTIFY_TO   = 'info@pyme360.online';       // buzón que recibe el aviso de baja
$LOG_FILE    = __DIR__ . '/bajas.csv';      // registro local (protégelo, ver .htaccess)
$FROM_HEADER = 'From: bajas@pyme360.online';

// ── Recoger email + lead de query o body ─────────────────────────────────────
$email = isset($_REQUEST['email']) ? trim($_REQUEST['email']) : '';
$lead  = isset($_REQUEST['lead'])  ? trim($_REQUEST['lead'])  : '';

// Validación básica del email
$valid = $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL);

if ($valid) {
    // 1) Registrar en CSV local (append). Formato: fecha;email;lead;metodo;ip
    $method = ($_SERVER['REQUEST_METHOD'] === 'POST') ? 'one-click' : 'link';
    $line = sprintf(
        "%s;%s;%s;%s;%s\n",
        date('c'),
        str_replace(';', ',', $email),
        str_replace(';', ',', $lead),
        $method,
        $_SERVER['REMOTE_ADDR'] ?? ''
    );
    @file_put_contents($LOG_FILE, $line, FILE_APPEND | LOCK_EX);

    // 2) Avisar por email para sincronizar con el CRM local
    @mail(
        $NOTIFY_TO,
        'BAJA Pyme360: ' . $email,
        "Nueva baja registrada.\n\nEmail: $email\nLead: $lead\nMétodo: $method\nFecha: " . date('c') . "\n",
        $FROM_HEADER
    );
}

// ── Respuesta ────────────────────────────────────────────────────────────────
// One-click (POST): responder 200 mínimo, sin cuerpo (lo que espera el proveedor).
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    http_response_code(200);
    exit;
}

// GET (usuario en navegador): página de confirmación.
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
$shown = htmlspecialchars($email ?: 'Tu correo', ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Baja confirmada · Pyme360</title></head>
<body style="font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="text-align:center;max-width:440px;padding:24px;">
    <h1 style="font-size:22px;margin-bottom:8px;">Te has dado de baja ✅</h1>
    <p style="color:#94a3b8;"><?php echo $shown; ?> no recibirá más mensajes nuestros. Gracias por avisar.</p>
  </div>
</body></html>
