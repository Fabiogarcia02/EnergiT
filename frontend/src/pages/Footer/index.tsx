import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="logo-text">Ener<span>git</span></h2>
          <p>Sua casa inteligente, sua energia sob controle.</p>
        </div>
        
        <div className="footer-nav">
          <h4>Navegação</h4>
          <a href="#">Termos de Uso</a>
          <a href="#">Privacidade</a>
          <a href="#">Contato</a>
        </div>

        <div className="social-links">
          <h4>Siga-nos</h4>
          <div className="icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 EnergiT. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;