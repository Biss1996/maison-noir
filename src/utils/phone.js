export function normalizePhone(phone) {
  let p = phone.replace(/\D/g, "");

  // 0712345678 -> 254712345678
  if (p.startsWith("0")) {
    p = "254" + p.slice(1);
  }

  // 712345678 -> 254712345678
  else if (p.length === 9 && p.startsWith("7")) {
    p = "254" + p;
  }

  // Already normalized
  if (!p.startsWith("254") || p.length !== 12) {
    throw new Error("Invalid Kenyan phone number");
  }

  return p;
}

export function phoneToEmail(phone) {
  return `${normalizePhone(phone)}@maisonnoir.app`;
}