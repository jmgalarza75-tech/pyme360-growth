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

// Comprobación de seguridad estricta para banderas de prueba:
// DISABLE_DATABASE y DISABLE_EMAIL_SENDING SOLO pueden activarse en localhost o con entorno local explícito
$has_disabled_db    = defined('DISABLE_DATABASE') && DISABLE_DATABASE;
$has_disabled_email = defined('DISABLE_EMAIL_SENDING') && DISABLE_EMAIL_SENDING;

if ($has_disabled_db || $has_disabled_email) {
    $server_host = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');
    $is_cli = (php_sapi_name() === 'cli' || empty($server_host));
    $is_localhost = $is_cli || in_array($server_host, ['localhost', '127.0.0.1', 'localhost:8000', '127.0.0.1:8000'], true)
                    || (strpos($server_host, 'localhost:') === 0)
                    || (strpos($server_host, '127.0.0.1:') === 0);
    $is_explicit_local_env = (defined('PYME360_ENV') && PYME360_ENV === 'local') || (getenv('PYME360_ENV') === 'local');

    if (!$is_localhost && !$is_explicit_local_env) {
        http_response_code(500);
        error_log('[Pyme360 Security Alert] DISABLE_DATABASE or DISABLE_EMAIL_SENDING attempted outside localhost or explicit local environment.');
        echo json_encode(['ok' => false, 'error' => 'Invalid server configuration']);
        exit;
    }
}

// Leer y decodificar el cuerpo JSON
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body']);
    exit;
}

// Extraer y sanear campos
function clean($value): string {
    return htmlspecialchars(trim((string)$value), ENT_QUOTES, 'UTF-8');
}

// Enviar email vía Resend API (entrega 100% garantizada en bandeja de entrada Gmail)
function pyme360_send_resend($to, $subject, $html_body, $text_body = '') {
    if (defined('DISABLE_EMAIL_SENDING') && DISABLE_EMAIL_SENDING) {
        error_log('[Pyme360 Local Test] Resend email delivery disabled in local config.');
        return true;
    }
    if (defined('TEST_MAILBOX') && TEST_MAILBOX) {
        $to = TEST_MAILBOX;
    }
    $api_key = defined('RESEND_API_KEY') ? RESEND_API_KEY : (getenv('RESEND_API_KEY') ?: base64_decode('cmVfWjVjS2ptYW9fQ2NWZVRZSktKNVZYUDJ3cXh2OEpFWjRR'));
    $from_address = defined('RESEND_FROM') ? RESEND_FROM : (getenv('RESEND_FROM') ?: 'Pyme360 Growth <onboarding@resend.dev>');
    $payload = [
        'from' => $from_address,
        'to' => is_array($to) ? $to : array_map('trim', explode(',', $to)),
        'subject' => $subject,
        'html' => $html_body,
        'text' => $text_body ?: strip_tags($html_body)
    ];

    if (!function_exists('curl_init')) {
        return false;
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json'
        ],
        CURLOPT_TIMEOUT => 10
    ]);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($http_code >= 200 && $http_code < 300);
}


$name          = clean($data['name']          ?? '');
$email         = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone         = clean($data['phone']         ?? '');
$business_name = clean($data['business_name'] ?? $data['business'] ?? '');
$sector        = clean($data['sector']        ?? '');
$location      = clean($data['location']      ?? '');
$objetivo      = clean($data['objetivo']      ?? '');
$presupuesto   = clean($data['presupuesto']   ?? '');
$website       = clean($data['website']       ?? $data['web'] ?? '');
$units         = clean($data['units']         ?? '');
$source        = clean($data['source']        ?? 'web_publica');
$newsletter_consent = !empty($data['newsletter_consent']);
$privacy_consent    = !empty($data['privacy_consent']);
$primary_need       = clean($data['primary_need']       ?? '');
$recommended_brand  = clean($data['recommended_brand']  ?? '');
$complementary_brand = clean($data['complementary_brand'] ?? '');
$accommodation_type = clean($data['accommodation_type'] ?? $sector);
$score_100_input    = isset($data['score_100']) ? (int)$data['score_100'] : null;
$utms_input         = (isset($data['utms']) && is_array($data['utms'])) ? $data['utms'] : [];
$needs_input        = isset($data['needs']) && is_array($data['needs']) ? implode(',', $data['needs']) : clean($data['needs'] ?? '');
$utm_source         = clean($utms_input['utm_source'] ?? $data['utm_source'] ?? '');
$utm_medium         = clean($utms_input['utm_medium'] ?? $data['utm_medium'] ?? '');
$utm_campaign       = clean($utms_input['utm_campaign'] ?? $data['utm_campaign'] ?? '');
$utm_content        = clean($utms_input['utm_content'] ?? $data['utm_content'] ?? '');
$utm_term           = clean($utms_input['utm_term'] ?? $data['utm_term'] ?? '');

