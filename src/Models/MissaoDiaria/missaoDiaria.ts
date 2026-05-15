import {
    Table, Column, Model, DataType,
    HasMany,
} from "sequelize-typescript";
import AlunoMissaoDiaria from "../AlunoMissaoDiaria/alunoMissaoDiaria.js";

@Table({ tableName: "missoes_diarias", timestamps: false })
export default class MissaoDiaria extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare descricao: string | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare objetivo: number | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare recompensa_xp: number | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => AlunoMissaoDiaria, "missao_id")
    declare alunosMissoes: AlunoMissaoDiaria[];
}
