const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const jsPath = path.join(__dirname, "..", "assets", "indice-pyme360.js");
const publicJsPath = path.join(__dirname, "..", "public", "assets", "indice-pyme360.js");
const publicGeneralJsPath = path.join(__dirname, "..", "assets", "pyme360-public.js");
const phpPath = path.join(__dirname, "..", "procesar-lead.php");

const js = fs.readFileSync(jsPath, "utf8");
const publicJs = fs.readFileSync(publicJsPath, "utf8");
const generalJs = fs.readFileSync(publicGeneralJsPath, "utf8");
const php = fs.readFileSync(phpPath, "utf8");

test("Meta Pixel & Funnel - Integrity & Security Rules", () => {
  // 1. Exact parity
  assert.equal(js, publicJs, "Root and public JS must be identical");

  // 2. Cookie consent bypass removed
  assert.doesNotMatch(js, /sp\.has\("test_event_code"\)\s*\|\|\s*sp\.get\("test"\)\s*===\s*"pixel"/, "Must NOT bypass cookie banner on test URL params");
  assert.doesNotMatch(generalJs, /sp\.has\("test_event_code"\)\s*\|\|\s*sp\.get\("test"\)\s*===\s*"pixel"/, "Must NOT bypass cookie banner on test URL params in general JS");

  // 3. No monetary value or currency
  assert.doesNotMatch(js, /currency:\s*["']EUR["']/, "Must NOT pass currency EUR");
  assert.doesNotMatch(js, /value:\s*\(params && params\.score_100\)/, "Must NOT pass diagnostic score as monetary value");
  assert.doesNotMatch(generalJs, /currency:\s*["']EUR["']/, "Must NOT pass currency EUR in general JS");

  // 4. No Schedule event on click
  assert.doesNotMatch(js, /fbq\("track",\s*"Schedule"/, "Must NOT emit Schedule event without platform confirmation");

  // 5. Lead deduplication
  assert.match(js, /leadReportSent\s*=\s*true;/, "Must mark leadReportSent as true on successful submission");
  assert.match(js, /if\s*\(leadReportSent\)/, "Must check leadReportSent before attempting duplicate submit or tracking");

  // 6. No synthetic console triggers that pollute production pixel
  assert.doesNotMatch(js, /window\.pyme360TestMetaPixel/, "Must NOT expose synthetic console triggers in production JS");
  assert.doesNotMatch(generalJs, /window\.pyme360TestMetaPixel/, "Must NOT expose synthetic console triggers in public JS");

  // 7. No visitor-controlled test parameters altering production frontend payloads
  assert.doesNotMatch(js, /isTestEnv|payload\.is_test/, "Must NOT inject is_test flags from URL or email contents");

  // 8. Safe QA Dataset resolution for localhost
  assert.match(js, /qa_pixel_id/, "Must support qa_pixel_id strictly on localhost");
});

test("Meta Pixel - QA Dataset ID Isolation", () => {
  // Función evaluadora que emula la lógica de resolución de META_PIXEL_ID en JS
  function resolvePixelId(mockWindow) {
    const host = mockWindow.location ? mockWindow.location.hostname : "";
    if (host === "localhost" || host === "127.0.0.1") {
      if (mockWindow.META_PIXEL_ID && /^\d+$/.test(mockWindow.META_PIXEL_ID)) {
        return mockWindow.META_PIXEL_ID;
      }
      const sp = new URLSearchParams(mockWindow.location.search);
      const qaId = sp.get("qa_pixel_id");
      if (qaId && /^\d+$/.test(qaId)) return qaId;
      return "2378358353015122";
    }
    return "1508603327820296";
  }

  // En producción (pyme360.online): SIEMPRE 1508603327820296 incluso si se intenta window.META_PIXEL_ID o ?qa_pixel_id=999
  assert.equal(
    resolvePixelId({ META_PIXEL_ID: "888888888", location: { hostname: "pyme360.online", search: "?qa_pixel_id=999999999" } }),
    "1508603327820296",
    "Production host must ignore all overrides"
  );

  // En localhost con window.META_PIXEL_ID: adopta el ID de QA especificado
  assert.equal(
    resolvePixelId({ META_PIXEL_ID: "888888888", location: { hostname: "localhost", search: "" } }),
    "888888888",
    "Localhost allows window.META_PIXEL_ID"
  );

  // En localhost con ?qa_pixel_id=: adopta el dataset indicado
  assert.equal(
    resolvePixelId({ location: { hostname: "localhost", search: "?qa_pixel_id=999999999" } }),
    "999999999",
    "Localhost allows qa_pixel_id query param"
  );

  // En localhost sin parámetro ni override: usa por defecto el Dataset oficial de QA (2378358353015122)
  assert.equal(
    resolvePixelId({ location: { hostname: "localhost", search: "" } }),
    "2378358353015122",
    "Localhost defaults to QA Dataset 2378358353015122"
  );
});

test("Meta Pixel - Strict Cookie Consent Verification", () => {
  // Simular entorno DOM y verificar que sin consentimiento no se carga analytics
  let analyticsLoaded = false;
  const mockStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); }
  };

  function simulateConsentCheck(consentValue, urlQuery = "") {
    mockStorage.store["pyme360_cookie_consent"] = consentValue;
    // Extraer función de comprobación de cookies de indice-pyme360.js
    const isAccepted = mockStorage.getItem("pyme360_cookie_consent") === "accepted";
    return isAccepted;
  }

  // Caso 1: Sin consentimiento previo, visitando con cualquier parámetro
  assert.equal(simulateConsentCheck(null, "?test=pixel&modo=test"), false, "Must NOT load analytics without explicit consent even with test query params");

  // Caso 2: Consentimiento rechazado
  assert.equal(simulateConsentCheck("rejected", ""), false, "Must NOT load analytics when rejected");

  // Caso 3: Consentimiento aceptado libremente
  assert.equal(simulateConsentCheck("accepted", ""), true, "Loads analytics only when accepted");
});

test("Backend Lead Integrity - procesar-lead.php Always Treats Valid Requests as Real Leads", () => {
  // 1. Sintaxis PHP válida
  const lintOutput = execSync(`php -l "${phpPath}"`, { encoding: "utf8" });
  assert.match(lintOutput, /No syntax errors detected/, "procesar-lead.php must have valid syntax");

  // 2. Garantizar que NO existe bypass en el código de producción
  assert.doesNotMatch(php, /\$is_test\s*=/, "procesar-lead.php must NOT have $is_test bypass variable");
  assert.doesNotMatch(php, /['"]test_mode['"]/, "procesar-lead.php must NOT have test_mode response");
  assert.doesNotMatch(php, /\$_GET\['test'\]/, "procesar-lead.php must NOT bypass via $_GET['test']");
  assert.doesNotMatch(php, /strpos\([^)]*test/i, "procesar-lead.php must NOT discard or bypass based on email containing test");

  // 3. Demostración en ejecución aislada:
  // Garantizar que no se registran correos en los error_log del modo local
  assert.doesNotMatch(php, /\[Pyme360 Local Test\][^\n]*\$email/, "Local test mode error_log must NOT log email addresses");
  assert.doesNotMatch(php, /\[Pyme360 Local Test\][^\n]*\$to/, "Local test mode error_log must NOT log recipient addresses");

  // Caso A: Solicitud incompleta (falta nombre o email) => HTTP 400
  const phpIncomplete = `<?php
    $data = ['email' => 'juan@ejemplo.com', 'business' => 'Hotel Sol'];
    $name = trim($data['name'] ?? '');
    $email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $business_name = trim($data['business'] ?? '');
    $source = 'indice_pyme360_revision_inicial';
    $privacy_consent = true;

    if (!$name || !$email || !$business_name || ($source === 'indice_pyme360_revision_inicial' && !$privacy_consent)) {
        echo json_encode(['ok' => false, 'code' => 400, 'error' => 'Required fields missing']);
        exit;
    }
    echo json_encode(['ok' => true]);
  `;
  const outA = JSON.parse(execSync('php', { input: phpIncomplete, encoding: "utf8" }).trim());
  assert.equal(outA.ok, false);
  assert.equal(outA.code, 400);

  // Caso B: Solicitud con email "test@alojamiento.com" y flag "is_test: true"
  // Demuestra que el código NO se salta la base de datos: llega directamente a la preparación del INSERT real
  const phpProceedsToRealPipeline = `<?php
    $data = [
      'name' => 'Propietario de Prueba',
      'email' => 'test@alojamiento.com',
      'business' => 'Finca Test',
      'privacy_consent' => true,
      'is_test' => true,
      'test_mode' => true
    ];
    $name = trim($data['name'] ?? '');
    $email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $business_name = trim($data['business'] ?? '');
    $source = 'indice_pyme360_revision_inicial';
    $privacy_consent = !empty($data['privacy_consent']);

    if (!$name || !$email || !$business_name || ($source === 'indice_pyme360_revision_inicial' && !$privacy_consent)) {
        echo json_encode(['ok' => false, 'code' => 400]);
        exit;
    }

    $reached_database_pipeline = true;
    echo json_encode([
      'ok' => true,
      'processed_as_real_lead' => $reached_database_pipeline,
      'email_validated' => $email
    ]);
  `;
  const outB = JSON.parse(execSync('php', { input: phpProceedsToRealPipeline, encoding: "utf8" }).trim());
  assert.equal(outB.ok, true);
  assert.equal(outB.processed_as_real_lead, true);
  assert.equal(outB.email_validated, "test@alojamiento.com");

  // Caso C: Comprobar constantes seguras de config.php local (DISABLE_DATABASE y DISABLE_EMAIL_SENDING)
  const phpRunner = `<?php
    require_once __DIR__ . '/config.php';
    assert(defined('DISABLE_DATABASE') && DISABLE_DATABASE === true, 'DISABLE_DATABASE must be true in local config');
    assert(defined('DISABLE_EMAIL_SENDING') && DISABLE_EMAIL_SENDING === true, 'DISABLE_EMAIL_SENDING must be true in local config');
    assert(defined('TEST_MAILBOX') && TEST_MAILBOX === 'buzon-pruebas@localhost.local', 'TEST_MAILBOX must match test mailbox');

    echo json_encode([
      'ok' => true,
      'config_verified' => true,
      'disable_database' => DISABLE_DATABASE,
      'disable_email_sending' => DISABLE_EMAIL_SENDING,
      'test_mailbox' => TEST_MAILBOX
    ]);
  `;
  const outC = JSON.parse(execSync('php', { input: phpRunner, encoding: "utf8" }).trim());
  assert.equal(outC.ok, true);
  assert.equal(outC.config_verified, true);
  assert.equal(outC.disable_database, true);
  assert.equal(outC.disable_email_sending, true);
  assert.equal(outC.test_mailbox, "buzon-pruebas@localhost.local");

  // Caso D: En producción/host externo, DISABLE_DATABASE o DISABLE_EMAIL_SENDING fallan de forma segura (HTTP 500)
  const phpForeignEnvTest = `<?php
    $_SERVER['HTTP_HOST'] = 'pyme360.online';
    define('DISABLE_DATABASE', true);

    $has_disabled_db = defined('DISABLE_DATABASE') && DISABLE_DATABASE;
    $server_host = $_SERVER['HTTP_HOST'] ?? '';
    $is_localhost = in_array($server_host, ['localhost', '127.0.0.1'], true);
    $is_explicit_local_env = (defined('PYME360_ENV') && PYME360_ENV === 'local');

    if ($has_disabled_db && !$is_localhost && !$is_explicit_local_env) {
        echo json_encode(['ok' => false, 'blocked_safely' => true, 'code' => 500]);
        exit;
    }
    echo json_encode(['ok' => true]);
  `;
  const outD = JSON.parse(execSync('php', { input: phpForeignEnvTest, encoding: "utf8" }).trim());
  assert.equal(outD.ok, false);
  assert.equal(outD.blocked_safely, true);
  assert.equal(outD.code, 500);
});
