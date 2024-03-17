const SECRET = process.env.NEXTAUTH_SECRET;
export function verifySecretRequest(secret: string) {
  return secret === SECRET;
}

export function chosenSecret() {
  return SECRET ?? "";
}
