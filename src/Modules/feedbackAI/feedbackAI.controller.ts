import type { Request, Response } from "express";
import { gerarFeedbackIA } from "./feedbackAI.service.js";
import type { FeedbackInput } from "./feedbackAI.types.js";

export const pedirFeedbackIA = async (
  req: Request<{}, {}, FeedbackInput>,
  res: Response
): Promise<void> => {
  try {
    const feedback = await gerarFeedbackIA(req.body);

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Erro ao gerar feedback IA:", error);

    res.status(500).json({
      success: false,
      feedback:
        "Não consegui gerar uma dica agora. Revê os objetivos do desafio e tenta novamente.",
    });
  }
};