<?php
declare(strict_types=1);

/**
 * Pyme360 · Receptor seguro de Resend.
 *
 * Este endpoint no procesa el CRM. Recibe el webhook autenticado y lo guarda
 * en un JSONL con bloqueo de fichero. El servidor local hace POST {action:pull}
 * y, tras reconciliar cada evento, POST {action:ack,snapshot_id}.
 *
 * Secretos obligatorios, siempre fuera del repositorio:
 *   RESEND_WEBHOOK_SECRET  -> secreto de firma del webhook (Svix whsec_... o HMAC)
 *   RESEND_PULL_SECRET     -> token de lectura/ACK en X-Pyme360-Pull-Token
 *
 * En hosting compartido se puede crear, solo en el servidor, un archivo
 * pyme360-secrets.php que devuelva un array con esas dos claves. El .htaccess
 * bloquea el acceso HTTP directo a ese archivo.
 */

$STORE = __DIR__ . '/eventos.jsonl';
$SERVER_SECRETS = [];
$SERVER_SECRET_FILE = __DIR__ . '/pyme360-secrets.php';
if (is_file($SERVER_SECRET_FILE)) {
    $loadedSecrets = require $SERVER_SECRET_FILE;
    if (is_array($loadedSecrets)) $SERVER_SECRETS = $loadedSecrets;
}
$WEBHOOK_SECRET = trim((string)(getenv('RESEND_WEBHOOK_SECRET') ?: ($SERVER_SECRETS['RESEND_WEBHOOK_SECRET'] ?? '')));
$PULL_SECRET = trim((string)(getenv('RESEND_PULL_SECRET') ?: ($SERVER_SECRETS['RESEND_PULL_SECRET'] ?? '')));

function jsonResponse(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestHeader(string $name): string
{
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return trim((string)($_SERVER[$key] ?? ''));
}

function requirePullAuth(string $secret): void
{
    $provided = requestHeader('X-Pyme360-Pull-Token');
    if ($secret === '' || $provided === '' || !hash_equals($secret, $provided)) {
        jsonResponse(['ok' => false, 'error' => 'forbidden'], 403);
    }
}

function verifyWebhookSignature(string $raw, string $secret): bool
{
    if ($secret === '') return false;

    // Resend utiliza Svix. Se acepta v1 con una clave whsec_ o una clave HMAC
    // directa para instalaciones que pasan por un proxy propio.
    $svixId = requestHeader('svix-id');
    $svixTimestamp = requestHeader('svix-timestamp');
    $svixSignature = requestHeader('svix-signature');
    if ($svixId !== '' && $svixTimestamp !== '' && $svixSignature !== '') {
        if (!ctype_digit($svixTimestamp) || abs(time() - (int)$svixTimestamp) > 300) return false;
        $encodedSecret = str_starts_with($secret, 'whsec_') ? substr($secret, 6) : $secret;
        $key = base64_decode($encodedSecret, true);
        if ($key === false) $key = $encodedSecret;
        $expected = base64_encode(hash_hmac('sha256', $svixId . '.' . $svixTimestamp . '.' . $raw, $key, true));
        foreach (preg_split('/\s+/', $svixSignature) as $candidate) {
            [$version, $value] = array_pad(explode(',', $candidate, 2), 2, '');
            if ($version === 'v1' && $value !== '' && hash_equals($expected, $value)) return true;
        }
        return false;
    }

    $provided = requestHeader('X-Pyme360-Signature') ?: requestHeader('X-Webhook-Signature');
    if (str_starts_with($provided, 'sha256=')) $provided = substr($provided, 7);
    $expected = hash_hmac('sha256', $raw, $secret);
    return $provided !== '' && hash_equals($expected, $provided);
}

function openStore(string $path)
{
    $fp = fopen($path, 'c+');
    if ($fp === false) jsonResponse(['ok' => false, 'error' => 'store_unavailable'], 503);
    return $fp;
}

function readSnapshot(string $path): array
{
    $fp = openStore($path);
    if (!flock($fp, LOCK_SH)) { fclose($fp); jsonResponse(['ok' => false, 'error' => 'store_lock_failed'], 503); }
    rewind($fp);
    $contents = stream_get_contents($fp);
    $contents = $contents === false ? '' : $contents;
    $events = [];
    foreach (preg_split('/\r?\n/', $contents) as $line) {
        $line = trim($line);
        if ($line === '') continue;
        $record = json_decode($line, true);
        $events[] = is_array($record)
            ? $record
            : ['received_at' => gmdate('c'), 'type' => 'unknown', 'payload' => $line];
    }
    $snapshotId = hash('sha256', $contents);
    flock($fp, LOCK_UN);
    fclose($fp);
    return ['snapshot_id' => $snapshotId, 'events' => $events];
}

function ackSnapshot(string $path, string $snapshotId): void
{
    if ($snapshotId === '') jsonResponse(['ok' => false, 'error' => 'snapshot_id_required'], 400);
    $fp = openStore($path);
    if (!flock($fp, LOCK_EX)) { fclose($fp); jsonResponse(['ok' => false, 'error' => 'store_lock_failed'], 503); }
    rewind($fp);
    $contents = stream_get_contents($fp);
    $contents = $contents === false ? '' : $contents;
    if (!hash_equals(hash('sha256', $contents), $snapshotId)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        jsonResponse(['ok' => false, 'error' => 'snapshot_changed'], 409);
    }
    ftruncate($fp, 0);
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    jsonResponse(['ok' => true, 'acked_snapshot_id' => $snapshotId]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $raw = $raw === false ? '' : $raw;
    $input = json_decode($raw, true);
    $action = is_array($input) ? (string)($input['action'] ?? '') : '';

    if ($action === 'pull') {
        requirePullAuth($PULL_SECRET);
        $snapshot = readSnapshot($STORE);
        jsonResponse(['ok' => true, 'snapshot_id' => $snapshot['snapshot_id'], 'events' => $snapshot['events']]);
    }
    if ($action === 'ack') {
        requirePullAuth($PULL_SECRET);
        ackSnapshot($STORE, (string)($input['snapshot_id'] ?? ''));
    }

    if ($raw === '') jsonResponse(['ok' => false, 'error' => 'empty'], 400);
    if (!verifyWebhookSignature($raw, $WEBHOOK_SECRET)) {
        jsonResponse(['ok' => false, 'error' => 'invalid_signature'], 403);
    }

    $decoded = json_decode($raw, true);
    $type = is_array($decoded) ? (string)($decoded['type'] ?? 'unknown') : 'unknown';
    $record = json_encode([
        'received_at' => gmdate('c'),
        'type' => $type,
        'payload' => is_array($decoded) ? $decoded : $raw,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($record === false) jsonResponse(['ok' => false, 'error' => 'json_encode_failed'], 500);

    $fp = openStore($STORE);
    if (!flock($fp, LOCK_EX)) { fclose($fp); jsonResponse(['ok' => false, 'error' => 'store_lock_failed'], 503); }
    fseek($fp, 0, SEEK_END);
    $written = fwrite($fp, $record . "\n");
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    if ($written === false) jsonResponse(['ok' => false, 'error' => 'store_write_failed'], 503);
    jsonResponse(['ok' => true]);
}

jsonResponse(['ok' => false, 'error' => 'method_not_allowed'], 405);
