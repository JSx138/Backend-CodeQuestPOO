import { Request, Response } from "express";
import { DesafiosService } from "./desafio.service.js"
import { AuthRequest } from '../../Middlewares/auth.middleware.js';

export const getDesempenho = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alunoId = req.alunoId!

    if (isNaN(alunoId)) {
      res.status(400).json({ message: "alunoId inválido" })
      return
    }

    const desempenho = await DesafiosService.getDesempenho(alunoId)

    res.json(desempenho)
  } catch (error) {
    console.error("[DesafiosController] getDesempenho:", error);
    res.status(500).json({ message: "Erro ao obter desempenho" });
  }
}

export const concluirDesafio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alunoId = req.alunoId!
    const desafioId = Number(req.params.desafioId);

    if (isNaN(alunoId) || isNaN(desafioId)) {
      res.status(400).json({ message: "IDs inválidos" });
      return;
    }

    const {
      respostas_certas,
      respostas_erradas,
      ajudas_usadas,
      tempo_desafio,
      score,
      tipo_erro_id,
      tipo_feedback_id,
      feedback_ia,
      novo_streak,
    } = req.body;

    const resultado = await DesafiosService.concluirDesafio(
      alunoId,
      desafioId,
      {
        respostas_certas,
        respostas_erradas,
        ajudas_usadas,
        tempo_desafio,
        score,
        tipo_erro_id,
        tipo_feedback_id,
        feedback_ia,
        novo_streak,
      }
    );

    console.log(JSON.stringify(resultado, null, 2));
    res.status(200).json(resultado);

  } catch (error) {
    console.error("[DesafiosController] concluirDesafio:", error);
    res.status(500).json({ message: "Erro ao concluir desafio" });
  }
};