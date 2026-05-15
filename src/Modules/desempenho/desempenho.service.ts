import { handleError } from '../../Utils/error';
import { DesempenhoAluno } from '../../Utils/types';
import DesempenhoDesafio from '../../Models/DesempenhoDesafio/desempenhoDesafio.js';

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
}