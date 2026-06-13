import { Request, Response } from "express";
import { AmizadesService } from "./amizades.service.js";

export const enviarPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const amigoId = Number(req.body.amigoId);

    const pedido = await AmizadesService.enviarPedido(alunoId, amigoId);
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const aceitarPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const amizadeId = Number(req.params.id);

    const pedido = await AmizadesService.aceitarPedido(alunoId, amizadeId);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const rejeitarPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const amizadeId = Number(req.params.id);

    const pedido = await AmizadesService.rejeitarPedido(alunoId, amizadeId);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const removerAmigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const amigoId = Number(req.params.amigoId);

    const resultado = await AmizadesService.removerAmigo(alunoId, amigoId);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const listarAmigos = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const amigos = await AmizadesService.listarAmigos(alunoId);
    res.json(amigos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const pedidosRecebidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const pedidos = await AmizadesService.pedidosRecebidos(alunoId);
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const estadosAmizade = async (req: Request, res: Response): Promise<void> => {
  try {
    const alunoId = Number(req.alunoId);
    const estados = await AmizadesService.estadosAmizade(alunoId);
    res.json(estados);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};