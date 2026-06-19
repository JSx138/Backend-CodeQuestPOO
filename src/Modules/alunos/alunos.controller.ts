import { Request, Response } from 'express';
import { AlunosService } from './alunos.service.js';

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
      escola, ano, ano_letivo, avatar_id, mentor_id
    } = req.body;

    if (!nome || !email || !password || !numero || !turma || !escola || !ano || !ano_letivo) {
      res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      return;
    }

    const aluno = await AlunosService.criarAluno({
      nome, email, password, numero, turma,
      escola, ano, ano_letivo, avatar_id, mentor_id
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
    const alunoId = Number((req as any).alunoId);

    if (isNaN(alunoId)) {
      res.status(400).json({ message: 'alunoId é obrigatório' });
      return;
    }

    const aluno = await AlunosService.getMe(alunoId);
    res.json(aluno);
  } catch (err) {
    const error = err as Error;
    console.error('[AlunosController] obter aluno atual:', error);
    res.status(500).json({ error: error.message });
  }
};

export const atualizarPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number((req as any).alunoId);

    if (isNaN(alunoId)) {
      res.status(400).json({ message: 'alunoId é obrigatório' });
      return;
    }

    const { nome, turma, escola, mentor_id } = req.body;

    if (!nome || !String(nome).trim()) {
      res.status(400).json({ message: 'O nome é obrigatório' });
      return;
    }

    const aluno = await AlunosService.atualizarPerfil(alunoId, {
      nome: String(nome).trim(),
      turma,
      escola,
      mentor_id: mentor_id ? Number(mentor_id) : null
    });

    res.json(aluno);
  } catch (err) {
    const error = err as Error;
    console.error('[AlunosController] atualizarPerfil:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAlunoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.params.id);

    if (isNaN(alunoId)) {
      res.status(400).json({ message: 'alunoId é obrigatório' });
      return;
    }

    const aluno = await AlunosService.getById(alunoId);
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar aluno por Id" });
  }
};

export const atualizarOnline = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number((req as any).alunoId);

    if (isNaN(alunoId)) {
      res.status(400).json({ message: "alunoId é obrigatório" });
      return;
    }

    const resultado = await AlunosService.atualizarUltimoAcesso(alunoId);
    res.json(resultado);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
};