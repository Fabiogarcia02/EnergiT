import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importando os ícones
import './Login.css';
import '../../App.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/esconder senha
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  // Função de validação local
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Pelo menos 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }
    if (!passwordRegex.test(senha)) {
      setError("A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return; // Valida antes de enviar ao backend

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3333/api/auth/login", {
        email,
        senha,
      });

      login({
        token: response.data.token,
        name: response.data.user?.nome || "Usuário", 
        email: email
      });

      localStorage.setItem('authToken', response.data.token);
      alert("Login realizado com sucesso!");
      navigate("/"); 
      
    } catch (err: any) {
      const message = err.response?.data?.message || "Credenciais inválidas ou erro no servidor.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-image">
          <img src="/imgs/Sun%20energy-bro.png" alt="Sun energy" />
        </div>

        <div className="login-form-side">
          <h2>Bem-vindo ao Ener<span>giT</span></h2>
          <p>Gerencie sua energia de forma inteligente.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Ex: seuemail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <div className="password-input-container" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"} // Alterna o tipo
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ width: '100%' }}
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </span>
              </div>
            </div>

            {error && <div className="error-message" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>

          <p className="signup-link">
            Não tem uma conta? <span onClick={() => navigate("/signup")}>Criar conta</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;