import { handleError } from '../../Utils/error';
import Mapa from '../../Models/Mapa/mapa.js';

export class MapasService {

  static async getAll(): Promise<Mapa[]> {
    try {
      const getAllMaps = await Mapa.findAll({
        attributes: ['id', 'nome', 'descricao', 'ordem'],
        order: [
          ['ordem', 'ASC']
        ]
      });

      return getAllMaps;
    } catch (error) {
      throw handleError('Erro ao buscar mapas', error);
    }
  }
}