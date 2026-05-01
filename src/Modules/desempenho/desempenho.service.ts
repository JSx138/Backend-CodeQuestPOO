import pool from '../../Config/db';
import { handleError } from '../../Utils/error';
import { DesempenhoAluno } from '../../Utils/types';

export class DesempenhoService {

  static async getByAluno(alunoId: number): Promise<DesempenhoAluno> {
    try {
      const resultado = await pool.query(
        `SELECT * FROM desempenho_desafio 
         WHERE aluno_id = $1 
         ORDER BY data_execucao DESC`,
        [alunoId]
      );

      if (resultado.rows.length === 0) {
        throw new Error('Nenhum desempenho encontrado para esse aluno');
      }

      return {
        aluno_id: alunoId,
        total_registos: resultado.rows.length,
        desempenhos: resultado.rows,
      };
    } catch (error) {
      throw handleError('Erro ao buscar desempenho do aluno', error);
    }
  }
}