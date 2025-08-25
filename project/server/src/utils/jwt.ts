import jwt from 'jsonwebtoken';

export const sign = (payload: object) => jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
