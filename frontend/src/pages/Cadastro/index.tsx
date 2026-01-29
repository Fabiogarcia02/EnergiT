    import React, { useState } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import { FaEye, FaEyeSlash } from "react-icons/fa"; 
    import '../Login/Login.css'; 
    import '../../App.css';

    const Signup = () => {
      const [nome, setNome] = useState("");
      const [email, setEmail] = useState("");
      const [senha, setSenha] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);

      const navigate = useNavigate();

   
      const API_URL = import.meta.env.VITE_API_URL || "https://energit-1.onrender.com";

      
      const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Por favor, insira um e-mail válido (ex: seu@email.com).");
          return false;
        }

        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!senhaRegex.test(senha)) {
          setError("A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, uma minúscula e um número.");
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
      
          await axios.post(`${API_URL}/api/auth/register`, {
            nome,
            email,
            senha,
          });

          alert("✅ Usuário cadastrado com sucesso!");
          navigate("/login"); 
        } catch (err: any) {
          console.error("Erro no cadastro:", err);
          const message = err.response?.data?.message || "Erro ao conectar com o servidor.";
          setError(message);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="login-page-wrapper signup-mode">
          <div className="login-container">
            <div className="login-image">
              <img src="/imgs/Sun%20energy-bro.png" alt="Energy illustration" />
            </div>

            <div className="login-form-side">
              <h2>Crie sua conta no Ener<span>giT</span></h2>
              <p>Sua jornada de economia começa aqui.</p>

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

                <div className="input-group password-field">
                  <label>Senha</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="8+ caracteres, A-z, 0-9"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      style={{ width: '100%', paddingRight: '40px' }}
                    />
                    <span 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="error-message-box" style={{ 
                    color: '#ff4d4d', 
                    fontSize: '13px', 
                    marginTop: '10px',
                    textAlign: 'center' 
                  }}>
                    {error}
                  </div>
                )}

                <button className="btn-login" type="submit" disabled={loading}>
                  {loading ? "Processando..." : "Finalizar Cadastro"}
                </button>
              </form>

              <p className="signup-link">
                Já tem uma conta? <span 
                  onClick={() => navigate("/login")}
                  style={{ cursor: 'pointer', fontWeight: 'bold', color: '#f1c40f' }}
                >
                  Fazer Login
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    };

    export default Signup;