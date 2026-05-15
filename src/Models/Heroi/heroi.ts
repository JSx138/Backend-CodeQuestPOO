import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";

@Table({ tableName: "herois", timestamps: false })
export default class Heroi extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: false, unique: true, type: DataType.STRING(50) })
    declare nome: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare descricao: string | null;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    declare imagem: string | null;

    @Column({ allowNull: true, type: DataType.STRING(100) })
    declare habilidade_especial: string | null;

    @Column({ allowNull: false, defaultValue: true, type: DataType.BOOLEAN })
    declare ativo: boolean;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => Aluno, "heroi_id")
    declare alunos: Aluno[];
}