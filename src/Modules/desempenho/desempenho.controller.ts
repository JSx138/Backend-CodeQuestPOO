import { Request, Response } from 'express';
import { DesempenhoService } from './desempenho.service.js';

export const getDesempenhoByAluno = async (req: Request, res: Response): Promise<void> => {
    try {
        const alunoId = Number(req.params.alunoId)

        if (isNaN(alunoId)) {
            res.status(400).json({ message: "alunoId inválido" });
            return;
        }

        const desempenho = await DesempenhoService.getByAluno(alunoId);
        res.json(desempenho);
    } catch (error) {
        console.error("[DesempenhoController] getDesempenhoByAluno", error)

        if (error instanceof Error && error.message.includes("Nenhum desempenho")) {
            res.status(404).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Erro ao obter desempenho" })
    }
}