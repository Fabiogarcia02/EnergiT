import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. Configuração do Banco de Dados
import sequelize from "../config/configdatabase.js";

// 2. Importação dos Modelos
import User from "../models/User.js";
import Locais from "../models/Locais.js";
import Comodo from "../models/Comodos.js";
import Aparelho from "../models/Aparelhos.js";

dotenv.config();
const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());
app.get("/debug", (req, res) => res.send("O servidor novo está online!"));

// ==========================================
// 3. ROTAS DE AUTENTICAÇÃO (Login / Registro)
// ==========================================

// ROTA DE REGISTRO
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Este e-mail já está cadastrado!" });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hashedSenha });

    console.log(`✅ Novo usuário cadastrado: ${email}`);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error: any) {
    console.error("❌ Erro no cadastro:", error);
    res.status(500).json({ message: "Erro no cadastro", error: error.message });
  }
});

// ROTA DE LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user: any = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || "chave_mestra_energit", 
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: "Erro interno no login" });
  }
});

// ==========================================
// 4. ROTA DE GERENCIAMENTO (Salvamento)
// ==========================================
app.post("/api/gerenciamento", async (req, res) => {
  try {
    const { imovel, comodos, aparelhos } = req.body;
    console.log(`📥 Salvando gerenciamento para: ${imovel.nome}`);

    // A. Salva Imóvel
    const novoImovel: any = await Locais.create({
      nome: imovel.nome,
      tipo: imovel.tipo,
      estado: imovel.estado
    });

    // B. Salva Cômodos
    const mapaComodosIds: Record<string, number> = {};
    for (const c of comodos) {
      const criado: any = await Comodo.create({
        nome: c.nome,
        icone: c.icone,
        imovelId: novoImovel.id
      });
      mapaComodosIds[c.nome] = criado.id;
    }

    // C. Salva Aparelhos
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
  } catch (error: any) {
    console.error("❌ Erro no salvamento:", error.message);
    res.status(500).json({ error: "Falha ao salvar no banco." });
  }
});

// 5. Inicialização e Sincronização
sequelize.sync({ alter: true }) 
  .then(() => console.log("✅ Banco de dados pronto!"))
  .catch(err => console.error("❌ Erro no Banco:", err));

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 SERVIDOR RODANDO EM: http://localhost:${PORT}`);
  console.log(`👉 Rota de Teste: http://localhost:3333/api/auth/register`);
});