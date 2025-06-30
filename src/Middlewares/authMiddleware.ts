import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) : any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
