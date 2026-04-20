import "dotenv/config";

const required = ["AUTH0_SECRET", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"];

function normalizeDomain(value) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).hostname;
    } catch {
      return null;
    }
  }
  return value;
}

function hasValue(name) {
  return Boolean(process.env[name] && process.env[name].trim());
}

function printLine(msg) {
  process.stdout.write(`${msg}\n`);
}

const missing = required.filter((name) => !hasValue(name));
const rawDomain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL || "";
const normalizedDomain = normalizeDomain(rawDomain);
const appBaseUrl = process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || "";

printLine("Auth0 config validation (SDK v4 semantics)");
printLine("----------------------------------------");

if (missing.length) {
  printLine(`Missing required env vars: ${missing.join(", ")}`);
} else {
  printLine("Required credentials are present.");
}

if (!rawDomain) {
  printLine("Missing domain source: set AUTH0_DOMAIN (preferred) or AUTH0_ISSUER_BASE_URL.");
} else if (!normalizedDomain) {
  printLine("Domain value is not parseable. Use a hostname or https://<tenant>.auth0.com.");
} else {
  printLine(`Resolved SDK domain: ${normalizedDomain}`);
}

if (!appBaseUrl) {
  printLine("No APP_BASE_URL/AUTH0_BASE_URL set; SDK will infer host at runtime.");
} else {
  try {
    const parsed = new URL(appBaseUrl);
    printLine(`Resolved app base URL: ${parsed.origin}`);
  } catch {
    printLine("APP_BASE_URL/AUTH0_BASE_URL is not a valid absolute URL.");
  }
}

if (missing.length || !normalizedDomain) {
  process.exitCode = 1;
  printLine("Result: INVALID");
} else {
  printLine("Result: VALID");
}
