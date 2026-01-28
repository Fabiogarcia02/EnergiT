import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/rouresAuth.js"; 
import sequelize from "../config/configdatabase.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Sincronização automática com o Banco de Dados
// DICA: Se ainda der erro de "estrutura", mude alter: true para force: true uma única vez
sequelize.sync({ force: true }) 
  .then(() => console.log("✅ Banco resetado e tabelas criadas com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar ao Postgres:", err));

// Definição do prefixo das rotas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});