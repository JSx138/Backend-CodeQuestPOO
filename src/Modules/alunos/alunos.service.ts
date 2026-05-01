import pool from '../../Config/db';
import { handleError } from '../../Utils/error';
import { Aluno, CriarAlunoDTO} from "../../Utils/types"

export class AlunosService {

  static async getAllAlunos(): Promise<Aluno[]> {
    try {
      const result = await pool.query('SELECT * FROM alunos ORDER BY id');
      return result.rows;
    } catch (error) {
      throw handleError('Erro ao buscar alunos', error);
    }
  }

  static async criarAluno(dados: CriarAlunoDTO): Promise<Aluno> {
    try {
      const {
        nome, email, password, numero, turma,
        escola, ano, ano_letivo, avatar_id, heroi_id
      } = dados;

      const result = await pool.query(
        `INSERT INTO alunos 
         (nome, email, password, numero, turma, escola, ano, ano_letivo, avatar_id, heroi_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [nome, email, password, numero, turma, escola, ano, ano_letivo, avatar_id, heroi_id]
      );

      return result.rows[0];
    } catch (error) {
      throw handleError('Erro ao criar aluno', error);
    }
  }
}