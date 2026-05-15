import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";

@Table({ tableName: "atividade_semanal", timestamps: false })
export default class AtividadeSemanal extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Aluno)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare aluno_id: number;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare dia_semana: number | null;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare atividade: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;
}
