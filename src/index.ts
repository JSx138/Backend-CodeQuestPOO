import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import sequelize from "./Config/sequelize.js";
import feedbackAIRoutes from "./Modules/feedbackAI/feedbackAI.routes.js";
import amizadesRoutes from "./Modules/amizades/amizades.route.js";

import authRouter from "./Modules/auth/auth.routes.js";
import alunosRouter from "./Modules/alunos/alunos.routes.js";
import desafios from "./Modules/desafio/desafio.routes.js";
import desempenhoRouter from "./Modules/desempenho/desempenho.routes.js";

import levelRouter from "./Modules/niveis/niveis.routes.js";
import mapas from "./Modules/mapas/mapas.routes.js";
import progressoRoutes from "./Modules/progressao/progressao.routes.js";
import tempoRouter from "./Modules/tempo/tempo.routes.js";

import pdf from "./Modules/pdf/pdf.routes.js";
import jogadorTempoRouter from "./Modules/jogadorTempo/jogTem.routes.js";
import leaderBoardRouter from "./Modules/leaderBoard/leaderBoard.routes.js";

import Aluno from "./Models/Aluno/aluno.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

const alunosOnline = new Map<number, Set<string>>();
const timersOffline = new Map<number, NodeJS.Timeout>();

io.on("connection", (socket) => {
  console.log("Socket ligado:", socket.id);

  socket.on("aluno-online", async (alunoId: number) => {
    try {
      if (!alunoId) return;

      const id = Number(alunoId);

      const timer = timersOffline.get(id);
      if (timer) {
        clearTimeout(timer);
        timersOffline.delete(id);
      }

      if (!alunosOnline.has(id)) {
        alunosOnline.set(id, new Set());
      }

      alunosOnline.get(id)!.add(socket.id);

      await Aluno.update(
        {
          online: true,
          ultimo_acesso: new Date()
        },
        { where: { id } }
      );

      io.emit("presenca-atualizada", {
        alunoId: id,
        online: true,
      });

      console.log(`Aluno ${id} online`);
    } catch (error) {
      console.error("Erro ao marcar aluno online:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      let alunoIdDesligado: number | null = null;

      for (const [alunoId, sockets] of alunosOnline.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);

          if (sockets.size === 0) {
            alunosOnline.delete(alunoId);
            alunoIdDesligado = alunoId;
          }

          break;
        }
      }

      if (!alunoIdDesligado) return;

      const id = alunoIdDesligado;

      const timer = setTimeout(async () => {
        if (alunosOnline.has(id)) return;

        await Aluno.update(
          {
            online: false,
            ultimo_acesso: new Date()
          },
          { where: { id } }
        );

        io.emit("presenca-atualizada", {
          alunoId: id,
          online: false,
        });

        timersOffline.delete(id);

        console.log(`Aluno ${id} offline`);
      }, 5000);

      timersOffline.set(id, timer);
    } catch (error) {
      console.error("Erro ao marcar aluno offline:", error);
    }
  });
});

app.use(cors());
app.use(express.json());
app.use(express.text({ type: "text/plain" }));

app.use("/api/amizades", amizadesRoutes);
app.use("/api/feedback-ai", feedbackAIRoutes);

app.get("/api/feedback-ai/teste", (_req: Request, res: Response) => {
  res.json({ message: "rota feedback carregada" });
});

app.use("/api/alunos", alunosRouter);
app.use("/api/auth", authRouter);
app.use("/api/progresso", progressoRoutes);
app.use("/api/mapas", mapas);
app.use("/api/tempo", tempoRouter);
app.use("/api/niveis", levelRouter);
app.use("/api/desafios", desafios);
app.use("/api/desempenho", desempenhoRouter);
app.use("/api/jogadorTempo", jogadorTempoRouter);
app.use("/api/pdf", pdf);
app.use("/api/leaderboard", leaderBoardRouter);

app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "OK", db: "Conectado com Sequelize" });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      status: "ERRO",
      db: "Desconectado",
      erro: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  console.log(`Servidor no http://localhost:${PORT}`);
  console.log(`Socket.IO ativo na porta ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Conexão com a base de dados bem-sucedida.");
  } catch (error) {
    console.error("Não foi possível conectar a base de dados:", error);
  }
});