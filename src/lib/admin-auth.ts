import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const PASSWORD_KEY_LENGTH = 64;

type AdminSession = {
  adminId: string;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function derivePasswordKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      PASSWORD_KEY_LENGTH,
      { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

export const ADMIN_COOKIE_NAME = "taban_admin_session";
export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_SECONDS;

export function isAdminSessionConfigured() {
  return getSessionSecret() !== null;
}

export function shouldUseSecureCookie(request: Request) {
  return new URL(request.url).protocol === "https:";
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await derivePasswordKey(password, salt);
  return `scrypt$16384$8$1$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyAdminPassword(password: string, storedHash: string) {
  const [algorithm, cost, blockSize, parallelization, encodedSalt, encodedHash, extra] =
    storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    cost !== "16384" ||
    blockSize !== "8" ||
    parallelization !== "1" ||
    !encodedSalt ||
    !encodedHash ||
    extra !== undefined
  ) {
    return false;
  }

  const salt = Buffer.from(encodedSalt, "base64url");
  const expectedHash = Buffer.from(encodedHash, "base64url");

  if (salt.length !== 16 || expectedHash.length !== PASSWORD_KEY_LENGTH) {
    return false;
  }

  const actualHash = await derivePasswordKey(password, salt);
  return timingSafeEqual(actualHash, expectedHash);
}

export function createAdminSessionToken(adminId: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }

  const session: AdminSession = {
    adminId,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined): AdminSession | null {
  const secret = getSessionSecret();
  if (!secret || !token) {
    return null;
  }

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const session: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof session !== "object" ||
      session === null ||
      !("adminId" in session) ||
      typeof session.adminId !== "string" ||
      !("expiresAt" in session) ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { adminId: session.adminId, expiresAt: session.expiresAt };
  } catch {
    return null;
  }
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}
