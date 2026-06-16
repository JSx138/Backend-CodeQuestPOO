import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { Amizade } from "../Models/index.js";
import Aluno from "../Models/Aluno/aluno.js"
import Avatar from "../Models/Avatar/avatar.js"
import Desafio from "../Models/Desafio/desafio.js"
import Nivel from "../Models/Nivel/nivel.js"
import ProgressoAluno from "../Models/ProgressoAluno/progressoAluno.js"
import TipoErro from "../Models/TipoErro/tipoErro.js"
import TipoFeedback from "../Models/TipoFeedback/tipoFeedback.js"
import DesempenhoDesafio from "../Models/DesempenhoDesafio/desempenhoDesafio.js"
import Mapa from "../Models/Mapa/mapa.js"
import Mentores from "../Models/Mentores/mentores.js"
import ErroJogador from "../Models/ErroJogador/erroJogador.js"
import Achievement from "../Models/Achievement/achievement.js"
import AlunoAchievement from "../Models/AlunoAchievement/alunoAchievement.js"
import MissaoDiaria from "../Models/MissaoDiaria/missaoDiaria.js"
import AlunoMissaoDiaria from "../Models/AlunoMissaoDiaria/alunoMissaoDiaria.js"
import Trofeu from "../Models/Trofeu/trofeu.js"
import AlunoTrofeu from "../Models/AlunoTrofeu/alunoTrofeu.js"
import AtividadeSemanal from "../Models/AtividadeSemanal/atividadeSemanal.js"
import JogadorTempo from "../Models/JogadorTempo/jogadorTempo.js"
import TempoNivel from "../Models/TempoNivel/tempoNivel.js"
import Sessoes from "../Models/Sessoes/sessoes.js"
import HistoricoTempoSemanal from "../Models/HistoricoSemanal/historicoSemanal.js"


dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,

    models: [
        Aluno,
        Avatar,
        Desafio,
        Nivel,
        ProgressoAluno,
        TipoErro,
        TipoFeedback,
        DesempenhoDesafio,
        Mapa,
        Mentores,
        ErroJogador,
        Achievement,
        AlunoAchievement,
        MissaoDiaria,
        AlunoMissaoDiaria,
        Trofeu,
        AlunoTrofeu,
        AtividadeSemanal,
        JogadorTempo,
        TempoNivel,
        Sessoes,
        HistoricoTempoSemanal,
        Amizade
    ],
});

export default sequelize;