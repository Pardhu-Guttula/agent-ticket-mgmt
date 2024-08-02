import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

interface Payload {
  id: string;
  email: string;
}

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): Payload | null => {
  try {
    return jwt.verify(token, secret) as Payload;
  } catch (error) {
    return null;
  }
};
