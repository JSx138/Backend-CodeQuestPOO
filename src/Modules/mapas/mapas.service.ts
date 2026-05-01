import pool from '../../Config/db';
import { handleError } from '../../Utils/error';
import { Mapa } from '../../Utils/types';

export class MapasService {

  static async getAll(): Promise<Mapa[]> {
    try {
      const result = await pool.query(
        'SELECT id, nome, descricao, ordem FROM mapas ORDER BY ordem'
      );
      return result.rows;
    } catch (error) {
      throw handleError('Erro ao buscar mapas', error);
    }
  }
}