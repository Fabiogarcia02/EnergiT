import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Verificar se o usuário está autenticado
  const isAuthenticated = localStorage.getItem("authToken");

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota protegida
  return <Outlet />;
};

export default ProtectedRoute;
