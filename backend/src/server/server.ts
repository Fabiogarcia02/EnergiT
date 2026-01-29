  import express, { Request, Response } from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import sequelize from "../config/configdatabase.js";

  // Importando modelos
  import User from "../models/User.js";
  import Aparelho from "../models/Aparelhos.js";
  import Locais from "../models/Locais.js";
  import Comodo from "../models/Comodos.js";

  dotenv.config();
  const app = express();

  // --- CONFIGURAÇÃO DE CORS PARA PRODUÇÃO ---
  app.use(cors({
    origin: [
      "http://localhost:5173", 
      "https://energi-t-awz1.vercel.app" // Sua URL oficial da Vercel
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }));

  app.use(express.json());

  // --- CONFIGURAÇÃO DE RELACIONAMENTOS ---
  Locais.hasMany(Comodo, { as: 'comodos', foreignKey: 'imovelId' });
  Comodo.belongsTo(Locais, { foreignKey: 'imovelId' });
  Comodo.hasMany(Aparelho, { as: 'aparelhos', foreignKey: 'comodoId' });
  Aparelho.belongsTo(Comodo, { foreignKey: 'comodoId' });

  // 1. DEBUG
  app.get("/api/debug", (req: Request, res: Response) => {
    res.send("✅ SERVIDOR ONLINE: Backend EnergiT conectado com sucesso!");
  });

  // 2. ROTA DE REGISTRO
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) return res.status(400).json({ message: "Campos obrigatórios!" });

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: "E-mail já cadastrado!" });

      const hashedSenha = await bcrypt.hash(senha, 10);
      await User.create({ nome, email, senha: hashedSenha });
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error: any) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  });

  // 3. ROTA DE LOGIN
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
      const user: any = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ message: "Credenciais inválidas!" });
      }

      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET || "chave_mestra_energit_2024", 
        { expiresIn: "8h" }
      );

      res.json({ 
        token, 
        user: { id: user.id, nome: user.nome, email: user.email } 
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  // 4. ROTA DE SALVAMENTO (GERENCIAMENTO)
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
      res.status(201).json({ message: "Configuração salva com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao salvar dados" });
    }
  });

  // 5. BUSCA PARA DASHBOARD 
  app.get("/api/dashboard/dados", async (req: Request, res: Response) => {
    try {
      const dados = await Locais.findAll({
        include: [{
          model: Comodo,
          as: 'comodos',
          include: [{ model: Aparelho, as: 'aparelhos' }]
        }]
      });
      res.json(dados);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados para gráficos" });
    }
  });

  // 6. ATUALIZAR META
  app.patch("/api/locais/:id/meta", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { meta_kwh } = req.body;
      await Locais.update({ meta_kwh }, { where: { id } });
      res.json({ message: "Meta atualizada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar meta" });
    }
  });

  // --- INICIALIZAÇÃO ---
  // Use 'alter: true' apenas na primeira vez para criar as tabelas no Neon
  sequelize.sync({ alter: true }) 
    .then(() => {
      console.log("✅ Banco Neon sincronizado!");
      const PORT = process.env.PORT || 3333;
      
      app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`🚀 Servidor EnergiT rodando na porta: ${PORT}`);
      });
    })
    .catch(err => {
      console.error("❌ Falha na conexão com o banco Neon:", err);
    });