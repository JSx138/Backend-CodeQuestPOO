import { Request, Response } from 'express';
import { AlunosService } from './alunos.service.js';
import { handleError } from '../../Utils/error.js';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunos = await AlunosService.getAllAlunos();
    res.json(alunos);
  } catch (err) {
    const error = err as Error;
    console.error('[AlunosController] getAll:', error);
    res.status(500).json({ error: error.message });
  }
};

export const criar = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nome, email, password, numero, turma,
      escola, ano, ano_letivo, avatar_id, heroi_id
    } = req.body;

    if (!nome || !email || !password || !numero || !turma || !escola || !ano || !ano_letivo) {
      res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      return;
    }

    const aluno = await AlunosService.criarAluno({
      nome, email, password, numero, turma,
      escola, ano, ano_letivo, avatar_id, heroi_id
    });

    res.status(201).json(aluno);
  } catch (err) {
    const error = err as Error;
    console.error('[AlunosController] criar:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId!)

    if (isNaN(alunoId)) {
      res.status(400).json({ message: 'alunoId é obrigatório' });
    }

    const aluno = await AlunosService.getMe(alunoId);
    res.json(aluno);
  } catch (err) {
    const error = err as Error;
    console.error('[AlunosController] obter aluno atual:', err);
    res.status(500).json({ error: error.message });
  }
}

export const getAlunoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.params.id);

    if (isNaN(alunoId)) {
      res.status(400).json({ message: 'alunoId é obrigatório' });
    }

    const aluno = AlunosService.getById(alunoId);
    res.json(aluno);

  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar aluno por Id" });
  }
}