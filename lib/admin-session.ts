import { createHmac, timingSafeEqual } from "crypto";

export const sessionCookie = "imerge_admin";
const sessionMaxAge = 60 * 60 * 12;

const secret = () => process.env.IMERGE_ADMIN_SESSION_SECRET || "";
const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");
const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export function credentialsAreConfigured() {
  return Boolean(process.env.IMERGE_ADMIN_USER && process.env.IMERGE_ADMIN_PASSWORD && secret());
}

export function validCredentials(user: unknown, password: unknown) {
  if (!credentialsAreConfigured() || typeof user !== "string" || typeof password !== "string") return false;
  return safeEqual(user, process.env.IMERGE_ADMIN_USER!) && safeEqual(password, process.env.IMERGE_ADMIN_PASSWORD!);
}

export function createSession() {
  const expires = Math.floor(Date.now() / 1000) + sessionMaxAge;
  const payload = `imerge-admin.${expires}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: sessionMaxAge };
}

export function validSession(value?: string) {
  if (!value || !secret()) return false;
  const [name, expires, signature] = value.split(".");
  const payload = `${name}.${expires}`;
  return name === "imerge-admin" && Number(expires) > Math.floor(Date.now() / 1000) && Boolean(signature) && safeEqual(signature, sign(payload));
}
