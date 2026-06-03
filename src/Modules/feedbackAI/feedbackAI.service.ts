import ollama from "ollama";
import type { FeedbackInput } from "./feedbackAI.types.js";

export const gerarFeedbackIA = async (
  input: FeedbackInput
): Promise<string> => {
  const prompt = `
És o Eldrin, mentor de um jogo educativo de Programação Orientada a Objetos.

REGRAS:
- Responde em português de Portugal.
- Não dês a solução completa.
- Não escrevas o código final.
- Dá apenas uma dica útil.
- Máximo 3 frases.

Desafio:
${input.titulo ?? "Sem título"}

Objetivos:
${input.objetivos?.join("\n") ?? "Sem objetivos"}

Código do aluno:
${input.codigo ?? ""}

Erro:
${input.erro ?? ""}
`;

  const response = await ollama.chat({
    model: "llama3.2",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.message.content;
};