      import React from "react";
      import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
      import Login from "./pages/Login/Login";
      import Signup from "./pages/Cadastro";
      import Homepage from "./pages/Home";
      import Header from "./pages/Header/";
      import Footer from "./pages/Footer/";
      import Gerenciamento from "./pages/Gerenciamento/";
      import Estatisticas from "./pages/Estatisticas/";
      import Perfil from "./pages/Perfil/"; // 1. Importação da nova página
      import ProtectedRoute from "./components/ProtectedRoute";
      import { AuthProvider } from "./context/AuthContext";

      const App = () => {
        return (
          <AuthProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Rotas Públicas (Sem Header/Footer) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* LAYOUT COM HEADER E FOOTER */}
                  <Route element={<LayoutWithHeaderFooter />}>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/home" element={<Homepage />} />

                    {/* ROTAS PROTEGIDAS (Exigem Login) */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/gerenciamento" element={<Gerenciamento />} />
                      <Route path="/estatisticas" element={<Estatisticas />} />
                      <Route path="/perfil" element={<Perfil />} /> {/* 2. Rota de Perfil adicionada aqui */}
                    </Route>
                  </Route>

                  {/* Redirecionamento padrão para rotas inexistentes */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        );
      };

      /**
       * Componente de Layout
       * Mantém Header no topo, Footer no rodapé e injeta as páginas no <Outlet />
       */
      const LayoutWithHeaderFooter = () => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: "#0f0f0f" }}> {/* Cor de fundo padrão para o app */}
              <Outlet /> 
            </main>
            <Footer />
          </div>
        );
      };

      export default App;