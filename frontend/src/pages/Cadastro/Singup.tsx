import { useState } from "react";
import axios from "axios";
import './Singup.css';
const Signup = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3333/api/auth/register", {
        nome,
        email,
        senha,
      });
      alert("Usuário cadastrado com sucesso!");
    } catch (err: any) {
      setError("Erro ao cadastrar o usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
