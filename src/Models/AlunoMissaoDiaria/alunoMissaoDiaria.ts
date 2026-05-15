import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import MissaoDiaria from "../MissaoDiaria/missaoDiaria.js";

@Table({ tableName: "aluno_missao_diaria", timestamps: false })
export default class AlunoMissaoDiaria extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Aluno)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare aluno_id: number;

    @ForeignKey(() => MissaoDiaria)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare missao_id: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare progresso: number;

    @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
    declare concluida: boolean;

    @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
    declare streak_ativa: boolean;

    @Column({ allowNull: true, type: DataType.INTEGER })
    declare dias_restantes: number | null;

    @Column({ allowNull: false, defaultValue: DataType.NOW, type: DataType.DATEONLY })
    declare data: Date;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;

    @BelongsTo(() => MissaoDiaria, "missao_id")
    declare missao: MissaoDiaria;
}
