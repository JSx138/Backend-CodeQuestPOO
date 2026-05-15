import { handleError } from "../../Utils/error"
import { NivelComDesafios } from '../../Utils/types';
import Nivel from "../../Models/Nivel/nivel.js";
import Desafio from "../../Models/Desafio/desafio.js";

export class NiveisService {

  static async getByMapa(mapaId: number): Promise<NivelComDesafios[]> {
    try {
      const niveis = await Nivel.findAll({
        where: { mapa_id: mapaId },
        include: [{
          model: Desafio,
          as: 'desafios'
        }],
        order: [
          ['id', 'ASC'],
          [{ model: Desafio, as: 'desafios' }, 'ordem', 'ASC']
        ]
      });

      return niveis.map(n => ({
        id: n.id,
        nivel: n.nivel,
        nome: n.nome,
        descricao: n.descricao,
        xp: n.xp_recompensa,
        total_desafios: n.total_desafios,
        desafios: (n.desafios || []).map(d => ({
          id: d.id,
          nome: d.nome,
          descricao: d.descricao,
          xp: d.xp_recompensa,
          ordem: d.ordem
        }))
      }));
    } catch (error) {
      throw handleError('Erro ao buscar níveis', error);
    }
  }
}