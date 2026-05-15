import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import Desafio from "../Desafio/desafio.js";
import TipoErro from "../TipoErro/tipoErro.js";
import TipoFeedback from "../TipoFeedback/tipoFeedback.js";

@Table({ tableName: "desempenho_desafio", timestamps: false })
export default class DesempenhoDesafio extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Aluno)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare aluno_id: number;

    @ForeignKey(() => Desafio)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare desafio_id: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare respostas_certas: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare respostas_erradas: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare tentativas: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare ajudas_usadas: number;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare tempo_desafio: number | null;

    @ForeignKey(() => TipoErro)
    @Column({ allowNull: true, type: DataType.INTEGER })
    declare tipo_erro_id: number | null;

    @ForeignKey(() => TipoFeedback)
    @Column({ allowNull: true, type: DataType.INTEGER })
    declare tipo_feedback_id: number | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare score: number | null;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare feedback_ia: string | null;

    @Column({ allowNull: false, defaultValue: DataType.NOW, type: DataType.DATE })
    declare data_execucao: Date;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, { foreignKey: "aluno_id", as: "aluno" })
    declare aluno: Aluno;

    @BelongsTo(() => Desafio, { foreignKey: "desafio_id", as: "desafio" })
    declare desafio: Desafio;

    @BelongsTo(() => TipoErro, { foreignKey: "tipo_erro_id", as: "tipoErro" })
    declare tipoErro: TipoErro;

    @BelongsTo(() => TipoFeedback, { foreignKey: "tipo_feedback_id", as: "tipoFeedback" })
    declare tipoFeedback: TipoFeedback;
}