import type { Request, Response } from "express";
import { gerarFeedbackIA } from "./feedbackAI.service.js";
import type { FeedbackInput } from "./feedbackAI.types.js";

export const pedirFeedbackIA = async (
  req: Request<{}, {}, FeedbackInput>,
  res: Response
): Promise<void> => {
  try {
    const { 
      titulo, objetivos, codigo, output, 
      erro, tentativa, tipo_feedback_id, tipo_erro_id 
    } = req.body;

    const feedbackInput: FeedbackInput = {
      titulo: titulo ?? "",
      objetivos: objetivos ?? [],
      codigo: codigo ?? "",
      output: output ?? "",
      erro: erro ?? "",
      tentativa: tentativa ?? 1,
      tipo_feedback_id: tipo_feedback_id ?? 2,
      tipo_erro_id: tipo_erro_id ?? null,
    };

    const feedback = await gerarFeedbackIA(feedbackInput);

    res.json({ success: true, feedback });
  } catch (error) {
    console.error("Erro ao gerar feedback IA:", error);
    res.status(500).json({
      success: false,
      feedback: "Não consegui gerar uma dica agora. Revê os objetivos do desafio e tenta novamente.",
    });
  }
};