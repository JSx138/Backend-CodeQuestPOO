import ollama from "ollama";
import type { FeedbackInput } from "./feedbackAI.types.js";

const INSTRUCOES_FEEDBACK: Record<number, string> = {
  1: `
- Diz apenas se está certo ou errado.
- Dá uma dica muito curta.
- Máximo 10 palavras.
  `.trim(),

  2: `
- Indica o erro principal.
- Dá uma dica curta para corrigir.
- Máximo 12 palavras.
  `.trim(),

  3: `
- Dá uma orientação simples para continuar.
- Não expliques demasiado.
- Máximo 15 palavras.
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

const limitarFeedback = (texto: string): string => {
  const limpo = texto
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (limpo.length <= 80) {
    return limpo;
  }

  return limpo.slice(0, 77).trim() + "...";
};

export const gerarFeedbackIA = async (
  input: FeedbackInput
): Promise<string> => {
  const instrucoes =
    INSTRUCOES_FEEDBACK[input.tipo_feedback_id] ?? INSTRUCOES_FEEDBACK[2];

  const nomeErro = input.tipo_erro_id
    ? NOMES_TIPO_ERRO[input.tipo_erro_id]
    : null;

  const prompt = `
És o mentor de um jogo educativo de Programação Orientada a Objetos.

REGRAS OBRIGATÓRIAS:
- Responde exclusivamente em português de Portugal.
- Nunca uses português do Brasil.
- Responde numa única frase.
- Máximo 15 palavras.
- Sê direto e objetivo.
- Não uses listas.
- Não uses emojis.
- Não escrevas código.
- Não dês a solução completa.
- Trata o aluno por "tu".
- A resposta deve caber num balão de fala pequeno.

INSTRUÇÃO ESPECÍFICA:
${instrucoes}

${nomeErro ? `Categoria do erro: ${nomeErro}` : ""}

Desafio:
${input.titulo ?? "Sem título"}

Objetivos:
${input.objetivos?.join("\n") ?? "Sem objetivos"}

Código do aluno:
${input.codigo ?? "(sem código)"}

Output obtido:
${input.output ?? "(sem output)"}

Erro:
${input.erro ?? "(sem erro)"}
`.trim();

  try {
    const response = await ollama.chat({
      model: "llama3",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return limitarFeedback(response.message.content);
  } catch (error) {
    console.error("Erro ao gerar feedback IA:", error);

    return "Revê o teu código e tenta identificar o erro principal.";
  }
};