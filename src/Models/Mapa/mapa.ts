import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Nivel from "../Nivel/nivel.js";

@Table({ tableName: "mapas", timestamps: false })
export default class Mapa extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    declare nome: string;

    @Column({ allowNull: true, type: DataType.STRING(150) })
    declare descricao: string | null;

    @Column({ allowNull: false, type: DataType.INTEGER })
    declare ordem: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @HasMany(() => Nivel, { foreignKey: "mapa_id", as: "niveis" })
    declare niveis: Nivel[];
}