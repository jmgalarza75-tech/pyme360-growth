<?php
/**
 * Pyme360 Growth — Lógica de Seguimiento a 5 Días (Inactiva / Dry-Run por defecto)
 *
 * REGLA ESTRICTA: No activar este seguimiento en producción sin autorización expresa
 * y verificación previa de base jurídica, identificación de reservas y exclusiones.
 *
 * Modo por defecto: DRY-RUN (simulación y reporte, no envía correos reales).
 * Para ejecución real (cuando se autorice): php cron-seguimiento-5dias.php --execute
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Acceso denegado: solo ejecutable por línea de comandos (CLI).\n";
    exit(1);
}

$dry_run = true;
if (isset($argv[1]) && $argv[1] === '--execute') {
    $dry_run = false;
}

echo "============================================================\n";
echo "PYME360 GROWTH · SEGUIMIENTO A 5 DÍAS\n";
echo "Modo: " . ($dry_run ? "DRY-RUN (Simulación)" : "EJECUCIÓN REAL") . "\n";
echo "Fecha y hora: " . date('Y-m-d H:i:s') . "\n";
echo "============================================================\n\n";

$config_file = __DIR__ . '/config.php';
if (!file_exists($config_file)) {
    echo "[AVISO] config.php no encontrado en local. Operando en modo simulación de esquema.\n";
    exit(0);
}
require_once $config_file;

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

    // Comprobar si existen las columnas necesarias
    $stmt_check = $pdo->query("SHOW COLUMNS FROM leads LIKE 'followup_sent_at'");
    if ($stmt_check->rowCount() === 0) {
        echo "[INFO] La tabla 'leads' no tiene aún las columnas de seguimiento. Ejecuta schema.sql para habilitarlas.\n";
        exit(0);
    }

    // Buscar leads de autoevaluación con 5 días de antigüedad sin reunión reservada
    $sql = "SELECT id, name, email, business_name, primary_need, recommended_brand, score_100, created_at
            FROM leads
            WHERE booking_status = 'unbooked'
              AND followup_sent_at IS NULL
              AND created_at <= NOW() - INTERVAL 5 DAY
              AND created_at >= NOW() - INTERVAL 12 DAY
            ORDER BY created_at ASC
            LIMIT 50";

    $stmt = $pdo->query($sql);
    $leads = $stmt->fetchAll();

    echo "Candidatos encontrados para recordatorio a 5 días: " . count($leads) . "\n\n";

    foreach ($leads as $lead) {
        echo "- Lead ID {$lead['id']}: {$lead['name']} ({$lead['business_name']} - {$lead['email']}) | Puntuación: {$lead['score_100']}/100\n";

        if (!$dry_run) {
            // Cuando se autorice expresamente, aquí se ejecutará el envío y actualización:
            // $update = $pdo->prepare("UPDATE leads SET followup_sent_at = NOW() WHERE id = :id");
            // $update->execute([':id' => $lead['id']]);
        }
    }

    echo "\nProceso finalizado. Estado: OK.\n";

} catch (Exception $e) {
    echo "[ERROR] " . $e->getMessage() . "\n";
    exit(1);
}
