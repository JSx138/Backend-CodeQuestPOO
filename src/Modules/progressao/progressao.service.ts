import { handleError } from '../../Utils/error';
import { MapaProgresso, DashboardStats } from '../../Utils/types';
import Mapa from '../../Models/Mapa/mapa.js';
import Nivel from '../../Models/Nivel/nivel.js';
import DesempenhoDesafio from '../../Models/DesempenhoDesafio/desempenhoDesafio.js';
import Desafio from '../../Models/Desafio/desafio.js';
import ProgressoAluno from '../../Models/ProgressoAluno/progressoAluno.js';
import { Sequelize } from 'sequelize-typescript';

export class ProgressoService {

  static async getProgressoPorMapas(alunoId: number): Promise<MapaProgresso[]> {
    try {
      const mapas = await Mapa.findAll({ order: [['ordem', 'ASC']] });

      const completosPorMapaResult = await DesempenhoDesafio.findAll({
        attributes: [
          [Sequelize.col('desafio.nivel.mapa_id'), 'mapa_id'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('desafio_id'))), 'total']
        ],
        include: [{
          model: Desafio,
          attributes: [],
          include: [{
            model: Nivel,
            attributes: [],
            as: 'nivel'
          }]
        }],
        where: { aluno_id: alunoId },
        group: [Sequelize.col('desafio.nivel.mapa_id')],
        raw: true
      }) as any[];

      const totaisPorMapaResult = await Nivel.findAll({
        attributes: [
          'mapa_id',
          [Sequelize.fn('SUM', Sequelize.col('total_desafios')), 'total']
        ],
        group: ['mapa_id'],
        raw: true
      }) as any[];

      const completosPorMapa: Record<number, number> = {};
      completosPorMapaResult.forEach(r => { completosPorMapa[r.mapa_id] = parseInt(r.total); });

      const totaisPorMapa: Record<number, number> = {};
      totaisPorMapaResult.forEach(r => { totaisPorMapa[r.mapa_id] = parseInt(r.total); });

      const mapasProgresso: MapaProgresso[] = [];

      for (const m of mapas) {
        const totalDesafiosMapa = Number(totaisPorMapa[m.id] || 0);
        const desafiosCompletos = Number(completosPorMapa[m.id] || 0);
        const porcentagem = totalDesafiosMapa === 0
          ? 0
          : Math.min((desafiosCompletos / totalDesafiosMapa) * 100, 100);

        const mapaAnterior = mapasProgresso.find(mp => mp.mapa === m.id - 1);
        const desbloqueado = m.id === 1 || (!!mapaAnterior && mapaAnterior.porcentagem === 100);

        mapasProgresso.push({
          mapa: m.id,
          nome: m.nome,
          ordem: m.ordem,
          total_desafios: totalDesafiosMapa,
          desafios_completos: desafiosCompletos,
          porcentagem,
          desbloqueado,
        });
      }

      return mapasProgresso;
    } catch (error) {
      throw handleError('Erro ao buscar progresso', error);
    }
  }

  static async getDashboard(alunoId: number): Promise<DashboardStats> {
    try {
      const progress = await ProgressoAluno.findOne({
        where: { aluno_id: alunoId }
      });

      if (!progress) {
        return { xp_total: 0, nivel_atual: 1, coins: 0, streak: 0, tempo_total_jogo: 0, desafios_completos: 0, total_desafios: 0, porcentagem_completa: 0 };
      }

      const totalDesafios = await Nivel.sum('total_desafios') || 0;

      const desafiosCompletos = await DesempenhoDesafio.count({
        where: { aluno_id: alunoId },
        distinct: true,
        col: 'desafio_id'
      });

      return {
        xp_total: Number(progress.xp || 0),
        nivel_atual: Number(progress.nivel_atual || 1),
        coins: Number(progress.coins || 0),
        streak: Number(progress.streak || 0),
        tempo_total_jogo: Number(progress.tempo_total_jogo || 0),
        desafios_completos: desafiosCompletos,
        total_desafios: totalDesafios,
        porcentagem_completa: totalDesafios === 0 ? 0 : Math.min((desafiosCompletos / totalDesafios) * 100, 100),
      };
    } catch (error) {
      throw handleError('Erro ao buscar dashboard', error);
    }
  }
}