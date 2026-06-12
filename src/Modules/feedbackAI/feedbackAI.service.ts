import ollama from "ollama";
import type { FeedbackInput } from "./feedbackAI.types.js";

const INSTRUCOES_FEEDBACK: Record<number, string> = {
  1: `
- O aluno errou mas estava perto. Confirma apenas se a resposta está certa ou errada.
- Não expliques o porquê. Máximo 2 frases.
  `.trim(),

  2: `
- Explica qual foi o erro e o conceito envolvido.
- Não dês a solução completa. Máximo 3 frases.
  `.trim(),

  3: `
- O aluno está com muita dificuldade. Dá uma estratégia clara para resolver o problema.
- Podes dar um exemplo parcial mas nunca o código final completo. Máximo 4 frases.
  `.trim(),
};

const NOMES_TIPO_ERRO: Record<number, string> = {
  1: "Sintaxe",
  2: "Lógica",
  3: "Conceito de POO",
  4: "Encapsulamento",
  5: "Herança",
  6: "Polimorfismo",
};

export const gerarFeedbackIA = async (
  input: FeedbackInput
): Promise<string> => {
  const instrucoes = INSTRUCOES_FEEDBACK[input.tipo_feedback_id] 
    ?? INSTRUCOES_FEEDBACK[2];

  const nomeErro = input.tipo_erro_id 
    ? NOMES_TIPO_ERRO[input.tipo_erro_id] 
    : null;

  const prompt = `
És o mentor de um jogo educativo de Programação Orientada a Objetos.

REGRAS GERAIS:
- Responde em português de Portugal.
- Não dês a solução completa.
- Não escrevas o código final.
- Trata o aluno por "tu".

INSTRUÇÃO PARA ESTE FEEDBACK (segue à risca):
${instrucoes}

${nomeErro ? `Categoria do erro: ${nomeErro}` : ""}

Desafio: ${input.titulo ?? "Sem título"}

Objetivos:
${input.objetivos?.join("\n") ?? "Sem objetivos"}

Código do aluno:
${input.codigo ?? "(sem código)"}

Output obtido:
${input.output ?? "(sem output)"}

Erro:
${input.erro ?? "(sem erro)"}
`.trim();

  const response = await ollama.chat({
    model: "llama3",
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content;
};