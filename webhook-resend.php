<?php
/**
 * Pyme360 · Receptor de webhooks de Resend (en Hostinger)
 * ----------------------------------------------------------------------------
 * Resend llama a este endpoint cada vez que un correo se abre / recibe clic /
 * rebota / genera queja. Aqui NO tocamos la BD: solo guardamos cada evento en
 * eventos.jsonl (una linea JSON por evento). El server local los recoge cada
 * 2 horas (GET a este mismo archivo con ?pull=SECRETO) y actualiza la BD.
 *
 * DESPLIEGUE en Hostinger (raiz publica de pyme360.online):
 *   - Sube este archivo como  webhook-resend.php
 *   - Sube el .htaccess (protege eventos.jsonl para que nadie lo lea por URL)
 *
 * En Resend (cuenta pyme360) -> Webhooks -> Add:
 *   Endpoint URL: https://pyme360.online/webhook-resend.php?k=CAMBIA_ESTE_SECRETO
 *   Eventos: email.opened, email.clicked, email.bounced, email.complained, email.delivered
 *
 * IMPORTANTE: cambia SHARED_SECRET por una cadena larga tuya y usa la MISMA en:
 *   - la URL del webhook en Resend (?k=...)
 *   - la variable RESEND_PULL_SECRET del .env del server local
 */

// ── Config ───────────────────────────────────────────────────────────────────
$SHARED_SECRET = '04ca0df36df23e92d87e6e6dcb7ba00cdb53b20e07145f3b';
$STORE = __DIR__ . '/eventos.jsonl';

// ── Modo PULL: el server local viene a recoger los eventos ───────────────────
// GET ?pull=SECRETO[&clear=1]  -> devuelve el contenido de eventos.jsonl.
// Con clear=1, ademas vacia el archivo (el server confirma que ya los proceso).
if (isset($_GET['pull'])) {
    if (!hash_equals($SHARED_SECRET, $_GET['pull'])) { http_response_code(403); exit('forbidden'); }
    header('Content-Type: application/x-ndjson; charset=utf-8');
    if (is_file($STORE)) {
        readfile($STORE);
        if (isset($_GET['clear']) && $_GET['clear'] === '1') {
            // Vaciar de forma segura: truncar el archivo.
            $fp = fopen($STORE, 'w'); if ($fp) { fclose($fp); }
        }
    }
    exit;
}

// ── Modo WEBHOOK: Resend nos envia un evento (POST) ──────────────────────────
// Verificacion ligera por secreto en la query (?k=SECRETO). Resend tambien firma
// con Svix; aqui usamos el secreto compartido por simplicidad en Hostinger.
$k = isset($_GET['k']) ? $_GET['k'] : '';
if (!hash_equals($SHARED_SECRET, $k)) { http_response_code(403); exit('forbidden'); }

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') { http_response_code(400); exit('empty'); }

// Validar que es JSON; si no, guardar crudo igualmente para no perder nada.
$decoded = json_decode($raw, true);
$type = (is_array($decoded) && isset($decoded['type'])) ? $decoded['type'] : 'unknown';

// Guardar una linea con marca de tiempo de recepcion + el payload original.
$record = json_encode([
    'received_at' => gmdate('c'),
    'type'        => $type,
    'payload'     => $decoded !== null ? $decoded : $raw,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

@file_put_contents($STORE, $record . "\n", FILE_APPEND | LOCK_EX);

// Resend espera un 200 rapido.
http_response_code(200);
echo 'ok';
