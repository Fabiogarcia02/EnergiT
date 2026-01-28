import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Rota básica de teste
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// --- ADICIONE ESTA ROTA AQUI ---
app.post("/api/auth/login", (req, res) => {
  const { email, senha } = req.body;

  console.log("Tentativa de login:", email);

  // Lógica simples de teste (Substitua por busca no banco de dados depois)
  if (email === "teste@teste.com" && senha === "123456") {
    return res.status(200).json({
      message: "Login realizado!",
      token: "token-gerado-pelo-backend-123", // Simulando um JWT
      user: {
        name: "Fábio",
        email: email
      }
    });
  }

  // Se os dados estiverem errados
  return res.status(401).json({ error: "E-mail ou senha inválidos" });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});