import { Response, Request } from 'express';
import { JogadorTempoService } from './jogTem.service.js';

export async function getUserTempo(req: Request, res: Response) {
    try {
        const aluno = Number(req.alunoId!)

        if(isNaN(aluno)){
            throw new Error("Aluno não encontrado")
        }
        
        const tempo = await JogadorTempoService.getUserTempo(aluno)
        return res.status(200).json(tempo)
    } catch (error) {
        res.status(400).json("Erro ao buscar tempo do jogador")
    }
}
