import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey, HasMany,
} from "sequelize-typescript";
import Nivel from "../Nivel/nivel.js";
import DesempenhoDesafio from "../DesempenhoDesafio/desempenhoDesafio.js";

@Table({ tableName: "desafios", timestamps: false })
export default class Desafio extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Nivel)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare nivel_id: number;

    @Column({ allowNull: false, type: DataType.TEXT })
    declare nome: string;

    @Column({ allowNull: false, type: DataType.TEXT })
    declare descricao: string;

    @Column({ allowNull: false, defaultValue: 50, type: DataType.INTEGER })
    declare xp_recompensa: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    declare ordem: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Nivel, { foreignKey: "nivel_id", as: "nivel" })
    declare nivel: Nivel;

    @HasMany(() => DesempenhoDesafio, { foreignKey: "desafio_id", as: "desempenhos" })
    declare desempenhos: DesempenhoDesafio[];
}