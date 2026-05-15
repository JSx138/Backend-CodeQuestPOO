import {
    Table, Column, Model, DataType,
    BelongsToMany,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import AlunoTrofeu from "../AlunoTrofeu/alunoTrofeu.js";

@Table({ tableName: "trofeus", timestamps: false })
export default class Trofeu extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    declare nome: string | null;

    @Column({ allowNull: true, type: DataType.STRING(10) })
    declare icone: string | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsToMany(() => Aluno, () => AlunoTrofeu)
    declare alunos: Aluno[];
}
