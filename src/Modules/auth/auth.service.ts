import pool from "../../Config/db";
import { generateToken } from "../../Utils/jwt";
import { handleError } from "../../Utils/error"
import { Aluno, LoginResponse } from "../../Utils/types"

export class AuthService {

    static async login(email: string, password: string): Promise<LoginResponse> {

        try {
            const result = await pool.query(
                'SELECT * FROM alunos WHERE email = $1 LIMIT 1',
                [email]
            );

            const user: Aluno | undefined = result.rows[0];
            if (!user) {
                throw new Error('Credenciais inválidas');
            }

            // 2. Valida password
            const stored = user.password ?? user.senha ?? null;
            if (!stored || stored !== password) {
                throw new Error('Credenciais inválidas');
            }

            // 3. Cria progresso inicial se não existir
            const progressoCheck = await pool.query(
                'SELECT 1 FROM progresso_aluno WHERE aluno_id = $1',
                [user.id]
            );

            if (progressoCheck.rows.length === 0) {
                await pool.query(
                    `INSERT INTO progresso_aluno 
                    (aluno_id, xp, nivel_atual, coins, streak, tempo_total_jogo, mapa_atual, ultimo_login)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                    [user.id, 0, 1, 0, 0, 0, 1]
                );
            }

            // 4. Gera token
            const token = generateToken({ id: user.id, email: user.email });

            // 5. Remove password antes de devolver
            const { password: _p, senha: _s, ...userSemPassword } = user;

            return { token, user: userSemPassword };
        } catch (error) {
           throw handleError("Erro ao fazer login", error)
        }

    }
}