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
  tableName: "jogador_sessoes",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
})
export default class JogadorSessao extends Model {

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
    type: DataType.DATE
  })
  declare inicio: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
    defaultValue: null
  })
  declare fim: Date | null;

  @Column({
    allowNull: false,
    defaultValue: 0,
    type: DataType.INTEGER
  })
  declare duracao: number;

  @Column({
    allowNull: false,
    type: DataType.DATE
  })
  declare created_at: Date;


  // ─── ASSOCIATIONS ─────────────────────────────

  @BelongsTo(() => Aluno)
  declare aluno: Aluno;
}