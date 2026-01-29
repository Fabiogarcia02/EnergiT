# ⚡ EnergiT - Gestão Inteligente de Energia

O **EnergiT** é uma plataforma focada em eficiência energética, permitindo que usuários monitorem, gerenciem e prevejam o consumo elétrico de seus imóveis de forma simples e intuitiva.

---

## 📸 Telas do Sistema

Aqui estão as principais interfaces do EnergiT:

### 1. Acesso ao Sistema (Login e Cadastro)
Notificações inteligentes e validação de dados garantem uma entrada segura com feedback visual via React Toastify.
<div align="center">
  <img src="./public/screenshots/login.png" width="400px" alt="Tela de Login">
  <img src="./public/screenshots/cadastro.png" width="400px" alt="Tela de Cadastro">
</div>

### 2. Painel de Gerenciamento
Interface central para cadastro de cômodos e aparelhos, permitindo a personalização total do ambiente.
<div align="center">
  <img src="./public/screenshots/gerenciamento.png" width="800px" alt="Tela de Gerenciamento">
</div>

### 3. Painel de Estatísticas
Visualização analítica dos dados de consumo, onde a mágica acontece com cálculos em tempo real baseados na tarifa da sua região (ANEEL 2024/2025).
<div align="center">
  <img src="./public/screenshots/estatisticas.png" width="800px" alt="Tela de Estatísticas">
</div>

### 4. Perfil do Usuário
Área dedicada à personalização de dados cadastrais e foto de perfil com preview dinâmico.
<div align="center">
  <img src="./public/screenshots/perfil.png" width="400px" alt="Tela de Perfil">
</div>

---

## 🚀 Funcionalidades

- **Cálculo Dinâmico:** Estimativa de consumo mensal em kWh e Reais (R$).
- **Tarifas Regionais:** Banco de dados atualizado com as tarifas de energia por estado (UF).
- **Lógica de Standby:** Cálculo preciso para aparelhos que ficam na tomada sem uso (estimativa de 2% da potência nominal).
- **Interface Dark:** Tema moderno focado no conforto visual e economia de bateria.
- **Feedback Profissional:** Integração com *React Toastify* para notificações não invasivas e intuitivas.

## 🛠️ Tecnologias

- **Frontend:** React, TypeScript, Vite, React Router Dom, Axios, React Icons.
- **UX/UI:** React Toastify (Notificações), CSS3 (Custom Modules).
- **Backend:** Node.js (API hospedada no Render).

