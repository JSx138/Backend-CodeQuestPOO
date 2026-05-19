import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email e password são obrigatórios' });
      return;
    }

    const result = await AuthService.login(email, password);
    res.json(result);

  } catch (err) {
    const error = err as Error;

    if (error.message === 'Credenciais inválidas') {
      res.status(401).json({ message: error.message });
      return;
    }

    console.error('[AuthController] login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.params.id)

    if (isNaN(alunoId)) {
      res.status(400).json({ message: 'alunoId é obrigatório' });
      return;
    }

    const result = await AuthService.logout(alunoId);
    res.json(result);
  } catch (error) {
    console.error('[AuthController] logout:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}