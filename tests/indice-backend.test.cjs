const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const php = fs.readFileSync(path.join(__dirname, "..", "procesar-lead.php"), "utf8");

assert.match(php, /\$website\s*=\s*clean\(\$data\['website'\]/, "backend should accept website from Índice form");
assert.match(php, /\$units\s*=\s*clean\(\$data\['units'\]/, "backend should accept units from Índice form");
assert.match(php, /\$source\s*=\s*clean\(\$data\['source'\]/, "backend should accept source/origin");
assert.match(php, /\$newsletter_consent\s*=\s*!empty\(\$data\['newsletter_consent'\]\)/, "backend should read newsletter consent separately");
assert.match(php, /\$privacy_consent\s*=\s*!empty\(\$data\['privacy_consent'\]\)/, "backend should read privacy consent separately");
assert.match(php, /\$source === 'indice_pyme360_revision_inicial'/, "backend should branch for Índice leads");
assert.match(php, /Origen: Índice Pyme360® - revisión inicial/, "backend should preserve Índice origin in stored problem context");
assert.match(php, /Web: ' \. \$website/, "backend should preserve website context without requiring a new DB column");
assert.match(php, /Habitaciones\/unidades: ' \. \$units/, "backend should preserve units context without requiring a new DB column");
assert.match(php, /\$source === 'indice_pyme360_revision_inicial' && !\$privacy_consent/, "backend should enforce privacy consent for Índice leads");
assert.doesNotMatch(php, /!\$name \|\| !\$email \|\| !\$phone \|\| !\$business_name/, "phone must not be required server-side");
assert.match(php, /\$phone \?: 'No facilitado'/, "internal email should handle empty phone");
assert.match(php, /\$contact_sentence_text = \$phone[\s\S]*por los datos facilitados/, "lead confirmation text should handle empty phone");
assert.match(php, /if \(!\$mail_sent\)[\s\S]*error_log\('\[Pyme360\] mail\(\) failed for lead:/, "internal mail failure should be logged after the lead is stored");
assert.match(php, /if \(!\$mail_lead_sent\)[\s\S]*error_log\('\[Pyme360\] HTML mail\(\) failed to lead:/, "lead confirmation mail failure should be logged after the lead is stored");

console.log("indice backend tests passed");
