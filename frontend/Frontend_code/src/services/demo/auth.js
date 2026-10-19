// Browser-only demo authentication. Production credentials must be verified by the API.
const iterations = 100000;
const hex = bytes => Array.from(bytes, x => x.toString(16).padStart(2, "0")).join("");
export const normalizeEmail = email => String(email || "").trim().toLowerCase();
export function publicUser({ passwordHash, passwordSalt, ...user }) { return user; }
export async function passwordDigest(password, salt) {
  if (!globalThis.crypto?.subtle) throw Error("Demo authentication requires HTTPS or localhost.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bytes = Uint8Array.from(salt.match(/../g), byte => parseInt(byte, 16));
  return hex(new Uint8Array(await crypto.subtle.deriveBits({name: "PBKDF2", salt: bytes, iterations, hash: "SHA-256"}, key, 256)));
}
export async function authenticate(users, email, password) {
  const account = users.find(u => normalizeEmail(u.email) === normalizeEmail(email));
  if (!account || await passwordDigest(password, account.passwordSalt) !== account.passwordHash)
    throw Error("Incorrect email or password.");
  if (!account.active) throw Error("This account is suspended. Contact the administrator.");
  return publicUser(account);
}
export async function createAccount(payload) {
  const email = normalizeEmail(payload.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error("Enter a valid business email.");
  if (!payload.password || payload.password.length < 8) throw Error("Use at least 8 characters for your password.");
  if (!["buyer", "supplier"].includes(payload.role)) throw Error("Choose a buyer or supplier account.");
  for (const key of ["name", "companyName", "taxId", "country"]) if (!String(payload[key] || "").trim()) throw Error("Complete all required company and account fields.");
  const passwordSalt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return { id: crypto.randomUUID(), name: payload.name.trim(), email, companyName: payload.companyName.trim(), taxId: payload.taxId.trim(), country: payload.country, phone: payload.phone || "", role: payload.role, active: true, passwordSalt, passwordHash: await passwordDigest(payload.password, passwordSalt) };
}
