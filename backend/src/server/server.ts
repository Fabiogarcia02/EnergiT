    import express, { Request, Response } from "express";
    import cors from "cors";
    import dotenv from "dotenv";
    import sequelize from "../config/configdatabase.js";

    // Importando Serviços e Modelos
    import * as AuthService from "../services/authservice.js";
    import User from "../models/User.js";
    import Aparelho from "../models/Aparelhos.js";
    import Locais from "../models/Locais.js";
    import Comodo from "../models/Comodos.js";

    dotenv.config();
    const app = express();

    // --- CONFIGURAÇÃO DE CORS REFORÇADA ---
    // O middleware cors() já responde aos requests de OPTIONS (preflight) por padrão
    app.use(cors({
      origin: true, 
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    }));

    app.use(express.json());

    // Log de monitoramento
    app.use((req, res, next) => {
      console.log(`[${new Date().toLocaleString()}] ${req.method} em ${req.url}`);
      next();
    });

    // --- RELACIONAMENTOS ---
    Locais.hasMany(Comodo, { as: 'comodos', foreignKey: 'imovelId' });
    Comodo.belongsTo(Locais, { foreignKey: 'imovelId' });
    Comodo.hasMany(Aparelho, { as: 'aparelhos', foreignKey: 'comodoId' });
    Aparelho.belongsTo(Comodo, { foreignKey: 'comodoId' });

    // --- ROTAS ---

    app.get("/api/debug", (req: Request, res: Response) => {
      res.json({ status: "online", message: "✅ Backend EnergiT rodando!" });
    });

    app.post("/api/auth/register", async (req: Request, res: Response) => {
      try {
        const { nome, email, senha } = req.body;
        const user = await AuthService.registerUser(nome, email, senha);
        res.status(201).json({ message: "Usuário criado!", userId: user.id });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    });

    app.post("/api/auth/login", async (req: Request, res: Response) => {
      try {
        const { email, senha } = req.body;
        const data = await AuthService.loginUser(email, senha);
        res.json(data);
      } catch (error: any) {
        res.status(401).json({ message: error.message });
      }
    });

    app.post("/api/gerenciamento", async (req: Request, res: Response) => {
      try {
        const { imovel, comodos, aparelhos } = req.body;
        const novoImovel: any = await Locais.create({
          nome: imovel.nome,
          tipo: imovel.tipo,
          estado: imovel.estado,
          meta_kwh: imovel.meta_kwh || 0 
        });

        const mapaComodosIds: Record<string, number> = {};
        for (const c of comodos) {
          const criado: any = await Comodo.create({
            nome: c.nome,
            icone: c.icone,
            imovelId: novoImovel.id 
          });
          mapaComodosIds[c.nome] = criado.id;
        }

        for (const a of aparelhos) {
          await Aparelho.create({
            nome: a.nome,
            potencia: parseFloat(a.potencia),
            tempoAtivo: parseFloat(a.tempoAtivo),
            naTomada: a.naTomada,
            tempoStandby: parseFloat(a.tempoStandby) || 0,
            icone: a.icone,
            comodoId: mapaComodosIds[a.comodo]
          });
        }
        res.status(201).json({ message: "Configuração salva!" });
      } catch (error) {
        res.status(500).json({ error: "Erro ao salvar dados" });
      }
    });

    // --- INICIALIZAÇÃO ---
    sequelize.sync({ alter: true }) 
      .then(() => {
        const PORT = process.env.PORT || 3333;
        app.listen(Number(PORT), "0.0.0.0", () => {
          console.log(`🚀 Servidor pronto na porta: ${PORT}`);
        });
      })
      .catch(err => console.error("❌ Erro de banco:", err));