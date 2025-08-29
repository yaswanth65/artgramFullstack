import * as jwt from 'jsonwebtoken';

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
  return jwt.sign(payload, secret, { expiresIn: '7d' }); // Increased from 24h to 7d for better UX
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
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// Check if token is close to expiry (within 1 day)
export const isTokenNearExpiry = (token: string): boolean => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return true;
    
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const now = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - now;
    const oneDayInSeconds = 24 * 60 * 60;
    
    return timeUntilExpiry < oneDayInSeconds;
  } catch (error) {
    return true;
  }
};

// Refresh token if it's close to expiry
export const refreshIfNeeded = (token: string, payload: TokenPayload): string => {
  if (isTokenNearExpiry(token)) {
    return sign(payload);
  }
  return token;
};
