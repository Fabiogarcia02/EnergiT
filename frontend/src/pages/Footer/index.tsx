import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="logo-text">Ener<span>git</span></h2>
          <p>Sua casa inteligente, sua energia sob controle. Monitore, economize e transforme sua relação com a eletricidade.</p>
        </div>
        
        <div className="footer-nav">
          <h4>Navegação</h4>
          <a href="/">Início</a>
          <a href="/gerenciamento">Gerenciamento</a>
          <a href="/estatisticas">Estatísticas</a>
          <a href="#">Privacidade</a>
        </div>

        <div className="social-links">
          <h4>Siga-nos</h4>
          <div className="icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 EnergiT. Todos os direitos reservados.</p>
        <p className="footer-location">Belo Horizonte, MG</p>
      </div>
    </footer>
  );
};

export default Footer;