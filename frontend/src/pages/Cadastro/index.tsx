import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Login/Login.css'; // Usaremos o mesmo CSS para manter a consistência
import '../../App.css';
const Signup = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:3333/api/auth/register", {
        nome,
        email,
        senha,
      });
      alert("Usuário cadastrado com sucesso!");
      navigate("/login"); // Redireciona para o login após cadastrar
    } catch (err: any) {
      setError("Erro ao cadastrar o usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper signup-mode"> {/* signup-mode aplica o visual 'apagado' */}
      <div className="login-container">
        <div className="login-image">
          <img src="/imgs/Sun%20energy-bro.png" alt="Energy illustration" />
        </div>

        <div className="login-form-side">
          <h2>Crie sua conta no Ener<span>giT</span></h2>
          <p>Comece a monitorar sua economia hoje mesmo.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nome Completo</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? "Processando..." : "Cadastrar"}
            </button>
          </form>

          <p className="signup-link">
            Já tem uma conta? <span onClick={() => navigate("/login")}>Fazer Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;