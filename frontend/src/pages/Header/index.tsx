import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaHome, FaCog, FaChartBar, FaUserCircle, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <h1>Energi<span>T</span></h1>
      </div>

      {/* Navegação Principal */}
      <nav>
        <ul>
          <li><Link to="/home"><FaHome size={20} /> Home</Link></li>
          <li><Link to="/gerenciamento"><FaCog size={20} /> Gerenciamento</Link></li>
          <li><Link to="/estatisticas"><FaChartBar size={20} /> Estatísticas</Link></li>
        </ul>
      </nav>

      {/* Container do Perfil Retangular com Dropdown */}
      <div className="profile-container" ref={dropdownRef}>
        <div 
          className="profile-box-rect" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="user-name-header">{user?.name || "Usuário"}</span>
          <FaUserCircle size={22} />
        </div>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-item" onClick={() => { navigate("/perfil"); setIsDropdownOpen(false); }}>
              <FaUserAlt size={16} />
              <span>Meu Perfil</span>
            </div>
            
            <div className="dropdown-divider"></div>

            <div className="dropdown-item logout-item" onClick={handleLogout}>
              <FaSignOutAlt size={16} />
              <span>Sair</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;