import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Aluno from "../Aluno/aluno.js";

@Table({ tableName: "amizades", timestamps: false })
export default class Amizade extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Aluno)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare aluno_id: number;

  @ForeignKey(() => Aluno)
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare amigo_id: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM("pendente", "aceite", "rejeitada"),
    defaultValue: "pendente",
  })
  declare estado: "pendente" | "aceite" | "rejeitada";

  @Column({ allowNull: false, type: DataType.DATE, defaultValue: DataType.NOW })
  declare data_pedido: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  declare data_resposta: Date | null;

  @BelongsTo(() => Aluno, "aluno_id")
  declare aluno: Aluno;

  @BelongsTo(() => Aluno, "amigo_id")
  declare amigo: Aluno;
}