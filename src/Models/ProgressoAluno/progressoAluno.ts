import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";

@Table({ tableName: "progresso_aluno", timestamps: false })
export default class ProgressoAluno extends Model {

    // PK composta é o aluno_id — sem id separado na tabela
    @ForeignKey(() => Aluno)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    declare aluno_id: number;

    @Column({ allowNull: false, defaultValue: 1, type: DataType.INTEGER })
    declare mapa_atual: number;

    @Column({ allowNull: false, defaultValue: 1, type: DataType.INTEGER })
    declare nivel_atual: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare xp: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare coins: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare streak: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare tempo_total_jogo: number;

    @Column({ allowNull: true, type: DataType.DATE })
    declare ultimo_login: Date | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, { foreignKey: "aluno_id", as: "aluno" })
    declare aluno: Aluno;
}