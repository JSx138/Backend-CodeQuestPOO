import { Request, Response } from 'express';
import { ErrosService } from './erros.service.js';

export async function getErrosPorAluno(req: Request, res: Response) {
    try {
        const alunoId = Number(req.alunoId!)

        if (isNaN(alunoId)) {
            res.status(400).json({ message: "alunoId inválido" });
            return;
        }

        const erros = await ErrosService.getTipoDeErrosPorAluno(alunoId);
        return res.status(200).json(erros)

    } catch (error) {
        res.status(500).json({ message: "Erro ao obter erros do aluno" })
    }
}
