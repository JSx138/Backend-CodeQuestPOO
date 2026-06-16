import { Op } from "sequelize";

import {
  Achievement,
  Aluno,
  Desafio,
  DesempenhoDesafio,
  ErroJogador,
  JogadorTempo,
  Mapa,
  MissaoDiaria,
  Nivel,
  ProgressoAluno,
  Trofeu,
} from "../../Models/index.js";


function plain(model: any) {
  if (!model) return null;
  return typeof model.get === "function" ? model.get({ plain: true }) : model;
}

function normalizarNumero(valor: any) {
  const numero = Number(valor || 0);
  return Number.isNaN(numero) ? 0 : numero;
}

export async function getDashboard() {
  const [
    totalAlunos,
    alunosAtivos,
    totalDesafiosConcluidos,
    totalErros,
    totalMapas,
    totalNiveis,
    totalDesafios,
    totalTrofeus,
    totalAchievements,
    totalMissoes,
  ] = await Promise.all([
    Aluno.count(),
    Aluno.count({ where: { ativo: true } as any }),
    DesempenhoDesafio.count({
      where: {
        tempo_desafio: {
          [Op.ne]: null,
        },
      } as any,
    }),
    ErroJogador.count(),
    Mapa.count(),
    Nivel.count(),
    Desafio.count(),
    Trofeu.count(),
    Achievement.count(),
    MissaoDiaria.count(),
  ]);

  const tempoTotalRaw = await JogadorTempo.sum("tempo_total" as any);
  const tempoTotal = normalizarNumero(tempoTotalRaw);

  const melhorDesempenhoModel: any = await DesempenhoDesafio.findOne({
    where: {
      tempo_desafio: {
        [Op.ne]: null,
      },
    } as any,
    order: [["tempo_desafio", "ASC"]],
  });

  const melhorDesempenho = plain(melhorDesempenhoModel);
  let melhorAluno = null;

  if (melhorDesempenho?.aluno_id) {
    const alunoModel = await Aluno.findByPk(melhorDesempenho.aluno_id, {
      attributes: { exclude: ["password", "senha", "password_hash"] },
    } as any);

    melhorAluno = plain(alunoModel);
  }

  return {
    totalAlunos,
    alunosAtivos,
    alunosInativos: totalAlunos - alunosAtivos,
    totalDesafiosConcluidos,
    totalErros,
    tempoTotal,
    conteudo: {
      totalMapas,
      totalNiveis,
      totalDesafios,
      totalTrofeus,
      totalAchievements,
      totalMissoes,
    },
    melhorRegisto: melhorDesempenho
      ? {
          aluno: melhorAluno,
          tempo_desafio: melhorDesempenho.tempo_desafio,
          desafio_id: melhorDesempenho.desafio_id,
          mapa_id: melhorDesempenho.mapa_id,
          nivel_id: melhorDesempenho.nivel_id,
        }
      : null,
  };
}

export async function getAlunos() {
  const alunos = await Aluno.findAll({
    attributes: { exclude: ["password", "senha", "password_hash"] },
    order: [["data_registo", "DESC"]],
  } as any);

  const alunosPlain = alunos.map(plain);

  return Promise.all(
    alunosPlain.map(async (aluno: any) => {
      const [tempo, desafiosConcluidos, erros] = await Promise.all([
        JogadorTempo.findOne({ where: { aluno_id: aluno.id } as any }),
        DesempenhoDesafio.count({
          where: {
            aluno_id: aluno.id,
            tempo_desafio: {
              [Op.ne]: null,
            },
          } as any,
        }),
        ErroJogador.count({ where: { aluno_id: aluno.id } as any }),
      ]);

      const tempoPlain = plain(tempo);

      return {
        ...aluno,
        tempo_total: normalizarNumero(tempoPlain?.tempo_total),
        horas_semana: normalizarNumero(tempoPlain?.horas_semana),
        desafios_concluidos: desafiosConcluidos,
        erros_registados: erros,
      };
    })
  );
}

