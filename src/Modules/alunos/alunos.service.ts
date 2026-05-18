import { handleError } from '../../Utils/error.js';
import { Aluno as AlunoType, CriarAlunoDTO } from '../../Utils/types.js';
import Aluno from '../../Models/Aluno/aluno.js';
import ProgressoAluno from '../../Models/ProgressoAluno/progressoAluno.js';
import EmailService from '../../Modules/email/email.service.js';
import bcrypt from "bcryptjs";

export class AlunosService {

  static async getAllAlunos(): Promise<AlunoType[]> {
    try {
      const getAllAlunos = await Aluno.findAll({
        attributes: ['id', 'nome', 'email', 'numero', 'turma', 'escola', 'ano', 'ano_letivo', 'avatar_id', 'heroi_id', 'ativo', 'data_registo'],
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
        heroi_id: dados.heroi_id
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
}