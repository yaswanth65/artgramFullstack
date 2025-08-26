import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const sign = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '24h' }); // Reduced from 30d to 24h for security
};

export const verify = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.verify(token, secret) as TokenPayload;
};

export const generateRefreshToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};