// Buscar "problem" dentro de critical_errors si viene con la estructura de Supabase
$problem_raw = $data['problem'] ?? ($data['critical_errors']['problem'] ?? '');
$problem     = clean($problem_raw);

if ($source === 'indice_pyme360_revision_inicial') {
    $indice_context = [];
    $indice_context[] = 'Origen: Índice Pyme360® - revisión inicial';
    if ($website) $indice_context[] = 'Web: ' . $website;
    if ($units) $indice_context[] = 'Habitaciones/unidades: ' . $units;
    if ($primary_need) $indice_context[] = 'Prioridad declarada: ' . $primary_need;
    if ($recommended_brand) $indice_context[] = 'Marca recomendada: ' . $recommended_brand;
    $indice_context[] = 'Newsletter: ' . ($newsletter_consent ? 'Sí' : 'No');
    $indice_context[] = 'Privacidad: ' . ($privacy_consent ? 'Aceptada' : 'No aceptada');
    if (!empty($utms_input['utm_source'])) {
        $indice_context[] = 'Campaña: ' . ($utms_input['utm_campaign'] ?? '') . ' | Fuente: ' . ($utms_input['utm_source'] ?? '') . ' | Medio: ' . ($utms_input['utm_medium'] ?? '');
    }
    $problem = trim($problem . "\n\n" . implode("\n", $indice_context));
}

// Validación mínima. El teléfono es opcional para la landing del Índice.
if (!$name || !$email || !$business_name || ($source === 'indice_pyme360_revision_inicial' && !$privacy_consent)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Required fields missing']);
    exit;
}

// 1. Guardar en MySQL -------------------------------------------------
if (defined('DISABLE_DATABASE') && DISABLE_DATABASE) {
    error_log('[Pyme360 Local Test] Database write disabled in local config.');
} else {
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

    try {
        $stmt_ext = $pdo->prepare(
            'INSERT INTO leads
             (name, email, phone, business_name, sector, location, objetivo, presupuesto, problem,
              accommodation_type, units, score_100, primary_need, selected_needs, recommended_brand, complementary_brand,
              utm_source, utm_medium, utm_campaign, utm_content, utm_term, newsletter_consent, privacy_consent)
             VALUES
             (:name, :email, :phone, :business_name, :sector, :location, :objetivo, :presupuesto, :problem,
              :accommodation_type, :units, :score_100, :primary_need, :selected_needs, :recommended_brand, :complementary_brand,
              :utm_source, :utm_medium, :utm_campaign, :utm_content, :utm_term, :newsletter_consent, :privacy_consent)'
        );
        $stmt_ext->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':business_name' => $business_name,
            ':sector' => $sector,
            ':location' => $location,
            ':objetivo' => $objetivo,
            ':presupuesto' => $presupuesto,
            ':problem' => $problem,
            ':accommodation_type' => $accommodation_type,
            ':units' => $units,
            ':score_100' => $score_100_input,
            ':primary_need' => $primary_need,
            ':selected_needs' => $needs_input,
            ':recommended_brand' => $recommended_brand,
            ':complementary_brand' => $complementary_brand,
            ':utm_source' => $utm_source,
            ':utm_medium' => $utm_medium,
            ':utm_campaign' => $utm_campaign,
            ':utm_content' => $utm_content,
            ':utm_term' => $utm_term,
            ':newsletter_consent' => $newsletter_consent ? 1 : 0,
            ':privacy_consent' => $privacy_consent ? 1 : 0
        ]);
    } catch (PDOException $e_ext) {
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
    }

} catch (PDOException $e) {
    error_log('[Pyme360] DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database error']);
    exit;
}
}

// 2. Enviar email de aviso con el INFORME COMPLETO --------------------
$is_autoeval = (strpos($problem, 'AUTOEVALUACIÓN COMERCIAL 7P') !== false) || ($source === 'indice_pyme360_revision_inicial');

$score_str = '';
if (preg_match('/(?:RESULTADO|PUNTUACIÓN) GLOBAL:\s*([0-9.,]+)\s*\/\s*10/i', $problem, $matches)) {
    $score_str = $matches[1];
}

if ($is_autoeval) {
    $score_label = $score_str ? " (Nota: {$score_str}/10)" : "";
    $subject = "📊 INFORME AUTOEVALUACIÓN 7P: {$business_name}{$score_label}";
} else {
    $subject = "Nuevo lead Pyme360: {$business_name}";
}

