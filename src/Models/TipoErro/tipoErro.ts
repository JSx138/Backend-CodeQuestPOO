import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import DesempenhoDesafio from "../DesempenhoDesafio/desempenhoDesafio.js";
import ErroJogador from "../ErroJogador/erroJogador.js";

@Table({ tableName: "tipos_erro", timestamps: false })
export default class TipoErro extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    declare nome: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare descricao: string | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => DesempenhoDesafio, "tipo_erro_id")
    declare desempenhos: DesempenhoDesafio[];

    @HasMany(() => ErroJogador, "tipo_erro_id")
    declare errosJogador: ErroJogador[];
}