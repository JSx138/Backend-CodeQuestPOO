import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Aluno } from "../../Models/index.js";

function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) return null;

  return token;
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Token não enviado." });
    }

    const secret =
      process.env.JWT_SECRET ||
      process.env.JWT_TOKEN ||
      process.env.SECRET_KEY ||
      process.env.SECRET ||
      "codequest-secret";

    const payload = jwt.verify(token, secret) as any;

    const alunoId =
      payload.id ||
      payload.aluno_id ||
      payload.alunoId ||
      payload.userId;

    if (!alunoId) {
      return res.status(401).json({ message: "Token inválido." });
    }

    const aluno = await Aluno.findByPk(alunoId);

    if (!aluno) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    const alunoPlain = aluno.get({ plain: true }) as any;

    if (!alunoPlain.is_admin) {
      return res.status(403).json({
        message: "Acesso negado. Apenas administradores podem aceder.",
      });
    }

    (req as any).user = alunoPlain;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}