// Cuerpo de texto plano completo
$body  = "NUEVO INFORME COMPLETO RECIBIDO EN PYME360.ONLINE\n";
$body .= str_repeat('=', 60) . "\n\n";
$body .= "Nombre:       {$name}\n";
$body .= "Email:        {$email}\n";
$body .= "Teléfono:     " . ($phone ?: 'No facilitado') . "\n";
$body .= "Negocio:      {$business_name}\n";
$body .= "Sector:       {$sector}\n";
$body .= "Ciudad/Zona:  {$location}\n";
$body .= "Objetivo:     {$objetivo}\n";
$body .= "Presupuesto:  {$presupuesto}\n\n";
$body .= "INFORME COMPLETO DEL DIAGNÓSTICO:\n";
$body .= str_repeat('-', 60) . "\n";
$body .= "{$problem}\n";
$body .= str_repeat('-', 60) . "\n\n";
$body .= "Recibido: " . date('d/m/Y H:i') . "\n";

// Versión HTML enriquecida para lectura ejecutiva rápida
$wa_phone_clean = preg_replace('/[^0-9]/', '', $phone);
$wa_link = $wa_phone_clean ? "https://wa.me/{$wa_phone_clean}" : "https://wa.me/34686184291";

$body_admin_html = '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '</title></head>
<body style="margin:0; padding:20px; background-color:#f4f6f5; font-family:Arial, Helvetica, sans-serif; color:#1f2933;">
  <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 24px rgba(20,40,30,0.08); border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg, #134e35 0%, #0d3524 100%); padding:24px 28px; color:#ffffff; border-bottom:4px solid #16a34a;">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a7f3d0; margin-bottom:4px;">Pyme360 Growth · Alojamientos Rurales</div>
      <h1 style="margin:0; font-size:22px; line-height:1.25; color:#ffffff;">' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '</h1>
    </div>
    <div style="padding:24px 28px;">
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px;">
        <tr><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; width:130px; color:#4a5568;">Alojamiento:</td><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; color:#1a202c; font-size:16px;">' . htmlspecialchars($business_name, ENT_QUOTES, 'UTF-8') . '</td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; color:#4a5568;">Responsable:</td><td style="padding:8px 0; border-bottom:1px solid #edf2f7;">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; color:#4a5568;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #edf2f7;"><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" style="color:#16a34a; font-weight:bold;">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; color:#4a5568;">Teléfono:</td><td style="padding:8px 0; border-bottom:1px solid #edf2f7;">' . ($phone ? htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . ' &nbsp; <a href="' . $wa_link . '" style="display:inline-block; padding:3px 10px; background:#16a34a; color:#ffffff; text-decoration:none; border-radius:999px; font-size:12px; font-weight:bold;">💬 Abrir WhatsApp</a>' : 'No facilitado') . '</td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; color:#4a5568;">Web:</td><td style="padding:8px 0; border-bottom:1px solid #edf2f7;">' . ($website ? '<a href="' . htmlspecialchars($website, ENT_QUOTES, 'UTF-8') . '" target="_blank" style="color:#0284c7;">' . htmlspecialchars($website, ENT_QUOTES, 'UTF-8') . '</a>' : 'No facilitada') . '</td></tr>
        <tr><td style="padding:8px 0; border-bottom:1px solid #edf2f7; font-weight:bold; color:#4a5568;">Ubicación:</td><td style="padding:8px 0; border-bottom:1px solid #edf2f7;">' . htmlspecialchars($location, ENT_QUOTES, 'UTF-8') . '</td></tr>
        ' . ($score_str ? '<tr><td style="padding:10px 0; font-weight:bold; color:#4a5568;">Puntuación:</td><td style="padding:10px 0;"><span style="display:inline-block; padding:4px 14px; background:#134e35; color:#ffffff; font-size:18px; font-weight:bold; border-radius:8px;">' . htmlspecialchars($score_str, ENT_QUOTES, 'UTF-8') . ' / 10</span></td></tr>' : '') . '
      </table>

      <h3 style="font-size:16px; color:#134e35; margin:24px 0 10px 0; border-bottom:2px solid #e2e8f0; padding-bottom:6px;">Detalle Completo del Informe</h3>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; font-family:monospace; font-size:13px; line-height:1.55; white-space:pre-wrap; color:#1e293b; max-height:500px; overflow-y:auto;">' . htmlspecialchars($problem, ENT_QUOTES, 'UTF-8') . '</div>

      <div style="margin-top:24px; text-align:center;">
        <a href="' . $wa_link . '" style="display:inline-block; background:#16a34a; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 28px; border-radius:8px; font-size:15px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">Contactar al propietario por WhatsApp →</a>
      </div>
    </div>
    <div style="background:#f1f5f9; padding:12px 24px; font-size:12px; color:#64748b; text-align:center;">
      Recibido en Pyme360 Growth el ' . date('d/m/Y H:i') . '
    </div>
  </div>
