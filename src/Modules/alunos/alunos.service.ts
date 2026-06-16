import { handleError } from '../../Utils/error.js';
import { Aluno as AlunoType, CriarAlunoDTO } from '../../Utils/types.js';
import Aluno from '../../Models/Aluno/aluno.js';
import ProgressoAluno from '../../Models/ProgressoAluno/progressoAluno.js';
import EmailService from '../../Modules/email/email.service.js';
import bcrypt from "bcryptjs";
import { AlunoAchievement, JogadorTempo, Trofeu, Mentores, Avatar, Achievement } from '../../Models/index.js';

export class AlunosService {

  static async atualizarUltimoAcesso(alunoId: number) {
  try {
    await Aluno.update(
      { ultimo_acesso: new Date() },
      { where: { id: alunoId } }
    );

    return { message: "Estado online atualizado" };
  } catch (error) {
    throw handleError("Erro ao atualizar estado online", error);
  }
}

  static async getAllAlunos(): Promise<AlunoType[]> {
    try {
      const getAllAlunos = await Aluno.findAll({
        attributes: [
          'id',
          'nome',
          'email',
          'numero',
          'turma',
          'escola',
          'ano',
          'ano_letivo',
          'avatar_id',
          'mentor_id',
          'ativo',
          'data_registo'
        ],
        order: [['id', 'ASC']]
      });

      return getAllAlunos as any;
    } catch (error) {
      throw handleError('Erro ao buscar alunos', error);
    }
  }

  static async criarAluno(dados: CriarAlunoDTO): Promise<AlunoType> {
    try {
      const hash = await bcrypt.hash(dados.password, 10);
      const novoAluno = await Aluno.create({
        nome: dados.nome,
        email: dados.email,
        password: hash,
        numero: dados.numero,
        turma: dados.turma,
        escola: dados.escola,
        ano: dados.ano,
        ano_letivo: dados.ano_letivo,
        avatar_id: dados.avatar_id,
        mentor_id: dados.mentor_id,
      });

      await ProgressoAluno.create({
        aluno_id: novoAluno.id,
        xp: 0,
        nivel_atual: 1,
        coins: 0,
        streak: 0,
        tempo_total_jogo: 0,
        mapa_atual: 1
      });

      await EmailService.enviarEmailBoasVindas(novoAluno.email, novoAluno.nome);

      return novoAluno.get({ plain: true }) as AlunoType;
    } catch (error) {
      throw handleError('Erro ao criar aluno', error);
    }
  }

  static async getMe(alunoId: number): Promise<AlunoType> {
    try {

      const aluno = await Aluno.findOne({
        where: { id: alunoId },
        attributes: [
          "id",
          "nome",
          "email",
          "numero",
          "turma",
          "escola",
          "ano",
          "ano_letivo",
          "data_registo"
        ],
        include: [
          {
            model: ProgressoAluno,
            as: "progresso",
            attributes: ["mapa_atual", "nivel_atual", "xp", "tempo_total_jogo"]
          },
          {
            model: Avatar,
            as: "avatar",
            attributes: ["nome", "caminho_imagem"]
          }
        ]
      });

      if (!aluno) {
        throw new Error("Aluno não encontrado");
      }

      return aluno.get({ plain: true }) as AlunoType;

    } catch (error) {

      throw handleError(
        "Erro ao buscar aluno",
        error
      );
    }
  }

  static async getById(AlunoId: number) {
    try {
      const getAluno = await Aluno.findOne({
        where: { id: AlunoId },
        attributes: [
          "id",
          "nome",
          "email",
          "numero",
          "turma",
          "escola",
          "ano",
          "ano_letivo"
        ],
        include: [
          {
            model: ProgressoAluno,
            as: "progresso",
            attributes: ["mapa_atual", "nivel_atual", "xp", "tempo_total_jogo"]
          },
          {
            model: AlunoAchievement,
            as: "achievements",
            attributes: ["total", "data_conclusao"],
            include: [
              {
                model: Achievement,
                as: "achievement",
                attributes: ["titulo", "icone"]
              }
            ]
          },
          {
            model: Trofeu,
            as: "trofeus",
            attributes: ["nome", "icone"],
          },
          {
            model: Avatar,
            as: "avatar",
            attributes: ["nome", "caminho_imagem"]
          },
          {
            model: Mentores,
            as: "mentor",
            attributes: ["nome", "imagem"]
          }
        ]
      })
      return getAluno
    } catch (error) {
      throw handleError('Erro ao buscar aluno', error)
    }
  }
}