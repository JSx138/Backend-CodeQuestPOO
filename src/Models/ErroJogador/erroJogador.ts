import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";
import TipoErro from "../TipoErro/tipoErro.js";

@Table({ tableName: "erros_jogador", timestamps: false })
export default class ErroJogador extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Aluno)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare aluno_id: number;

    @ForeignKey(() => TipoErro)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare tipo_erro_id: number;

    @Column({ allowNull: false, defaultValue: 0, type: DataType.INTEGER })
    declare quantidade: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Aluno, "aluno_id")
    declare aluno: Aluno;

    @BelongsTo(() => TipoErro, "tipo_erro_id")
    declare tipoErro: TipoErro;
}