export async function getAlunoDetalhes(id: number) {
  const alunoModel = await Aluno.findByPk(id, {
    attributes: { exclude: ["password", "senha", "password_hash"] },
  } as any);

  if (!alunoModel) {
    throw new Error("Aluno não encontrado.");
  }

  const [tempo, desempenhos, erros, progresso] = await Promise.all([
    JogadorTempo.findOne({ where: { aluno_id: id } as any }),
    DesempenhoDesafio.findAll({
      where: { aluno_id: id } as any,
      order: [["id", "DESC"]],
      limit: 20,
    } as any),
    ErroJogador.findAll({
      where: { aluno_id: id } as any,
      order: [["id", "DESC"]],
      limit: 20,
    } as any),
    ProgressoAluno.findAll({
      where: { aluno_id: id } as any,
      order: [["id", "DESC"]],
      limit: 20,
    } as any),
  ]);

  return {
    aluno: plain(alunoModel),
    tempo: plain(tempo),
    desempenhos: desempenhos.map(plain),
    erros: erros.map(plain),
    progresso: progresso.map(plain),
  };
}

export async function updateAlunoAtivo(id: number, ativo?: boolean) {
  const aluno = await Aluno.findByPk(id);

  if (!aluno) {
    throw new Error("Aluno não encontrado.");
  }

  const alunoPlain = plain(aluno) as any;
  const novoEstado =
    typeof ativo === "boolean" ? ativo : !Boolean(alunoPlain.ativo);

  await aluno.update({ ativo: novoEstado } as any);

  return {
    message: novoEstado
      ? "Aluno ativado com sucesso."
      : "Aluno desativado com sucesso.",
    aluno: plain(aluno),
  };
}

export async function getAlunoEstatisticas(id: number) {
  const aluno = await Aluno.findByPk(id, {
    attributes: { exclude: ["password", "senha", "password_hash"] },
  } as any);

  if (!aluno) {
    throw new Error("Aluno não encontrado.");
  }

  const [tempo, desafiosConcluidos, totalErros, progressoTotal] =
    await Promise.all([
      JogadorTempo.findOne({ where: { aluno_id: id } as any }),
      DesempenhoDesafio.count({
        where: {
          aluno_id: id,
          tempo_desafio: {
            [Op.ne]: null,
          },
        } as any,
      }),
      ErroJogador.count({ where: { aluno_id: id } as any }),
      ProgressoAluno.count({ where: { aluno_id: id } as any }),
    ]);

  const melhorDesempenho = await DesempenhoDesafio.findOne({
    where: {
      aluno_id: id,
      tempo_desafio: {
        [Op.ne]: null,
      },
    } as any,
    order: [["tempo_desafio", "ASC"]],
  } as any);

  return {
    aluno: plain(aluno),
    tempo: plain(tempo),
    desafiosConcluidos,
    totalErros,
    progressoTotal,
    melhorDesempenho: plain(melhorDesempenho),
  };
}

export async function getConteudo() {
  const [mapas, niveis, desafios, trofeus, achievements, missoesDiarias] =
    await Promise.all([
      Mapa.findAll({ order: [["id", "ASC"]] } as any),
      Nivel.findAll({ order: [["id", "ASC"]] } as any),
      Desafio.findAll({ order: [["id", "ASC"]] } as any),
      Trofeu.findAll({ order: [["id", "ASC"]] } as any),
      Achievement.findAll({ order: [["id", "ASC"]] } as any),
      MissaoDiaria.findAll({ order: [["id", "ASC"]] } as any),
    ]);

  return {
    mapas: mapas.map(plain),
    niveis: niveis.map(plain),
    desafios: desafios.map(plain),
    trofeus: trofeus.map(plain),
    achievements: achievements.map(plain),
    missoesDiarias: missoesDiarias.map(plain),
  };
}