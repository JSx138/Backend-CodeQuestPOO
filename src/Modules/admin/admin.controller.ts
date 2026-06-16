import { Request, Response } from "express";
import * as adminService from "./admin.service.js";

export async function getDashboard(req: Request, res: Response) {
  try {
    const dashboard = await adminService.getDashboard();
    return res.status(200).json(dashboard);
  } catch (error: any) {
    return res.status(500).json({
      message: "Erro ao carregar dashboard do admin.",
      error: error.message,
    });
  }
}

export async function getAlunos(req: Request, res: Response) {
  try {
    const alunos = await adminService.getAlunos();
    return res.status(200).json(alunos);
  } catch (error: any) {
    return res.status(500).json({
      message: "Erro ao carregar alunos.",
      error: error.message,
    });
  }
}

export async function getAlunoDetalhes(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID do aluno inválido." });
    }

    const detalhes = await adminService.getAlunoDetalhes(id);
    return res.status(200).json(detalhes);
  } catch (error: any) {
    const status = error.message === "Aluno não encontrado." ? 404 : 500;

    return res.status(status).json({
      message: error.message || "Erro ao carregar detalhes do aluno.",
    });
  }
}

export async function updateAlunoAtivo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID do aluno inválido." });
    }

    const ativo =
      typeof req.body?.ativo === "boolean" ? req.body.ativo : undefined;

    const resultado = await adminService.updateAlunoAtivo(id, ativo);

    return res.status(200).json(resultado);
  } catch (error: any) {
    const status = error.message === "Aluno não encontrado." ? 404 : 500;

    return res.status(status).json({
      message: error.message || "Erro ao atualizar estado do aluno.",
    });
  }
}

export async function getAlunoEstatisticas(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID do aluno inválido." });
    }

    const estatisticas = await adminService.getAlunoEstatisticas(id);
    return res.status(200).json(estatisticas);
  } catch (error: any) {
    const status = error.message === "Aluno não encontrado." ? 404 : 500;

    return res.status(status).json({
      message: error.message || "Erro ao carregar estatísticas do aluno.",
    });
  }
}

export async function getConteudo(req: Request, res: Response) {
  try {
    const conteudo = await adminService.getConteudo();
    return res.status(200).json(conteudo);
  } catch (error: any) {
    return res.status(500).json({
      message: "Erro ao carregar conteúdo do jogo.",
      error: error.message,
    });
  }
}