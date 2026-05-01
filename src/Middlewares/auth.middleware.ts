import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../Utils/jwt';

export interface AuthRequest extends Request {
  alunoId?: number;
}

interface JwtPayload {
  id: number;
  email: string;
}

const verificarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;

    req.alunoId = decoded.id;
    next();

  } catch (err) {
    const error = err as Error;
    res.status(401).json({
      error: 'Token inválido',
      details: error.message
    });
  }
};

export default verificarToken;