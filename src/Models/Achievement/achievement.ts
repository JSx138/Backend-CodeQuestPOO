import {
    Table, Column, Model, DataType,
    HasMany,
} from "sequelize-typescript";
import AlunoAchievement from "../AlunoAchievement/alunoAchievement.js";

@Table({ tableName: "achievements", timestamps: false })
export default class Achievement extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    declare titulo: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare descricao: string | null;

    @Column({ allowNull: true, type: DataType.STRING(10) })
    declare icone: string | null;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare xp_recompensa: number | null;

    @Column({ allowNull: true, type: DataType.STRING(50) })
    declare categoria: string | null;

    @Column({ allowNull: true, type: DataType.STRING(20) })
    declare cor: string | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => AlunoAchievement, "achievement_id")
    declare alunoAchievements: AlunoAchievement[];
}
