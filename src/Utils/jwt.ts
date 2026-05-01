import jwt from "jsonwebtoken"

function getSecret(): string {
  const secret = process.env.JWT_SECRET || 'trocar_este_secret_em_producao';
  return secret;
}

export function generateToken(payload: object) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "1d"
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getSecret());
}