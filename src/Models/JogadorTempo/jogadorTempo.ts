import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";

@Table({ tableName: "jogador_tempo", timestamps: false })
export default class JogadorTempo extends Model {

    @ForeignKey(() => Aluno)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    declare aluno_id: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare horas_semana: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare max_tempo_dia: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare tempo_total: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;
}
