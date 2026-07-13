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
mail('jmgalarza75@gmail.com', $subject, $body, $headers);

if (!$mail_sent) {
    // El lead ya está en BD, solo fallamos silenciosamente en el email
    error_log('[Pyme360] mail() failed for lead: ' . $email);
}

// 3. Enviar email de confirmación al lead (HTML con publicidad) --------
$subject_lead = "Hemos recibido tu solicitud de diagnóstico - Pyme360";

$body_lead = "
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
    .header { background-color: #0f172a; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h2 { margin: 0; color: #ffffff; }
    .content { padding: 20px; }
    .ad-box { background-color: #f8fafc; border-left: 4px solid #818cf8; padding: 20px; margin-top: 30px; border-radius: 0 8px 8px 0; }
    .ad-box h3 { margin-top: 0; color: #0f172a; font-size: 18px; }
    .ad-box ul { padding-left: 20px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h2>¡Solicitud recibida con éxito!</h2>
    </div>
    <div class='content'>
      <p>Hola <strong>{$name}</strong>,</p>
      <p>Hemos registrado correctamente tu solicitud de diagnóstico para <strong>{$business_name}</strong>.</p>
      <p>Nuestro equipo revisará los detalles que nos has enviado y nos pondremos en contacto contigo lo antes posible en el número <strong>{$phone}</strong> o respondiendo a este correo para darte los siguientes pasos.</p>
      
      <div class='ad-box'>
        <h3>¿Qué hacemos exactamente en Pyme360 Growth?</h3>
        <p>Aprovechamos mientras esperas para contarte cómo ayudamos a negocios locales a dejar de perder oportunidades en internet. No hacemos \"ruido\", construimos <strong>sistemas de crecimiento reales</strong>:</p>
        <ul>
          <li><strong>Webs orientadas a la conversión:</strong> Tu escaparate digital optimizado para recibir llamadas y reservas directas, no solo visitas vacías.</li>
          <li><strong>Dominio en Google Local:</strong> Posicionamos tu ficha para que te encuentren a ti cuando busquen tus servicios en tu zona.</li>
          <li><strong>Sistemas de Seguimiento CRM:</strong> Automatizamos el contacto por WhatsApp y Email para que ningún cliente potencial se enfríe y las ventas se cierren.</li>
        </ul>
        <p>Prepárate para transformar la manera en la que captas clientes. ¡Hablamos pronto!</p>
      </div>
    </div>
    <div class='footer'>
      <p>&copy; " . date('Y') . " Pyme360. Todos los derechos reservados.</p>
      <p><a href='https://pyme360.online' style='color: #818cf8; text-decoration: none;'>pyme360.online</a></p>
    </div>
  </div>
</body>
</html>
";

$headers_lead  = "From: Pyme360 <" . SMTP_FROM . ">\r\n";
$headers_lead .= "Reply-To: " . SMTP_FROM . "\r\n";
$headers_lead .= "MIME-Version: 1.0\r\n";
$headers_lead .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers_lead .= "X-Mailer: PHP/" . phpversion() . "\r\n";

mail($email, $subject_lead, $body_lead, $headers_lead);

// 4. Respuesta exitosa -----------------------------------------------
http_response_code(201);
echo json_encode(['ok' => true]);
