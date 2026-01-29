import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "../config/configdatabase.js";

// Importar os modelos (Certifique-se que o nome do arquivo .js é idêntico ao .ts)
import User from "../models/User.js";
import Aparelho from "../models/Aparelhos.js";
import Locais from "../models/Locais.js";
import Comodo from "../models/Comodos.js";
import Energia from "../models/Energia.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Sincronização
sequelize.sync({ alter: true }) 
  .then(() => console.log("✅ Banco sincronizado!"))
  .catch(err => console.error("❌ Erro ao sincronizar:", err));

// ROTA DE SALVAMENTO REAL
app.post("/api/gerenciamento", async (req, res) => {
  try {
    const { imovel, comodos, aparelhos } = req.body;
    console.log("📥 Recebido pedido de salvamento para:", imovel.nome);

    // 1. Criar o Imóvel
    const novoImovel = await Locais.create({
      nome: imovel.nome,
      tipo: imovel.tipo,
      estado: imovel.estado
    });

    // 2. Criar os Cômodos
    const mapaComodosIds: Record<string, number> = {};
    for (const c of comodos) {
      const criado = await Comodo.create({
        nome: c.nome,
        icone: c.icone,
        imovelId: (novoImovel as any).id 
      });
      mapaComodosIds[c.nome] = (criado as any).id;
    }

    // 3. Criar os Aparelhos
    for (const a of aparelhos) {
      await Aparelho.create({
        nome: a.nome,
        potencia: parseFloat(a.potencia),
        tempoAtivo: parseFloat(a.tempoAtivo),
        naTomada: a.naTomada,
        tempoStandby: parseFloat(a.tempoStandby),
        icone: a.icone,
        comodoId: mapaComodosIds[a.comodo] // Vincula ao ID do cômodo criado acima
      });
    }

    res.status(201).json({ message: "Dados salvos com sucesso!" });
  } catch (error) {
    console.error("❌ Erro no backend:", error);
    res.status(500).json({ error: "Erro ao salvar no banco de dados" });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ON: http://localhost:${PORT}`);
});