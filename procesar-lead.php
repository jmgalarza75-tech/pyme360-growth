<?php
// =============================================================
// Pyme360 — Procesador de leads
// Endpoint: POST /procesar-lead.php
// Recibe JSON del formulario, guarda en MySQL y envía email de aviso.
// =============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://pyme360.online');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Cargar configuración (credentials only on server, not in Git)
$config_file = __DIR__ . '/config.php';
if (!file_exists($config_file)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration missing']);
    exit;
}
require_once $config_file;

// Leer y decodificar el cuerpo JSON
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body']);
    exit;
}

// Extraer y sanear campos
function clean(string $value): string {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

$name          = clean($data['name']          ?? '');
$email         = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone         = clean($data['phone']         ?? '');
$business_name = clean($data['business_name'] ?? $data['business'] ?? '');
$sector        = clean($data['sector']        ?? '');
$location      = clean($data['location']      ?? '');
$objetivo      = clean($data['objetivo']      ?? '');
$presupuesto   = clean($data['presupuesto']   ?? '');

// Buscar "problem" dentro de critical_errors si viene con la estructura de Supabase
$problem_raw = $data['problem'] ?? ($data['critical_errors']['problem'] ?? '');
$problem     = clean($problem_raw);

// Validación mínima
if (!$name || !$email || !$phone || !$business_name) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Required fields missing']);
    exit;
}

// 1. Guardar en MySQL -------------------------------------------------
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $stmt = $pdo->prepare(
        'INSERT INTO leads
         (name, email, phone, business_name, sector, location, objetivo, presupuesto, problem)
         VALUES
         (:name, :email, :phone, :business_name, :sector, :location, :objetivo, :presupuesto, :problem)'
    );

    $stmt->execute([
        ':name'          => $name,
        ':email'         => $email,
        ':phone'         => $phone,
        ':business_name' => $business_name,
        ':sector'        => $sector,
        ':location'      => $location,
        ':objetivo'      => $objetivo,
        ':presupuesto'   => $presupuesto,
        ':problem'       => $problem,
    ]);

} catch (PDOException $e) {
    error_log('[Pyme360] DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database error']);
    exit;
}

// 2. Enviar email de aviso -------------------------------------------
$subject = "Nuevo lead Pyme360: {$business_name}";

$body  = "Nuevo diagnóstico recibido desde pyme360.online\n";
$body .= str_repeat('-', 50) . "\n\n";
$body .= "Nombre:       {$name}\n";
$body .= "Email:        {$email}\n";
$body .= "Teléfono:     {$phone}\n";
$body .= "Negocio:      {$business_name}\n";
$body .= "Sector:       {$sector}\n";
$body .= "Ciudad/Zona:  {$location}\n";
$body .= "Objetivo:     {$objetivo}\n";
$body .= "Presupuesto:  {$presupuesto}\n\n";
$body .= "Problema:\n{$problem}\n\n";
$body .= str_repeat('-', 50) . "\n";
$body .= "Recibido: " . date('d/m/Y H:i') . "\n";

$headers  = "From: Pyme360 <" . SMTP_FROM . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$mail_sent = mail(NOTIFY_TO, $subject, $body, $headers);

if (!$mail_sent) {
    // El lead ya está en BD, solo fallamos silenciosamente en el email
    error_log('[Pyme360] mail() failed for lead: ' . $email);
}

// 3. Respuesta exitosa -----------------------------------------------
http_response_code(201);
echo json_encode(['ok' => true]);
