const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const php = fs.readFileSync(path.join(root, "webhook-resend.php"), "utf8");
const htaccess = fs.readFileSync(path.join(root, ".htaccess"), "utf8");
const examplePath = path.join(root, "pyme360-secrets.example.php");

assert.doesNotMatch(
  php,
  /\$SHARED_SECRET\s*=\s*['"][^'"]+['"];/,
  "webhook must not contain a hard-coded shared secret"
);
assert.match(php, /pyme360-secrets\.php/, "webhook should support a server-only secret file");
assert.match(php, /RESEND_PULL_SECRET/, "webhook should load the pull secret by name");
assert.match(php, /RESEND_WEBHOOK_SECRET/, "webhook should load the webhook secret by name");
assert.match(php, /\$action\s*===\s*['"]pull['"]/, "pull must use an explicit POST action");
assert.match(php, /\$action\s*===\s*['"]ack['"]/, "ack must use an explicit POST action");
assert.match(php, /snapshot_id/, "ack must be bound to a snapshot id");
assert.match(php, /X-Pyme360-Pull-Token/, "pull and ack must use the authenticated header");
assert.doesNotMatch(php, /\$_GET\s*\[\s*['"]pull['"]\s*\]/, "pull must not use a query-string secret");
assert.doesNotMatch(php, /clear\s*=\s*1|['"]clear['"]\s*\]/, "pull must not expose a destructive clear parameter");

assert.match(htaccess, /<Files\s+["']webhook-resend\.php["']>[\s\S]*?Require all granted/, "webhook PHP must reach its own authentication");
assert.match(htaccess, /<Files\s+["']eventos\.jsonl["']>[\s\S]*?Require all denied/, "event store must remain private");
assert.match(htaccess, /<Files\s+["']bajas\.csv["']>[\s\S]*?Require all denied/, "unsubscribe store must remain private");
assert.match(htaccess, /<Files\s+["']pyme360-secrets\.php["']>[\s\S]*?Require all denied/, "server-only secrets must be denied over HTTP");

assert.equal(fs.existsSync(examplePath), true, "a non-secret server configuration template must exist");
const example = fs.readFileSync(examplePath, "utf8");
assert.match(example, /REPLACE_WITH_A_NEW_PULL_SECRET/);
assert.match(example, /REPLACE_WITH_RESEND_WEBHOOK_SIGNING_SECRET/);

console.log("webhook-resend contract tests passed");
