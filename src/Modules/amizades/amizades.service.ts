import { Op } from "sequelize";
import { Aluno, Amizade, Avatar, Mentores } from "../../Models/index.js";

const ONLINE_MINUTOS = 5;

function estaOnline(data: Date | null) {
  if (!data) return false;
  const agora = new Date().getTime();
  const ultimo = new Date(data).getTime();
  return agora - ultimo <= ONLINE_MINUTOS * 60 * 1000;
}

export class AmizadesService {
  static async enviarPedido(alunoId: number, amigoId: number) {
    if (alunoId === amigoId) {
      throw new Error("Não podes adicionar-te a ti próprio");
    }

    const amigo = await Aluno.findByPk(amigoId);

    if (!amigo) {
      throw new Error("Aluno não encontrado");
    }

    const existente = await Amizade.findOne({
      where: {
        [Op.or]: [
          { aluno_id: alunoId, amigo_id: amigoId },
          { aluno_id: amigoId, amigo_id: alunoId },
        ],
      },
    });

    if (existente) {
      throw new Error("Já existe um pedido ou amizade com este aluno");
    }

    return await Amizade.create({
      aluno_id: alunoId,
      amigo_id: amigoId,
      estado: "pendente",
    });
  }

  static async aceitarPedido(alunoId: number, amizadeId: number) {
    const pedido = await Amizade.findOne({
      where: {
        id: amizadeId,
        amigo_id: alunoId,
        estado: "pendente",
      },
    });

    if (!pedido) {
      throw new Error("Pedido não encontrado");
    }

    pedido.estado = "aceite";
    pedido.data_resposta = new Date();
    await pedido.save();

    return pedido;
  }

  static async rejeitarPedido(alunoId: number, amizadeId: number) {
    const pedido = await Amizade.findOne({
      where: {
        id: amizadeId,
        amigo_id: alunoId,
        estado: "pendente",
      },
    });

    if (!pedido) {
      throw new Error("Pedido não encontrado");
    }

    pedido.estado = "rejeitada";
    pedido.data_resposta = new Date();
    await pedido.save();

    return pedido;
  }

  static async removerAmigo(alunoId: number, amigoId: number) {
    const amizade = await Amizade.findOne({
      where: {
        estado: "aceite",
        [Op.or]: [
          { aluno_id: alunoId, amigo_id: amigoId },
          { aluno_id: amigoId, amigo_id: alunoId },
        ],
      },
    });

    if (!amizade) {
      throw new Error("Amizade não encontrada");
    }

    await amizade.destroy();

    return { message: "Amigo removido com sucesso" };
  }

  static async listarAmigos(alunoId: number) {
    const amizades = await Amizade.findAll({
      where: {
        estado: "aceite",
        [Op.or]: [{ aluno_id: alunoId }, { amigo_id: alunoId }],
      },
      include: [
        {
          model: Aluno,
          as: "aluno",
          attributes: [
            "id",
            "nome",
            "email",
            "ultimo_acesso",
            "online"
          ],
          include: [
            {
              model: Avatar,
              as: "avatar",
              attributes: ["id", "nome", "caminho_imagem"]
            },
            {
              model: Mentores,
              as: "mentor",
              attributes: ["id", "nome", "imagem"]
            },
          ],
        },
        {
          model: Aluno,
          as: "amigo",
          attributes: ["id", "nome", "email", "ultimo_acesso", "online"],
          include: [
            {
              model: Avatar,
              as: "avatar",
              attributes: ["id", "nome", "caminho_imagem"]
            },
            {
              model: Mentores,
              as: "mentor",
              attributes: ["id", "nome", "imagem"]
            }
          ],
        },
      ],
    });

    return amizades.map((amizade: any) => {
      const outro = amizade.aluno_id === alunoId ? amizade.amigo : amizade.aluno;

      return {
        amizadeId: amizade.id,
        alunoId: outro.id,
        nome: outro.nome,
        email: outro.email,
        avatar: outro.avatar,
        mentor: outro.mentor,
        online: outro.online === true,
        ultimo_acesso: outro.ultimo_acesso,
      };
    });
  }

  static async pedidosRecebidos(alunoId: number) {
    return await Amizade.findAll({
      where: {
        amigo_id: alunoId,
        estado: "pendente",
      },
      include: [
        {
          model: Aluno,
          as: "aluno",
          attributes: ["id", "nome", "email", "ultimo_acesso"],
          include: [{
            model: Avatar,
            as: "avatar",
            attributes: ["id", "nome", "caminho_imagem"]
          }],
        },
      ],
      order: [["data_pedido", "DESC"]],
    });
  }

  static async estadosAmizade(alunoId: number) {
    const amizades = await Amizade.findAll({
      where: {
        [Op.or]: [{ aluno_id: alunoId }, { amigo_id: alunoId }],
      },
    });

    return amizades.map((a: any) => {
      const outroId = a.aluno_id === alunoId ? a.amigo_id : a.aluno_id;

      let estado = a.estado;

      if (a.estado === "pendente") {
        estado = a.aluno_id === alunoId ? "pendente_enviado" : "pendente_recebido";
      }

      return {
        alunoId: outroId,
        estado,
        amizadeId: a.id,
      };
    });
  }
}