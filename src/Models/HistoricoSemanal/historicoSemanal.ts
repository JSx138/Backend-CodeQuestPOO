import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";

import { Aluno } from "../index.js";

@Table({
    tableName: "historico_tempo_semanal",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export default class HistoricoTempoSemanal extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare id: number;

    @ForeignKey(() => Aluno)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    declare aluno_id: number;

    @Column({
        allowNull: false,
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare tempo_semana: number;

    @Column({
        allowNull: false,
        type: DataType.DATE
    })
    declare semana_inicio: Date;

    @Column({
        allowNull: true,
        type: DataType.DATE,
        defaultValue: null
    })
    declare semana_fim: Date | null;


    @Column({
        allowNull: false,
        type: DataType.DATE
    })
    declare created_at: Date;

    @Column({ 
        allowNull: false, 
        type: DataType.DATE 
    }) 
    declare updated_at: Date;

    // ─── ASSOCIATIONS ─────────────────────────────
    @BelongsTo(() => Aluno)
    declare aluno: Aluno;
}