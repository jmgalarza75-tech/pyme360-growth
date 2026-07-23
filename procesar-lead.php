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
function clean($value): string {
    return htmlspecialchars(trim((string)$value), ENT_QUOTES, 'UTF-8');
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

// Buscar "problem" dentro de critical_errors si viene con la estructura de Supabase
$problem_raw = $data['problem'] ?? ($data['critical_errors']['problem'] ?? '');
$problem     = clean($problem_raw);

if ($source === 'indice_pyme360_revision_inicial') {
    $indice_context = [];
    $indice_context[] = 'Origen: Índice Pyme360® - revisión inicial';
    if ($website) $indice_context[] = 'Web: ' . $website;
    if ($units) $indice_context[] = 'Habitaciones/unidades: ' . $units;
    $indice_context[] = 'Newsletter: ' . ($newsletter_consent ? 'Sí' : 'No');
    $indice_context[] = 'Privacidad: ' . ($privacy_consent ? 'Aceptada' : 'No aceptada');
    $problem = trim($problem . "\n\n" . implode("\n", $indice_context));
}

// Validación mínima. El teléfono es opcional para la landing del Índice.
if (!$name || !$email || !$business_name || ($source === 'indice_pyme360_revision_inicial' && !$privacy_consent)) {
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
$body .= "Teléfono:     " . ($phone ?: 'No facilitado') . "\n";
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

// 3. Enviar email de confirmación al lead (Multipart HTML + Texto) --------
$subject_lead = "Hemos recibido tu solicitud | Pyme360 Growth";
$anio = date('Y');
$newsletter_url = "https://open.substack.com/pub/alojamente/p/newsletter-extraordinaria-airbnb?r=5sdrqo&utm_campaign=post&utm_medium=web"; // <-- AlojaMente
$contact_sentence_text = $phone
    ? "En un plazo máximo de 48 horas laborables nos pondremos en contacto contigo en el teléfono {$phone}."
    : "En un plazo máximo de 48 horas laborables nos pondremos en contacto contigo por los datos facilitados.";
$contact_sentence_html = $phone
    ? 'En un plazo máximo de <strong>48 horas laborables</strong> nos pondremos en contacto contigo en el teléfono <strong>' . $phone . '</strong>.'
    : 'En un plazo máximo de <strong>48 horas laborables</strong> nos pondremos en contacto contigo por los datos facilitados.';

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

Un saludo,

Teo Rubio
Pyme360 Growth

P. D. Antes de llamarte revisaremos tu web y tu presencia digital para poder darte recomendaciones concretas desde el primer contacto.";

$body_lead_html = '<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hemos recibido tu solicitud | Pyme360 Growth</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f5; font-family:Arial, Helvetica, sans-serif; color:#1f2933;">

  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Hemos recibido tu solicitud. Revisaremos tu negocio y contactaremos contigo en un plazo máximo de 48 horas laborables.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f6f5;">
    <tr>
      <td align="center" style="padding:28px 12px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
               style="max-width:640px; background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 24px rgba(20,40,30,0.08);">

          <!-- Cabecera -->
          <tr>
            <td style="background-color:#183c34; padding:30px 34px; text-align:center;">
              
              <!-- Sustituir por logo si está disponible -->
              <div style="font-size:27px; line-height:1.2; font-weight:700; color:#ffffff; letter-spacing:-0.5px;">
                Pyme<span style="color:#74c69d;">360</span>
              </div>

              <div style="margin-top:6px; font-size:13px; line-height:1.4; color:#cce7d8; letter-spacing:1.5px; text-transform:uppercase;">
                Growth
              </div>

            </td>
          </tr>

          <!-- Contenido principal -->
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

              <!-- Confirmación de contacto -->
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

          <!-- Bloque de autoridad y experiencia -->
          <tr>
            <td style="padding:12px 36px 18px 36px;">

              <h2 style="margin:0 0 18px 0; font-size:22px; line-height:1.3; color:#183c34; font-weight:700;">
                ¿Quién hay detrás de Pyme360 Growth?
              </h2>

              <p style="margin:0 0 17px 0; font-size:16px; line-height:1.65; color:#374151;">
                Pyme360 Growth nace de la experiencia real dentro del sector turístico y empresarial.
              </p>

              <p style="margin:0 0 17px 0; font-size:16px; line-height:1.65; color:#374151;">
                Nuestro equipo ha trabajado tanto en la dirección y gestión operativa como en la comercialización de:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="margin:6px 0 24px 0;">
                <tr>
                  <td width="50%" valign="top" style="padding:5px 10px 5px 0;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Hoteles y hoteles rurales
                    </p>
                  </td>
                  <td width="50%" valign="top" style="padding:5px 0 5px 10px;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Viviendas vacacionales
                    </p>
                  </td>
                </tr>

                <tr>
                  <td width="50%" valign="top" style="padding:5px 10px 5px 0;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Apartamentos turísticos
                    </p>
                  </td>
                  <td width="50%" valign="top" style="padding:5px 0 5px 10px;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Gestión de reservas
                    </p>
                  </td>
                </tr>

                <tr>
                  <td width="50%" valign="top" style="padding:5px 10px 5px 0;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Revenue Management
                    </p>
                  </td>
                  <td width="50%" valign="top" style="padding:5px 0 5px 10px;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Atención al huésped
                    </p>
                  </td>
                </tr>

                <tr>
                  <td width="50%" valign="top" style="padding:5px 10px 5px 0;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Marketing turístico
                    </p>
                  </td>
                  <td width="50%" valign="top" style="padding:5px 0 5px 10px;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#374151;">
                      ✓ Automatización de procesos
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Esta experiencia nos permite comprender los problemas reales del día a día: dependencia de las plataformas,
                falta de reservas directas, tareas repetitivas, pérdida de oportunidades comerciales y dificultad para hacer seguimiento de cada cliente.
              </p>

            </td>
          </tr>

          <!-- Bloque destacado Pyme360 Growth -->
          <tr>
            <td style="padding:8px 36px 28px 36px;">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#183c34; border-radius:12px;">
                <tr>
                  <td style="padding:28px 26px;">

                    <div style="font-size:12px; line-height:1.4; color:#89d1ab; text-transform:uppercase; letter-spacing:1.4px; font-weight:700; margin-bottom:9px;">
                      Pyme360 Growth
                    </div>

                    <h2 style="margin:0 0 14px 0; font-size:23px; line-height:1.3; color:#ffffff; font-weight:700;">
                      No hacemos ruido. Construimos sistemas de crecimiento.
                    </h2>

                    <p style="margin:0 0 19px 0; font-size:15px; line-height:1.7; color:#d7e9df;">
                      No queremos añadir más publicaciones, más herramientas o más tareas a tu negocio.
                      Diseñamos sistemas para atraer oportunidades, convertirlas en clientes y hacer seguimiento de forma ordenada.
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding:6px 0;">
                          <p style="margin:0; font-size:15px; line-height:1.55; color:#ffffff;">
                            <strong>Webs orientadas a conversión</strong><br>
                            <span style="color:#c9ded3;">Páginas diseñadas para transformar visitas en solicitudes, reservas o ventas.</span>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0 6px 0;">
                          <p style="margin:0; font-size:15px; line-height:1.55; color:#ffffff;">
                            <strong>Google Local</strong><br>
                            <span style="color:#c9ded3;">Mejoramos la visibilidad del negocio cuando un cliente busca servicios en su zona.</span>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0 6px 0;">
                          <p style="margin:0; font-size:15px; line-height:1.55; color:#ffffff;">
                            <strong>CRM y automatización</strong><br>
                            <span style="color:#c9ded3;">Organizamos los contactos y automatizamos el seguimiento para reducir oportunidades perdidas.</span>
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Newsletter -->
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

          <!-- Cierre y firma -->
          <tr>
            <td style="padding:4px 36px 36px 36px;">

              <p style="margin:0 0 18px 0; font-size:16px; line-height:1.65; color:#374151;">
                Muchas gracias por confiar en nosotros.
              </p>

              <p style="margin:0 0 24px 0; font-size:16px; line-height:1.65; color:#374151;">
                Hablamos muy pronto.
              </p>

              <p style="margin:0; font-size:16px; line-height:1.55; color:#183c34;">
                Un saludo,<br>
                <strong>Teo Rubio</strong><br>
                <span style="font-size:14px; color:#637067;">Pyme360 Growth</span>
              </p>

              <p style="margin:24px 0 0 0; padding-top:20px; border-top:1px solid #e5e7eb; font-size:14px; line-height:1.6; color:#6b7280;">
                <strong>P. D.</strong> Antes de llamarte revisaremos tu web y tu presencia digital para aprovechar al máximo la conversación y poder darte recomendaciones concretas desde el primer contacto.
              </p>

            </td>
          </tr>

          <!-- Pie -->
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

$boundary = md5(uniqid(time()));

$headers_lead  = "From: =?UTF-8?B?" . base64_encode("Teo · Pyme360 Growth") . "?= <" . SMTP_FROM . ">\r\n";
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

$mail_lead_sent = mail($email, $subject_lead, $multipart_lead, $headers_lead);

if (!$mail_lead_sent) {
    error_log('[Pyme360] HTML mail() failed to lead: ' . $email);
}

// 4. Respuesta exitosa -----------------------------------------------
http_response_code(201);
echo json_encode(['ok' => true]);
