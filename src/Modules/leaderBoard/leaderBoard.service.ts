import {
  Nivel,
  Mapa,
  Desafio,
  Aluno,
  DesempenhoDesafio,
  Avatar,
  Mentores,
  JogadorTempo,
} from "../../Models/index.js";

import { Op } from "sequelize";
import { handleError } from "../../Utils/error.js";

const ONLINE_MINUTOS = 5;

function estaOnline(data: Date | null) {
  if (!data) return false;
  const agora = new Date().getTime();
  const ultimo = new Date(data).getTime();
  return agora - ultimo <= ONLINE_MINUTOS * 60 * 1000;
}

export class LeaderBoard {
  static async getGlobalLeaderboardBestTime() {
    try {
      const data = await DesempenhoDesafio.findAll({
        attributes: ["aluno_id", "tempo_desafio", "data_execucao"],
        where: {
          tempo_desafio: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: Aluno,
            as: "aluno",
            attributes: ["id", "nome", "email", "ultimo_acesso"],
            include: [
              {
                model: Avatar,
                as: "avatar",
                attributes: ["id", "nome", "caminho_imagem"],
              },
              {
                model: Mentores,
                as: "mentor",
                attributes: ["id", "nome", "imagem"],
              },
              {
                model: JogadorTempo,
                as: "tempo",
                attributes: ["tempo_total"],
              },
            ],
          },
          {
            model: Desafio,
            as: "desafio",
            attributes: ["id", "nome"],
            include: [
              {
                model: Nivel,
                as: "nivel",
                attributes: ["id", "nome"],
                include: [
                  {
                    model: Mapa,
                    as: "mapa",
                    attributes: ["id", "nome", "ordem"],
                  },
                ],
              },
            ],
          },
        ],
      });

      const map = new Map();

      for (const row of data as any[]) {
        const alunoId = row.aluno_id;
        const tempo = row.tempo_desafio;

        if (!tempo) continue;

        const base = {
          alunoId,
          nome: row.aluno?.nome,
          avatar: row.aluno?.avatar,
          mentor: row.aluno?.mentor,
          tempoTotal: row.aluno?.tempo?.tempo_total ?? 0,
          online: estaOnline(row.aluno?.ultimo_acesso ?? null),
          ultimo_acesso: row.aluno?.ultimo_acesso ?? null,
        };

        if (!map.has(alunoId)) {
          map.set(alunoId, {
            ...base,
            melhorTempo: tempo,
            data: row.data_execucao,
            mapa: row.desafio?.nivel?.mapa,
            nivel: row.desafio?.nivel,
            desafio: row.desafio,
          });
        } else {
          const atual = map.get(alunoId);

          if (tempo < atual.melhorTempo) {
            map.set(alunoId, {
              ...atual,
              ...base,
              melhorTempo: tempo,
              data: row.data_execucao,
              mapa: row.desafio?.nivel?.mapa,
              nivel: row.desafio?.nivel,
              desafio: row.desafio,
            });
          }
        }
      }

      return Array.from(map.values())
        .sort((a, b) => a.melhorTempo - b.melhorTempo)
        .slice(0, 10);
    } catch (error) {
      throw new Error("Erro ao buscar leaderboard global por tempo");
    }
  }

  static async getLeaderboardByMapaNivelDesafio(
    mapaId: number,
    nivelId: number,
    desafioId: number
  ) {
    try {
      if (!mapaId || !nivelId || !desafioId) {
        throw new Error("IDs inválidos");
      }

      const leaderboard = await DesempenhoDesafio.findAll({
        attributes: ["aluno_id", "tempo_desafio", "data_execucao"],
        where: {
          desafio_id: desafioId,
          tempo_desafio: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: Aluno,
            as: "aluno",
            attributes: ["id", "nome", "email", "ultimo_acesso"],
            include: [
              {
                model: Avatar,
                as: "avatar",
                attributes: ["id", "nome", "caminho_imagem"],
              },
              {
                model: Mentores,
                as: "mentor",
                attributes: ["id", "nome", "imagem"],
              },
              {
                model: JogadorTempo,
                as: "tempo",
                attributes: ["tempo_total"],
              },
            ],
          },
          {
            model: Desafio,
            as: "desafio",
            attributes: ["id", "nome", "nivel_id"],
            include: [
              {
                model: Nivel,
                as: "nivel",
                attributes: ["id", "nome", "mapa_id"],
                where: {
                  id: nivelId,
                },
                include: [
                  {
                    model: Mapa,
                    as: "mapa",
                    attributes: ["id", "nome", "ordem"],
                    where: {
                      id: mapaId,
                    },
                  },
                ],
              },
            ],
          },
        ],
        order: [["tempo_desafio", "ASC"]],
        limit: 10,
      });

      return (leaderboard as any[]).map((entry) => ({
        alunoId: entry.aluno_id,
        nome: entry.aluno?.nome,
        avatar: entry.aluno?.avatar,
        mentor: entry.aluno?.mentor,
        tempo: entry.tempo_desafio,
        tempoTotal: entry.aluno?.tempo?.tempo_total ?? 0,
        online: estaOnline(entry.aluno?.ultimo_acesso ?? null),
        ultimo_acesso: entry.aluno?.ultimo_acesso ?? null,
        data: entry.data_execucao,
        mapa: entry.desafio?.nivel?.mapa,
        nivel: entry.desafio?.nivel,
        desafio: entry.desafio,
      }));
    } catch (error) {
      throw handleError("Erro ao buscar leaderboard específico", error);
    }
  }
}