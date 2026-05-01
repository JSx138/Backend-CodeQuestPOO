import pool from "../../Config/db"
import { handleError } from "../../Utils/error"
import { NivelComDesafios } from '../../Utils/types';

export class NiveisService {

  static async getByMapa(mapaId: number): Promise<NivelComDesafios[]> {
    try {
      const { rows } = await pool.query(
        `SELECT
          n.id AS nivel_id,
          n.nome AS nivel_nome,
          n.nivel AS nivel,
          n.descricao AS nivel_descricao,
          n.xp_recompensa AS nivel_xp,
          n.total_desafios,
          d.id AS desafio_id,
          d.nome AS desafio_nome,
          d.descricao AS desafio_descricao,
          d.xp_recompensa AS desafio_xp,
          d.ordem
         FROM niveis n
         LEFT JOIN desafios d ON d.nivel_id = n.id
         WHERE n.mapa_id = $1
         ORDER BY n.id, d.ordem`,
        [mapaId]
      );

      const niveis: Record<number, NivelComDesafios> = {};

      rows.forEach(row => {
        if (!niveis[row.nivel_id]) {
          niveis[row.nivel_id] = {
            id: row.nivel_id,
            nivel: row.nivel,
            nome: row.nivel_nome,
            descricao: row.nivel_descricao,
            xp: row.nivel_xp,
            total_desafios: row.total_desafios,
            desafios: [],
          };
        }

        if (row.desafio_id) {
          niveis[row.nivel_id].desafios.push({
            id: row.desafio_id,
            nome: row.desafio_nome,
            descricao: row.desafio_descricao,
            xp: row.desafio_xp,
            ordem: row.ordem,
          });
        }
      });

      return Object.values(niveis);
    } catch (error) {
      throw handleError('Erro ao buscar níveis', error);
    }
  }
}