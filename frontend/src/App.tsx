    import React from "react";
    import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
    import { ToastContainer } from "react-toastify"; // Importa o container
    import "react-toastify/dist/ReactToastify.css"; // Importa o estilo CSS

    import Login from "./pages/Login/Login";
    import Signup from "./pages/Cadastro";
    import Homepage from "./pages/Home";
    import Header from "./pages/Header/";
    import Footer from "./pages/Footer/";
    import Gerenciamento from "./pages/Gerenciamento/";
    import Estatisticas from "./pages/Estatisticas/";
    import Perfil from "./pages/Perfil/";
    import ProtectedRoute from "./Components/ProtectedRoute";
    import { AuthProvider } from "./Context/AuthContext";

    const App = () => {
      return (
        <AuthProvider>
          <Router>
            <div className="App">
              {/* O ToastContainer deve ficar no nível global para aparecer em qualquer página */}
              <ToastContainer 
                position="top-right"
                autoClose={3000} // Fecha sozinho em 3 segundos
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" // Combina com o tema escuro do EnergiT
              />
              
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* LAYOUT COM HEADER E FOOTER */}
                <Route element={<LayoutWithHeaderFooter />}>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/home" element={<Homepage />} />

                  {/* ROTAS PROTEGIDAS */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/gerenciamento" element={<Gerenciamento />} />
                    <Route path="/estatisticas" element={<Estatisticas />} />
                    <Route path="/perfil" element={<Perfil />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      );
    };

    const LayoutWithHeaderFooter = () => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
            <Outlet /> 
          </main>
          <Footer />
        </div>
      );
    };

    export default App;