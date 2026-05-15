import {
    Table, Column, Model, DataType,
    ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import Trofeu from "../Trofeu/trofeu.js";

@Table({ tableName: "aluno_trofeus", timestamps: false })
export default class AlunoTrofeu extends Model {

    @ForeignKey(() => Aluno)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    declare aluno_id: number;

    @ForeignKey(() => Trofeu)
    @Column({ primaryKey: true, type: DataType.INTEGER })
    declare trofeu_id: number;

    @Column({ allowNull: false, defaultValue: false, type: DataType.BOOLEAN })
    declare desbloqueado: boolean;

    @Column({ allowNull: true, type: DataType.DATE })
    declare data_desbloqueio: Date | null;
}