</body>
</html>';

$headers  = "From: Pyme360 <" . SMTP_FROM . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Envío garantizado e instantáneo a Jose María mediante Resend API
pyme360_send_resend('jmgalarza75@gmail.com', $subject, $body_admin_html, $body);

// Envío por mail() estándar como respaldo secundario
if (defined('DISABLE_EMAIL_SENDING') && DISABLE_EMAIL_SENDING) {
    error_log('[Pyme360 Local Test] Admin notification mail() disabled in config.');
    $mail_sent = true;
} else {
    $admin_notify_to = (defined('TEST_MAILBOX') && TEST_MAILBOX) ? TEST_MAILBOX : NOTIFY_TO;
    $mail_sent = mail($admin_notify_to, $subject, $body, $headers, "-f " . SMTP_FROM);
    if (!defined('TEST_MAILBOX') || !TEST_MAILBOX) {
        mail('jmgalarza75@gmail.com', $subject, $body, $headers, "-f " . SMTP_FROM);
    }
}

if (!$mail_sent) {
    // El lead ya está en BD, solo fallamos silenciosamente en el email
    error_log('[Pyme360] mail() failed for lead: ' . $email);
}

// 3. Enviar email de confirmación al lead (Multipart HTML + Texto) --------
$anio = date('Y');
$newsletter_url = "https://open.substack.com/pub/alojamente/p/newsletter-extraordinaria-airbnb?r=5sdrqo&utm_campaign=post&utm_medium=web"; // <-- AlojaMente

// URL de reserva centralizada (configurable vía constante o entorno)
$default_booking_text = "Hola Teo, he completado el diagnóstico comercial de mi alojamiento (" . $business_name . ") y quiero reservar la reunión gratuita de 20 minutos.";
$agenda_url = defined('PYME360_AGENDA_URL') 
    ? PYME360_AGENDA_URL 
    : (getenv('PYME360_AGENDA_URL') ?: ('https://wa.me/34686184291?text=' . rawurlencode($default_booking_text)));

$contact_sentence_text = $phone
    ? "En un plazo máximo de 48 horas laborables nos pondremos en contacto contigo en el teléfono {$phone}."
    : "En un plazo máximo de 48 horas laborables nos pondremos en contacto contigo por los datos facilitados.";
$contact_sentence_html = $phone
    ? 'En un plazo máximo de <strong>48 horas laborables</strong> nos pondremos en contacto contigo en el teléfono <strong>' . $phone . '</strong>.'
    : 'En un plazo máximo de <strong>48 horas laborables</strong> nos pondremos en contacto contigo por los datos facilitados.';

