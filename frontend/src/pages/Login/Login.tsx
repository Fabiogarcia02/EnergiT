import { useState } from "react";
import axios from "axios";
import './Login.css';


const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar login
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3333/api/auth/login", {
        email,
        senha,
      });
      setIsLoggedIn(true); // Usuário logado com sucesso
      alert("Login realizado com sucesso!");
      navigate("/dashboard"); // Redireciona para a página do dashboard após login
    } catch (err: any) {
      setError("Credenciais inválidas!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isLoggedIn ? "logged-in" : "register"}`}>
      {/* Exibindo a imagem */}
      <div className="login-image">
        <img src="/imgs/Sun%20energy-bro.png" alt="Sun energy" />
      </div>

      <h2>{isLoggedIn ? "Login" : "Cadastro"}</h2>
      <form onSubmit={handleSubmit}>
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
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      {/* Link para redirecionar ao cadastro */}
      <div>
        <p className="signup-link" onClick={() => navigate("/signup")}>
          Não tem uma conta? Criar conta
        </p>
      </div>
    </div>
  );
};

export default Login;
