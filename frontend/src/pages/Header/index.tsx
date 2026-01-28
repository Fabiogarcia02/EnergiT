import React from 'react';
import { FaHome, FaCog, FaChartBar, FaUserCircle } from 'react-icons/fa'; // Importando ícones
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <h1>EnergiT</h1>
      </div>

      {/* Navegação */}
      <nav>
        <ul>
          <li><a href="/home"><FaHome size={20} /> Home</a></li>
          <li><a href="/gerenciamento"><FaCog size={20} /> Gerenciamento</a></li>
          <li><a href="/estatisticas"><FaChartBar size={20} /> Estatísticas</a></li>
        </ul>
      </nav>

      {/* Ícone de Perfil */}
      <div className="profile-icon">
        <FaUserCircle size={30} />
      </div>
    </header>
  );
};

export default Header;
