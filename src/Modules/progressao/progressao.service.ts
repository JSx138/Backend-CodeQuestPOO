import pool from '../../Config/db';
import { handleError } from '../../Utils/error';
import { MapaProgresso, DashboardStats } from '../../Utils/types';

export class ProgressoService {

  static async getProgressoPorMapas(alunoId: number): Promise<MapaProgresso[]> {
    try {
      const mapasResult = await pool.query('SELECT id, nome, ordem FROM mapas ORDER BY ordem');
      const mapas = mapasResult.rows;

      const completosResult = await pool.query(
        `SELECT n.mapa_id, COUNT(DISTINCT dd.desafio_id) as total
         FROM desempenho_desafio dd
         JOIN desafios d ON dd.desafio_id = d.id
         JOIN niveis n ON d.nivel_id = n.id
         WHERE dd.aluno_id = $1
         GROUP BY n.mapa_id`,
        [alunoId]
      );

      const totaisResult = await pool.query(
        'SELECT mapa_id, SUM(total_desafios) as total FROM niveis GROUP BY mapa_id'
      );

      const completosPorMapa: Record<number, number> = {};
      completosResult.rows.forEach(r => { completosPorMapa[r.mapa_id] = parseInt(r.total); });

      const totaisPorMapa: Record<number, number> = {};
      totaisResult.rows.forEach(r => { totaisPorMapa[r.mapa_id] = parseInt(r.total); });

      const mapasProgresso: MapaProgresso[] = [];

      for (const m of mapas) {
        const totalDesafiosMapa = totaisPorMapa[m.id] || 0;
        const desafiosCompletos = completosPorMapa[m.id] || 0;
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
      const progressResult = await pool.query(
        'SELECT * FROM progresso_aluno WHERE aluno_id = $1',
        [alunoId]
      );
      const progress = progressResult.rows[0];

      if (!progress) {
        return { xp_total: 0, nivel_atual: 1, coins: 0, streak: 0, tempo_total_jogo: 0, desafios_completos: 0, total_desafios: 0, porcentagem_completa: 0 };
      }

      const mapasResult = await pool.query('SELECT id FROM mapas ORDER BY ordem');
      let totalDesafios = 0;
      let desafiosCompletos = 0;

      for (const m of mapasResult.rows) {
        const niveisResult = await pool.query(
          'SELECT id, nivel, total_desafios FROM niveis WHERE mapa_id = $1 ORDER BY nivel',
          [m.id]
        );

        for (const n of niveisResult.rows) {
          totalDesafios += n.total_desafios;

          if (progress.mapa_atual > m.id) {
            desafiosCompletos += n.total_desafios;
          } else if (progress.mapa_atual === m.id && n.nivel < progress.nivel_atual) {
            desafiosCompletos += n.total_desafios;
          }
        }
      }

      return {
        xp_total: progress.xp || 0,
        nivel_atual: progress.nivel_atual || 1,
        coins: progress.coins || 0,
        streak: progress.streak || 0,
        tempo_total_jogo: progress.tempo_total_jogo || 0,
        desafios_completos: desafiosCompletos,
        total_desafios: totalDesafios,
        porcentagem_completa: totalDesafios === 0 ? 0 : Math.min((desafiosCompletos / totalDesafios) * 100, 100),
      };
    } catch (error) {
      throw handleError('Erro ao buscar dashboard', error);
    }
  }
}