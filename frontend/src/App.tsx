import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Cadastro";
import Homepage from "./pages/Home";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Gerenciamento from "./pages/Gerenciamento";
import Estatisticas from "./pages/Estatisticas";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // Importando o contexto que criamos

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* ROTAS PÚBLICAS (Sem Header/Footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* LAYOUT COM HEADER E FOOTER */}
            <Route element={<LayoutWithHeaderFooter />}>
              <Route path="/" element={<Homepage />} />

              {/* ROTAS PROTEGIDAS (Exigem Login) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/gerenciamento" element={<Gerenciamento />} />
                <Route path="/estatisticas" element={<Estatisticas />} />
              </Route>
            </Route>

            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

/**
 * Componente de Layout
 * O <Outlet /> é o "buraco" onde as páginas (Home, Gerenciamento, etc) serão injetadas.
 */
const LayoutWithHeaderFooter = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default App;