export function isValidPhone(phone) {
  return typeof phone === "string" && /^\d{10}$/.test(phone);
}

export function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 2;
}
