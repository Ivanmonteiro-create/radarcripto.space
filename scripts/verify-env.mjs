// scripts/verify-env.mjs
import "dotenv/config";

const required = ["NEXT_PUBLIC_SITE_URL"];
let missing = [];

for (const key of required) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error("❌ Missing env vars:", missing.join(", "));
  process.exit(1);
} else {
  console.log("✅ All required env vars present.");
}
