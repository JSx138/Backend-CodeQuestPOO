import {
    Table, Column, Model, DataType,
    BelongsTo, ForeignKey, HasMany,
} from "sequelize-typescript";
import Mapa from "../Mapa/mapa.js";
import Desafio from "../Desafio/desafio.js";
import TempoNivel from "../TempoNivel/tempoNivel.js";

@Table({ tableName: "niveis", timestamps: false })
export default class Nivel extends Model {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    declare id: number;

    @ForeignKey(() => Mapa)
    @Column({ allowNull: false, type: DataType.INTEGER })
    declare mapa_id: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    declare nivel: number;

    @Column({ allowNull: false, type: DataType.INTEGER })
    declare total_desafios: number;

    @Column({ allowNull: false, type: DataType.TEXT })
    declare nome: string;

    @Column({ allowNull: false, type: DataType.TEXT })
    declare descricao: string;

    @Column({ allowNull: false, defaultValue: 50, type: DataType.INTEGER })
    declare xp_recompensa: number;

    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 100})
    declare coins_recompensa: number;

    // ─── ASSOCIATIONS ────────────────────────────────────────────────
    @BelongsTo(() => Mapa, { foreignKey: "mapa_id", as: "mapa" })
    declare mapa: Mapa;

    @HasMany(() => Desafio, { foreignKey: "nivel_id", as: "desafios" })
    declare desafios: Desafio[];

    @HasMany(() => TempoNivel, { foreignKey: "nivel_id", as: "tempos" })
    declare tempos: TempoNivel[];
}