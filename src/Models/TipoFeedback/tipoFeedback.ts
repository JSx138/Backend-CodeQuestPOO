import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import DesempenhoDesafio from "../DesempenhoDesafio/desempenhoDesafio.js";

@Table({ tableName: "tipos_feedback", timestamps: false })
export default class TipoFeedback extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(20) })
    declare nome: string;

    @Column({ allowNull: true, type: DataType.STRING(150) })
    declare descricao: string | null;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => DesempenhoDesafio, "tipo_feedback_id")
    declare desempenhos: DesempenhoDesafio[];
}