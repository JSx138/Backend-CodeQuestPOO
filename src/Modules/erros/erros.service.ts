import { handleError } from '../../Utils/error.js';
import {
    Aluno,
    TipoErro,
    ErroJogador,
} from "../../Models/index.js"

export class ErrosService {

    static async getTipoDeErrosPorAluno(alunoId: number) {
        try {
            const aluno = await Aluno.findByPk(alunoId);

            if (!aluno) throw new Error('Aluno não encontrado');

            const quantidadeDeErros = await ErroJogador.findAll({
                where: {
                    aluno_id: alunoId
                },
                attributes: ["tipo_erro_id", "quantidade"],
                include: [
                    {
                        model: Aluno,
                        as: 'aluno',
                        attributes: ['id', 'nome']
                    },
                    {
                        model: TipoErro,
                        as: 'tipoErro',
                        attributes: ['id', 'nome']
                    },
                ]
            })

            const TipoDeErros = await TipoErro.findAll({
                attributes: ['id', 'nome']
            });

            return {
                quantidadeDeErros,
                TipoDeErros
            };
        } catch (error) {
            throw handleError('Erro ao buscar erros do aluno.', error);
        }
    }
}