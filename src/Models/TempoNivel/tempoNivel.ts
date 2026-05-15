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

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;

    @BelongsTo(() => Nivel, "nivel_id")
    declare nivel: Nivel;
}
