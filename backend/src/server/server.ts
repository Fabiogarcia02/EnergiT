    import express from "express";
    import cors from "cors";
    import dotenv from "dotenv";
    import bcrypt from "bcryptjs";
    import jwt from "jsonwebtoken";
    import sequelize from "../config/configdatabase.js";

    // Importando modelos/banco de dados
    import User from "../models/User.js";
    import Aparelho from "../models/Aparelhos.js";
    import Locais from "../models/Locais.js";
    import Comodo from "../models/Comodos.js";

    dotenv.config();
    const app = express();

    app.use(cors());
    app.use(express.json());

    // --- CONFIGURAÇÃO DE RELACIONAMENTOS (Dashboard) ---
    Locais.hasMany(Comodo, { as: 'comodos', foreignKey: 'imovelId' });
    Comodo.belongsTo(Locais, { foreignKey: 'imovelId' });
    Comodo.hasMany(Aparelho, { as: 'aparelhos', foreignKey: 'comodoId' });
    Aparelho.belongsTo(Comodo, { foreignKey: 'comodoId' });

    // 1.  DEBUG
    app.get("/api/debug", (req, res) => {
      res.send("✅ SERVIDOR ATUALIZADO: Rota de Dashboard e Metas prontas!");
    });

    // 2. ROTA DE REGISTRO
    app.post("/api/auth/register", async (req, res) => {
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
    app.post("/api/auth/login", async (req, res) => {
      try {
        const { email, senha } = req.body;
        const user: any = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(senha, user.senha))) {
          return res.status(401).json({ message: "Credenciais inválidas!" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "chave", { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, nome: user.nome } });
      } catch (error) {
        res.status(500).json({ message: "Erro interno" });
      }
    });

    // 4. ROTA DE SALVAMENTO (GERENCIAMENTO)
    app.post("/api/gerenciamento", async (req, res) => {
      try {
        const { imovel, comodos, aparelhos } = req.body;
        
        // Cria o imóvel 
        const novoImovel = await Locais.create({
          nome: imovel.nome,
          tipo: imovel.tipo,
          estado: imovel.estado,
          meta_kwh: imovel.meta_kwh || 0 // Campo para o seu Dashboard
        });

        const mapaComodosIds: Record<string, number> = {};
        for (const c of comodos) {
          const criado = await Comodo.create({
            nome: c.nome,
            icone: c.icone,
            imovelId: (novoImovel as any).id 
          });
          mapaComodosIds[c.nome] = (criado as any).id;
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

    // 5.BUSCA PARA DASHBOARD 
    app.get("/api/dashboard/dados", async (req, res) => {
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

    // 6.  ATUALIZAR META DE UM APARTAMENTO
    app.patch("/api/locais/:id/meta", async (req, res) => {
      try {
        const { id } = req.params;
        const { meta_kwh } = req.body;
        await Locais.update({ meta_kwh }, { where: { id } });
        res.json({ message: "Meta atualizada com sucesso!" });
      } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar meta" });
      }
    });

    // Inicialização
    sequelize.sync({ alter: true }) 
      .then(() => {
        console.log("✅ Banco sincronizado e tabelas atualizadas!");
        const PORT = process.env.PORT || 3333;
        app.listen(PORT, "0.0.0.0", () => {
          console.log(`🚀 Servidor rodando em: http://127.0.0.1:${PORT}`);
        });
      })
      .catch(err => console.error("❌ Falha na conexão:", err));