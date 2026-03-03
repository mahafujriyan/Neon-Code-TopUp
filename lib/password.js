import crypto from "crypto";

const ITERATIONS = 120000;
const KEYLEN = 64;
const DIGEST = "sha512";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");

  return { salt, hash };
}

export function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) return false;

  const candidate = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
