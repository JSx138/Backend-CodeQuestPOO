import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import Achievement from "../Achievement/achievement.js";

@Table({ tableName: "aluno_achievements", timestamps: false })
export default class AlunoAchievement extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Aluno)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare aluno_id: number;

    @ForeignKey(() => Achievement)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare achievement_id: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare progresso: number;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare total: number | null;

    @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
    declare concluido: boolean;

    @Column({ allowNull: true, type: DataType.DATE })
    declare data_conclusao: Date | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;

    @BelongsTo(() => Achievement, "achievement_id")
    declare achievement: Achievement;
}
