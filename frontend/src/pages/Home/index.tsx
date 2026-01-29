import React from 'react';
import { FaHome, FaPlug, FaChartBar, FaCheckCircle } from 'react-icons/fa';
import './Homepage.css';
import '../../App.css';
const Homepage = () => {
  return (
    <main className="homepage-container">
  
      <section className="hero">
        <div className="hero-content">
          <h1>Controle sua Energia,<br/><span>Economize o Planeta</span></h1>
          <p>Com EnergiT, você gerencia o consumo da sua casa em tempo real, economizando recursos e dinheiro.</p>
          <button className="btn-primary">Saiba Mais</button>
        </div>
        <div className="hero-image">
        
          <img src="/imgs/undraw_best-place_dhzp.svg" alt="Smart Home " />
        </div>
      </section>

      {/* ACTIONS: Os 3 cards flutuantes */}
      <section className="actions-grid">
        <div className="action-card">
         <div className="icon-wrapper"><FaHome color="#121212" /></div>
          <h2>Gerencie Cômodos</h2>
          <p>Adicione e personalize os cômodos para monitoramento individual.</p>
        </div>
        <div className="action-card">
        <div className="icon-wrapper"><FaPlug color="#121212" /></div>
          <h2>Conecte Aparelhos</h2>
          <p>Cadastre aparelhos e monitore o gasto de cada um em tempo real.</p>
        </div>
        <div className="action-card">
       <div className="icon-wrapper"><FaChartBar color="#121212" /></div>
          <h2>Visualize o Consumo</h2>
          <p>Relatórios detalhados com gráficos intuitivos para sua gestão.</p>
        </div>
      </section>

  
      <section className="how-it-works">
        <div className="info-block">
            <img src="/imgs/undraw_electricity_iu6d.svg" alt="Processo" className="side-img" />
            <div className="steps">
                <h2>Como Funciona?</h2>
                <ul>
                    <li><FaCheckCircle className="check"/> 1. Cadastre-se na plataforma</li>
                    <li><FaCheckCircle className="check"/> 2. Adicione seus Imóveis</li>
                    <li><FaCheckCircle className="check"/> 3. Configure Cômodos e Aparelhos</li>
                    <li><FaCheckCircle className="check"/> 4. Monitore e Economize</li>
                </ul>
            </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;