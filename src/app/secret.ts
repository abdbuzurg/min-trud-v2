import jwt, { SignOptions } from "jsonwebtoken"

export const JWT_SECRET = "mintrudjwtsecret2025"

export function createToken(phoneNumber: string): string {
  const payload = { phoneNumber: phoneNumber }
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '60m',
    issuer: 'min-trud',
    audience: 'job-seeker',
  };

  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'min-trud',
    audience: 'job-seeker',
  }) as jwt.JwtPayload;
}
