import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";

@Table({ tableName: "avatares", timestamps: false })
export default class Avatar extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    declare nome: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare caminho_imagem: string;

    @Column({ allowNull: false, defaultValue: true, type: DataType.BOOLEAN })
    declare ativo: boolean;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => Aluno, "avatar_id")
    declare alunos: Aluno[];
}