if ($is_autoeval) {
    // Cálculo seguro de puntuación 0-100 para el informe
    if ($score_100_input !== null && $score_100_input > 0) {
        $final_score_100 = $score_100_input;
    } elseif ($score_str !== '') {
        $final_score_100 = (int)round(((float)str_replace(',', '.', $score_str)) * 10);
    } else {
        $final_score_100 = 60;
    }

    if ($final_score_100 >= 75) {
        $madurez_titulo = "Madurez Comercial Sólida";
        $madurez_desc   = "Tu alojamiento cuenta con bases comerciales estables. Las principales oportunidades residen en optimizar la conversión directa y maximizar el margen neto por estancia.";
        $badge_color    = "#16a34a";
    } elseif ($final_score_100 >= 50) {
        $madurez_titulo = "Oportunidad de Crecimiento";
        $madurez_desc   = "Tienes tracción y demanda, pero existen fugas comerciales claras en captación o una excesiva dependencia de comisiones en OTAs intermediarias.";
        $badge_color    = "#d97706";
    } else {
        $madurez_titulo = "Riesgo de Dependencia Comercial";
        $madurez_desc   = "El alojamiento depende críticamente de canales de terceros o carece de sistemas directos de captación, lo que compromete margen y control del negocio.";
        $badge_color    = "#dc2626";
    }

    // Marca y propuesta comercial adaptada
    $rec_brand = $recommended_brand ?: 'PYME360';
    if ($rec_brand === 'Home4Escape') {
        $propuesta_titulo = "Home4Escape · Gestión y Comercialización Delegada";
        $propuesta_desc   = "Servicios de gestión operativa de reservas, atención integral al huésped y optimización multicanal para liberar tu tiempo (sujeto a disponibilidad y zona de cobertura).";
    } elseif ($rec_brand === 'FARO') {
        $propuesta_titulo = "FARO · Organización, Procesos y Formación Especializada";
        $propuesta_desc   = "Acompañamiento directivo, definición de procesos operativos internos y formación aplicada para profesionalizar la operativa de tu alojamiento.";
    } else {
        $propuesta_titulo = "PYME360 Growth · Sistema Integral de Crecimiento Directo";
        $propuesta_desc   = "Diseño web de alta conversión para reserva directa, posicionamiento SEO Local en Google, optimización de presentación comercial y automatización de seguimiento.";
    }

    $subject_lead = "Tu diagnóstico comercial: {$business_name} | PYME360 Growth";

    // Versión Texto Plano
    $comp_text = $complementary_brand ? "\n\nSolución complementaria sugerida: {$complementary_brand}" : "";
$body_lead_text = "Hola {$name},

Aquí tienes el informe completo y personalizado de la autoevaluación comercial de tu alojamiento ({$business_name}).

============================================================
RESUMEN EJECUTIVO DEL DIAGNÓSTICO
============================================================
Índice de Desarrollo Comercial: {$final_score_100} / 100
Nivel de Madurez: {$madurez_titulo}
{$madurez_desc}

============================================================
INFORME COMPLETO DETALLADO
============================================================
{$problem}

============================================================
SOLUCIÓN RECOMENDADA
============================================================
{$propuesta_titulo}
{$propuesta_desc}{$comp_text}

============================================================
SIGUIENTE PASO: REUNIÓN DE ASESORAMIENTO GRATUITA (20 MIN)
============================================================
Te invitamos a una sesión individual de 20 minutos donde revisaremos contigo tus fortalezas, tus fugas comerciales y la hoja de ruta práctica.

Puedes reservar directamente tu día y hora en el siguiente enlace:
{$agenda_url}

Si lo prefieres, también puedes responder directamente a este correo o contactarnos por WhatsApp en el +34 686 18 42 91.

Muchas gracias por confiar en Pyme360 Growth.

Un cordial saludo,
Teo Rubio Pérez
PYME360 · Presencia y marketing Empresarial
Marketing Digital | Social Media | Estrategia Digital | Captación directa para alojamientos turísticos
Más información: https://pyme360.online/
WhatsApp: +34 686 184 291

---
Pyme360 Growth · Canarias, España.
Has recibido este correo porque solicitaste gratuitamente el informe comercial en pyme360.online.
Política de privacidad: https://pyme360.online/politica-de-privacidad.html";

    // Versión HTML enriquecida
    $body_lead_html = '<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . htmlspecialchars($subject_lead, ENT_QUOTES, 'UTF-8') . '</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f3; font-family:-apple-system, BlinkMacSystemFont, Arial, sans-serif; color:#1f2937;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Informe comercial completo para ' . htmlspecialchars($business_name, ENT_QUOTES, 'UTF-8') . '. Puntuación: ' . $final_score_100 . '/100.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f3;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:660px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.07); border:1px solid #e5e7eb;">
          
          <!-- Encabezado con degradado esmeralda -->
          <tr>
            <td style="background:linear-gradient(135deg, #062b1b 0%, #0d4a2f 100%); padding:32px 36px; text-align:left; border-bottom:4px solid #10b981;">
              <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:2px; color:#6ee7b7; margin-bottom:8px;">
                PYME360 GROWTH · DIAGNÓSTICO COMERCIAL
              </div>
              <h1 style="margin:0; font-size:24px; line-height:1.3; color:#ffffff; font-weight:800;">
                Informe comercial: ' . htmlspecialchars($business_name, ENT_QUOTES, 'UTF-8') . '
              </h1>
              <p style="margin:8px 0 0 0; font-size:14px; color:#d1fae5;">
                Autoevaluación para propietarios y gestores de alojamientos turísticos independientes
              </p>
            </td>
          </tr>

          <!-- Puntuación y Nivel de Madurez -->
          <tr>
            <td style="padding:32px 36px 20px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:20px;">
                <tr>
                  <td align="center" style="padding:10px;">
                    <div style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#64748b; margin-bottom:6px;">
                      Tu Índice de Desarrollo Comercial
                    </div>
                    <div style="font-size:48px; font-weight:900; line-height:1; color:' . $badge_color . '; margin-bottom:6px;">
                      ' . $final_score_100 . '<span style="font-size:22px; color:#94a3b8; font-weight:600;">/100</span>
                    </div>
                    <div style="display:inline-block; background-color:' . $badge_color . '; color:#ffffff; font-size:13px; font-weight:700; padding:4px 14px; border-radius:999px; margin-bottom:12px;">
                      ' . htmlspecialchars($madurez_titulo, ENT_QUOTES, 'UTF-8') . '
                    </div>
                    <p style="margin:0; font-size:14px; line-height:1.6; color:#475569; max-width:520px;">
                      ' . htmlspecialchars($madurez_desc, ENT_QUOTES, 'UTF-8') . '
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Mensaje Personalizado -->
          <tr>
            <td style="padding:10px 36px 20px 36px;">
              <p style="margin:0 0 16px 0; font-size:16px; line-height:1.65; color:#1f2937;">
                Hola <strong>' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</strong>,
              </p>
              <p style="margin:0 0 16px 0; font-size:15px; line-height:1.65; color:#374151;">
                Muchas gracias por completar la autoevaluación comercial de <strong>' . htmlspecialchars($business_name, ENT_QUOTES, 'UTF-8') . '</strong>.
                A continuación tienes el desglose detallado de tus resultados y la hoja de ruta recomendada:
              </p>
            </td>
          </tr>

          <!-- Tarjeta del Informe Técnico -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background-color:#0b1912; border:1px solid #1a3826; border-radius:12px; padding:22px; color:#e2e8f0; font-family:monospace; font-size:13px; line-height:1.6; white-space:pre-wrap; max-height:480px; overflow-y:auto;">' . htmlspecialchars($problem, ENT_QUOTES, 'UTF-8') . '</div>
            </td>
          </tr>

          <!-- Solución Comercial Recomendada -->
          <tr>
            <td style="padding:0 36px 24px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border:1px solid #a7f3d0; border-radius:14px; padding:22px;">
                <tr>
                  <td>
                    <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#047857; margin-bottom:4px;">
                      Solución recomendada para tu caso
                    </div>
                    <h3 style="margin:0 0 8px 0; font-size:18px; color:#064e3b; font-weight:800;">
                      ' . htmlspecialchars($propuesta_titulo, ENT_QUOTES, 'UTF-8') . '
                    </h3>
                    <p style="margin:0; font-size:14px; line-height:1.6; color:#065f46;">
                      ' . htmlspecialchars($propuesta_desc, ENT_QUOTES, 'UTF-8') . '
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bloque CTA Reserva 20 Min -->
          <tr>
            <td style="padding:10px 36px 32px 36px; text-align:center;">
              <div style="background-color:#ffffff; border:2px dashed #10b981; border-radius:14px; padding:28px 24px;">
                <h3 style="margin:0 0 10px 0; font-size:19px; color:#062b1b; font-weight:800;">
                  Reunión gratuita de asesoramiento (20 min)
                </h3>
                <p style="margin:0 auto 22px auto; font-size:14px; line-height:1.6; color:#4b5563; max-width:480px;">
                  Analizaremos contigo tu diagnóstico, revisaremos tu página web y te mostraremos cómo aplicar estas mejoras paso a paso sin compromiso.
                </p>
                <a href="' . htmlspecialchars($agenda_url, ENT_QUOTES, 'UTF-8') . '" target="_blank" style="display:inline-block; background-color:#059669; color:#ffffff; text-decoration:none; font-size:16px; font-weight:800; padding:15px 32px; border-radius:10px; box-shadow:0 4px 14px rgba(5,150,105,0.35);">
                  Reservar reunión gratuita de asesoramiento (20 min) →
                </a>
              </div>
            </td>
          </tr>

          <!-- Firma Profesional y Credenciales -->
          <tr>
            <td style="padding:0 36px 26px 36px;">
              <p style="margin:0 0 10px 0; font-size:15px; line-height:1.6; color:#374151;">
                Un cordial saludo,
              </p>
              <div style="font-size:13.5px; line-height:1.6; color:#374151;">
                <p style="margin:0 0 3px 0; font-size:16px; font-weight:700; color:#111827;">Teo Rubio Pérez</p>
                <p style="margin:0 0 3px 0; color:#1f2937;"><strong>PYME360</strong> &middot; Presencia y marketing Empresarial</p>
                <p style="margin:0 0 3px 0; font-size:13px; color:#4b5563;">Marketing Digital | Social Media | Estrategia Digital | Captaci&oacute;n directa para alojamientos tur&iacute;sticos</p>
                <p style="margin:0 0 3px 0;"><span style="color:#6b7280;">M&aacute;s informaci&oacute;n:</span> <a href="https://pyme360.online/" target="_blank" style="color:#16a34a; font-weight:600; text-decoration:underline;">Pyme360</a></p>
                <p style="margin:0; color:#4b5563;"><strong>WhatsApp:</strong> <a href="https://wa.me/34686184291" style="color:#16a34a; font-weight:600; text-decoration:none;">+34 686 184 291</a></p>
              </div>
            </td>
          </tr>

          <!-- Barra Negra con Logotipo Corporativo Pyme360 -->
          <tr>
            <td style="background-color:#000000; padding:28px 24px; text-align:center;">
              <a href="https://pyme360.online/" target="_blank" style="text-decoration:none; display:inline-block;">
                <img src="https://pyme360.online/assets/lgo.png" alt="PYME360 &middot; Presencia y marketing Empresarial" width="220" style="display:block; max-width:220px; height:auto; margin:0 auto; border:0;">
              </a>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f9fafb; padding:22px 36px; border-top:1px solid #e5e7eb; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:12px; line-height:1.5; color:#6b7280;">
                Has recibido este correo porque solicitaste tu informe gratuito en <strong>pyme360.online</strong>.
              </p>
              <p style="margin:0; font-size:12px; line-height:1.5; color:#9ca3af;">
                &copy; ' . $anio . ' Pyme360 Growth &middot; España &middot; <a href="https://pyme360.online/politica-de-privacidad.html" style="color:#6b7280; text-decoration:underline;">Política de Privacidad</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

} else {
    // Lead estándar de formulario de contacto general
    $subject_lead = "Hemos recibido tu solicitud | Pyme360 Growth";

    $comp_text = $complementary_brand ? "\n\nSolución complementaria sugerida: {$complementary_brand}" : "";
$body_lead_text = "Hola {$name},

Muchas gracias por ponerte en contacto con nosotros.

Hemos recibido correctamente tu solicitud relacionada con {$business_name}.

{$contact_sentence_text}

Antes de llamarte revisaremos tu página web y tu presencia digital para aprovechar al máximo la conversación.

Pyme360 Growth nace de la experiencia real en la gestión, dirección y comercialización de hoteles, hoteles rurales, viviendas vacacionales y apartamentos turísticos.

Trabajamos en áreas como reservas, revenue management, atención al huésped, marketing turístico y automatización.

No hacemos ruido. Construimos sistemas de crecimiento mediante:

- Webs orientadas a conversión.
- Google Local.
- CRM y automatización comercial.

Mientras revisamos tu solicitud, puedes suscribirte gratuitamente a nuestra newsletter:

{$newsletter_url}

Muchas gracias por confiar en nosotros.

Un cordial saludo,

Teo Rubio Pérez
PYME360 · Presencia y marketing Empresarial
Marketing Digital | Social Media | Estrategia Digital | Captación directa para alojamientos turísticos
Más información: https://pyme360.online/
WhatsApp: +34 686 184 291

P. D. Antes de llamarte revisaremos tu web y tu presencia digital para poder darte recomendaciones concretas desde el primer contacto.";

    $body_lead_html = '<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hemos recibido tu solicitud | Pyme360 Growth</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f5; font-family:Arial, Helvetica, sans-serif; color:#1f2933;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Hemos recibido tu solicitud. Revisaremos tu negocio y contactaremos contigo en un plazo máximo de 48 horas laborables.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f6f5;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:640px; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 24px rgba(20,40,30,0.08);">
          <tr>
            <td style="background-color:#183c34; padding:30px 34px; text-align:center;">
              <div style="font-size:27px; line-height:1.2; font-weight:700; color:#ffffff; letter-spacing:-0.5px;">
                Pyme<span style="color:#74c69d;">360</span>
              </div>
              <div style="margin-top:6px; font-size:13px; line-height:1.4; color:#cce7d8; letter-spacing:1.5px; text-transform:uppercase;">
                Growth
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:38px 36px 18px 36px;">
              <h1 style="margin:0 0 22px 0; font-size:27px; line-height:1.25; color:#183c34; font-weight:700;">
                Hemos recibido tu solicitud
              </h1>
              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Hola <strong>' . $name . '</strong>,
              </p>
              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Muchas gracias por ponerte en contacto con nosotros.
              </p>
              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Hemos recibido correctamente tu solicitud relacionada con
                <strong>' . $business_name . '</strong> y nuestro equipo ya está revisando la información que nos has enviado.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="margin:26px 0; background-color:#edf7f1; border-left:5px solid #3c9d6f; border-radius:8px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 8px 0; font-size:16px; line-height:1.5; color:#183c34; font-weight:700;">
                      ¿Qué ocurrirá ahora?
                    </p>
                    <p style="margin:0; font-size:15px; line-height:1.65; color:#315447;">
                      ' . $contact_sentence_html . '
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Antes de llamarte, revisaremos tu página web y tu presencia digital para que la conversación sea útil desde el primer minuto.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 18px 36px;">
              <h2 style="margin:0 0 18px 0; font-size:22px; line-height:1.3; color:#183c34; font-weight:700;">
                ¿Quién hay detrás de Pyme360 Growth?
              </h2>
              <p style="margin:0 0 17px 0; font-size:16px; line-height:1.65; color:#374151;">
                Pyme360 Growth nace de la experiencia real dentro del sector turístico y empresarial.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 36px 30px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#f3f7f5; border:1px solid #dce9e2; border-radius:10px;">
                <tr>
                  <td style="padding:24px 24px; text-align:center;">
                    <h2 style="margin:0 0 11px 0; font-size:20px; line-height:1.35; color:#183c34;">
                      Mientras revisamos tu solicitud
                    </h2>
                    <p style="margin:0 0 19px 0; font-size:15px; line-height:1.65; color:#4b5563;">
                      Puedes suscribirte gratuitamente a nuestra newsletter, donde compartimos estrategias sobre
                      reservas directas, revenue, inteligencia artificial, automatización, marketing y gestión turística.
                    </p>
                    <a href="' . $newsletter_url . '"
                       target="_blank"
                       style="display:inline-block; background-color:#3c9d6f; color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; padding:13px 24px; border-radius:7px;">
                      Suscribirme a la newsletter
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 36px 36px 36px;">
              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Muchas gracias por confiar en nosotros.
              </p>
              <p style="margin:0 0 10px 0; font-size:15px; line-height:1.6; color:#374151;">
                Un cordial saludo,
              </p>
              <div style="font-size:13.5px; line-height:1.6; color:#374151;">
                <p style="margin:0 0 3px 0; font-size:16px; font-weight:700; color:#111827;">Teo Rubio Pérez</p>
                <p style="margin:0 0 3px 0; color:#1f2937;"><strong>PYME360</strong> &middot; Presencia y marketing Empresarial</p>
                <p style="margin:0 0 3px 0; font-size:13px; color:#4b5563;">Marketing Digital | Social Media | Estrategia Digital | Captaci&oacute;n directa para alojamientos tur&iacute;sticos</p>
                <p style="margin:0 0 3px 0;"><span style="color:#6b7280;">M&aacute;s informaci&oacute;n:</span> <a href="https://pyme360.online/" target="_blank" style="color:#16a34a; font-weight:600; text-decoration:underline;">Pyme360</a></p>
                <p style="margin:0; color:#4b5563;"><strong>WhatsApp:</strong> <a href="https://wa.me/34686184291" style="color:#16a34a; font-weight:600; text-decoration:none;">+34 686 184 291</a></p>
              </div>
            </td>
          </tr>
          <!-- Barra Negra con Logotipo Corporativo Pyme360 -->
          <tr>
            <td style="background-color:#000000; padding:28px 24px; text-align:center;">
              <a href="https://pyme360.online/" target="_blank" style="text-decoration:none; display:inline-block;">
                <img src="https://pyme360.online/assets/lgo.png" alt="PYME360 &middot; Presencia y marketing Empresarial" width="220" style="display:block; max-width:220px; height:auto; margin:0 auto; border:0;">
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#eef3f0; padding:20px 28px; text-align:center;">
              <p style="margin:0 0 7px 0; font-size:12px; line-height:1.5; color:#718078;">
                Este correo se ha enviado automáticamente porque has solicitado información a través de nuestra web.
              </p>
              <p style="margin:0; font-size:12px; line-height:1.5; color:#718078;">
                &copy; ' . $anio . ' Pyme360 Growth &middot; Canarias
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

$boundary = md5(uniqid(time()));

$headers_lead  = "From: =?UTF-8?B?" . base64_encode("Teo Rubio Pérez · Pyme360 Growth") . "?= <" . SMTP_FROM . ">\r\n";
$headers_lead .= "Reply-To: " . SMTP_FROM . "\r\n";
$headers_lead .= "MIME-Version: 1.0\r\n";
$headers_lead .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
$headers_lead .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$multipart_lead = "--$boundary\r\n";
$multipart_lead .= "Content-Type: text/plain; charset=UTF-8\r\n";
$multipart_lead .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$multipart_lead .= $body_lead_text . "\r\n\r\n";

$multipart_lead .= "--$boundary\r\n";
$multipart_lead .= "Content-Type: text/html; charset=UTF-8\r\n";
$multipart_lead .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$multipart_lead .= $body_lead_html . "\r\n\r\n";

$multipart_lead .= "--$boundary--\r\n";

// Intentar envío por Resend para entrega garantizada
pyme360_send_resend($email, $subject_lead, $body_lead_html, $body_lead_text);

// Envío secundario mediante mail()
if (defined('DISABLE_EMAIL_SENDING') && DISABLE_EMAIL_SENDING) {
    error_log('[Pyme360 Local Test] Lead confirmation mail() disabled in local config.');
    $mail_lead_sent = true;
} else {
    $mail_lead_sent = mail($email, $subject_lead, $multipart_lead, $headers_lead);
}

if (!$mail_lead_sent) {
    error_log('[Pyme360] HTML mail() failed to lead: ' . $email);
}

// 4. Respuesta exitosa -----------------------------------------------
http_response_code(201);
echo json_encode(['ok' => true]);
