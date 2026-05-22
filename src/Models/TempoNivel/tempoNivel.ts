import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import Nivel from "../Nivel/nivel.js";

@Table({ tableName: "tempo_nivel", timestamps: false })
export default class TempoNivel extends Model {

    @ForeignKey(() => Aluno)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    declare aluno_id: number;

    @ForeignKey(() => Nivel)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    declare nivel_id: number;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare tempo_total: number | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare tempo_primeira_conclusao: number | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare melhor_tempo: number | null;

    @Column({ allowNull: true, type: DataType.INTEGER, defaultValue: 1})
    declare tentativas: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;

    @BelongsTo(() => Nivel, "nivel_id")
    declare nivel: Nivel;
}
