import crypto from "crypto";

const used = new Set<string>();

export function random(): string {
  const result = Math.random().toString(36).substring(2);
  return used.has(result) ? random() : result;
}

export function randomLength(length: number): string {
  //   return crypto
  //     .getRandomValues(new Uint8Array(length))
  //     .reduce((p, i) => p + (i % 36).toString(36), "");
  const result = crypto.randomBytes(length).toString("hex");
  return used.has(result) ? randomLength(length) : result;
}
