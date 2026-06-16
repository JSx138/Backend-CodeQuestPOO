import Amizade from "../Amizade/amizade.js";
import {
    Table, Column, Model, DataType,
    HasOne, HasMany, BelongsTo, ForeignKey, BelongsToMany,
} from "sequelize-typescript";
import Avatar from "../Avatar/avatar.js";
import Mentores from "../Mentores/mentores.js";
import ProgressoAluno from "../ProgressoAluno/progressoAluno.js";
import DesempenhoDesafio from "../DesempenhoDesafio/desempenhoDesafio.js";
import ErroJogador from "../ErroJogador/erroJogador.js";
import AlunoAchievement from "../AlunoAchievement/alunoAchievement.js";
import AlunoMissaoDiaria from "../AlunoMissaoDiaria/alunoMissaoDiaria.js";
import AtividadeSemanal from "../AtividadeSemanal/atividadeSemanal.js";
import JogadorTempo from "../JogadorTempo/jogadorTempo.js";
import TempoNivel from "../TempoNivel/tempoNivel.js";
import Trofeu from "../Trofeu/trofeu.js";
import AlunoTrofeu from "../AlunoTrofeu/alunoTrofeu.js";

@Table({ tableName: "alunos", timestamps: false })
export default class Aluno extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    is_admin!: boolean;

    @Column({ allowNull: false, unique: true, type: DataType.STRING(100) })
    declare email: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare password: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    declare nome: string;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare numero: number | null;

    @Column({ allowNull: true, type: DataType.STRING(20) })
    declare turma: string | null;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    declare escola: string | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare ano: number | null;

    @Column({ allowNull: true, type: DataType.STRING(9) })
    declare ano_letivo: string | null;

    @ForeignKey(() => Avatar)
    @Column({ allowNull: true, type: DataType.INTEGER })
    declare avatar_id: number | null;

    @ForeignKey(() => Mentores)
    @Column({ allowNull: true, type: DataType.INTEGER })
    declare mentor_id: number | null;

    @Column({ allowNull: false, defaultValue: true, type: DataType.BOOLEAN })
    declare ativo: boolean;

    @Column({ allowNull: false, defaultValue: DataType.NOW, type: DataType.DATE })
    declare data_registo: Date;

    @Column({ allowNull: true, type: DataType.DATE })
    declare ultimo_acesso: Date | null;

    @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
    declare online: boolean;


    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Avatar, "avatar_id")
    declare avatar: Avatar;

    @BelongsTo(() => Mentores, "mentor_id")
    declare mentor: Mentores;

    @HasOne(() => ProgressoAluno, "aluno_id")
    declare progresso: ProgressoAluno;

    @HasOne(() => JogadorTempo, "aluno_id")
    declare tempo: JogadorTempo;

    @HasMany(() => DesempenhoDesafio, "aluno_id")
    declare desempenhos: DesempenhoDesafio[];

    @HasMany(() => ErroJogador, "aluno_id")
    declare erros: ErroJogador[];

    @HasMany(() => AlunoAchievement, "aluno_id")
    declare achievements: AlunoAchievement[];

    @HasMany(() => AlunoMissaoDiaria, "aluno_id")
    declare missoesDiarias: AlunoMissaoDiaria[];

    @HasMany(() => AtividadeSemanal, "aluno_id")
    declare atividadesSemanais: AtividadeSemanal[];

    @HasMany(() => TempoNivel, "aluno_id")
    declare temposNiveis: TempoNivel[];

    @HasMany(() => Amizade, "aluno_id")
    declare pedidosEnviados: Amizade[];

    @HasMany(() => Amizade, "amigo_id")
    declare pedidosRecebidos: Amizade[];

    @BelongsToMany(() => Trofeu, () => AlunoTrofeu)
    declare trofeus: Trofeu[];
}