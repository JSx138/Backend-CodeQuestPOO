import { DesempenhoAluno } from '../../Utils/types.js';
import { handleError } from '../../Utils/error.js';
import DesempenhoDesafio from '../../Models/DesempenhoDesafio/desempenhoDesafio.js';
import {
  Aluno,
  TipoErro,
  TipoFeedback,
  Desafio,
  Nivel,
  Mapa
} from '../../Models/index.js';

export class DesempenhoService {

  static async getByAluno(alunoId: number): Promise<DesempenhoAluno> {
    try {
      const desempenhos = await DesempenhoDesafio.findAll({
        where: { aluno_id: alunoId },
        order: [['data_execucao', 'DESC']]
      });

      if (desempenhos.length === 0) {
        throw new Error('Nenhum desempenho encontrado para esse aluno');
      }

      return {
        aluno_id: alunoId,
        total_registos: desempenhos.length,
        desempenhos: desempenhos as any,
      };
    } catch (error) {
      throw handleError('Erro ao buscar desempenho do aluno', error);
    }
  }

  static async getDesempenhoDoCodigo(alunoId: number) {
    try {
      const aluno = await Aluno.findByPk(alunoId);
      if (!aluno) throw new Error('Aluno não encontrado');

      const desempenhos = await DesempenhoDesafio.findAll({
        where: { aluno_id: alunoId },
        include: [
          {
            model: TipoErro,
            as: 'tipoErro',
            attributes: ['id', 'nome', 'descricao'],
          },
          {
            model: TipoFeedback,
            as: 'tipoFeedback',
            attributes: ['id', 'nome', 'descricao'],
          },
          {
            model: Desafio,
            as: 'desafio',
            attributes: ['id', 'nome', 'ordem'],
            include: [
              {
                model: Nivel,
                as: 'nivel',
                attributes: ['id', 'nome', 'nivel'],
                include: [
                  {
                    model: Mapa,
                    as: 'mapa',
                    attributes: ['id', 'nome'],
                  }
                ]
              }
            ]
          }
        ],
        order: [['data_execucao', 'DESC']]
      });

      const totalCertas = desempenhos.reduce((s, d) => s + (d.respostas_certas ?? 0), 0);
      const totalErradas = desempenhos.reduce((s, d) => s + (d.respostas_erradas ?? 0), 0);
      const totalTentativas = desempenhos.reduce((s, d) => s + (d.tentativas ?? 0), 0);
      const totalDesafios = desempenhos.length;
      const totalRespostas = totalCertas + totalErradas;

      const taxaAcerto = totalRespostas > 0
        ? Math.round((totalCertas / totalRespostas) * 100)
        : 0;
      const contagemErros: Record<string, {
        id: number,
        nome: string,
        descricao: string | null,
        count: number
      }> = {};
      for (const d of desempenhos) {
        if (d.tipoErro) {
          const key = String(d.tipoErro.id);
          if (!contagemErros[key]) {
            contagemErros[key] = {
              id: d.tipoErro.id,
              nome: d.tipoErro.nome,
              descricao: d.tipoErro.descricao,
              count: 0,
            };
          }
          contagemErros[key].count += d.respostas_erradas ?? 0;
        }
      }

      const errosMaisFrequentes = Object.values(contagemErros)
        .sort((a, b) => b.count - a.count);

      const tipoErroMaisComum = errosMaisFrequentes[0] ?? null;

      const porDesafio = desempenhos.map(d => ({
        desempenho_id: d.id,
        desafio: {
          id: d.desafio?.id,
          nome: d.desafio?.nome,
          ordem: d.desafio?.ordem,
        },
        nivel: {
          nome: d.desafio?.nivel?.nome,
          numero: d.desafio?.nivel?.nivel,
        },
        mapa: {
          id: d.desafio?.nivel?.mapa?.id,
          nome: d.desafio?.nivel?.mapa?.nome,
        },
        respostas_certas: d.respostas_certas,
        respostas_erradas: d.respostas_erradas,
        tentativas: d.tentativas,
        score: d.score,
        tipo_erro: d.tipoErro ? {
          id: d.tipoErro.id,
          nome: d.tipoErro.nome,
        } : null,
        tipo_feedback: d.tipoFeedback ? {
          id: d.tipoFeedback.id,
          nome: d.tipoFeedback.nome,
        } : null,
        feedback_ia: d.feedback_ia ?? null,
        data_execucao: d.data_execucao,
      }));

      return {
        resumo: {
          total_desafios: totalDesafios,
          total_certas: totalCertas,
          total_erradas: totalErradas,
          total_tentativas: totalTentativas,
          taxa_acerto: taxaAcerto,
          tipo_erro_mais_comum: tipoErroMaisComum,
          erros_por_tipo: errosMaisFrequentes,
        },
        por_desafio: porDesafio,
      };

    } catch (error) {
      throw handleError('Erro ao buscar desempenho do aluno.', error);
    }

  }
}