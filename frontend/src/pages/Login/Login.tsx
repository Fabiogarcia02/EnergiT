  import React, { useState, useContext } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "../../Context/AuthContext"; 
  import { FaEye, FaEyeSlash } from "react-icons/fa"; 
  import './Login.css';
  import '../../App.css';

  const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 

    
    const API_URL = import.meta.env.VITE_API_URL || "https://energit-1.onrender.com";

    const validateForm = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Por favor, insira um e-mail válido.");
        return false;
      }
      if (senha.length < 8) {
        setError("A senha deve ter no mínimo 8 caracteres.");
        return false;
      }
      return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!validateForm()) return;

      setLoading(true);

      try {
        
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          senha,
        });

        const { token, user } = response.data;
        

        login({
          token: token,
          name: user?.nome || "Usuário", 
          email: user?.email || email
        });

        // token para manter a sessão
        localStorage.setItem('authToken', token);
        
        alert("✅ Bem-vindo ao EnergiT!");
        navigate("/"); 
        
      } catch (err: any) {
        console.error("Erro no login:", err);
        const message = err.response?.data?.message || "Erro ao conectar com o servidor.";
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
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <label>Senha</label>
                <div className="password-input-container" style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
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
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </span>
                </div>
              </div>

              {error && (
                <div className="error-message" style={{ 
                  color: '#ff4d4d', 
                  fontSize: '13px', 
                  marginBottom: '15px',
                  backgroundColor: 'rgba(255, 77, 77, 0.1)',
                  padding: '8px',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? "Autenticando..." : "Entrar"}
              </button>
            </form>

            <p className="signup-link">
              Não tem uma conta? <span 
                onClick={() => navigate("/signup")} 
                style={{ cursor: 'pointer', fontWeight: 'bold', color: '#f1c40f' }}
              >
                Criar conta
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default Login;