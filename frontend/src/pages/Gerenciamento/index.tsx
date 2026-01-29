import React, { useState, useMemo } from 'react';
import { 
  FaPlus, FaHome, FaTv, FaDoorOpen, FaTrash, FaSave, FaPlug, 
  FaBed, FaBath, FaUtensils, FaCouch, FaLightbulb, FaSnowflake, 
  FaLaptop, FaChargingStation 
} from 'react-icons/fa';
import './Gerenciamento.css';

const Gerenciamento = () => {
  // Tarifas ANEEL 2024/2025
  const tarifasPorEstado: Record<string, number> = {
    'AC': 0.82, 'AL': 0.75, 'AP': 0.78, 'AM': 0.83, 'BA': 0.81, 'CE': 0.79, 'DF': 0.76, 
    'ES': 0.72, 'GO': 0.74, 'MA': 0.77, 'MT': 0.85, 'MS': 0.88, 'MG': 0.86, 'PA': 0.92, 
    'PB': 0.76, 'PR': 0.73, 'PE': 0.78, 'PI': 0.82, 'RJ': 0.95, 'RN': 0.76, 'RS': 0.81, 
    'RO': 0.79, 'RR': 0.80, 'SC': 0.69, 'SP': 0.84, 'SE': 0.75, 'TO': 0.80
  };

  // Estados dos Dados
  const [local, setLocal] = useState({ nome: '', tipo: 'Casa', estado: 'MG' });
  const [comodos, setComodos] = useState<any[]>([]);
  const [aparelhos, setAparelhos] = useState<any[]>([]);
  
  // Estados dos Formulários
  const [nomeComodo, setNomeComodo] = useState("");
  const [iconeComodoSel, setIconeComodoSel] = useState("FaDoorOpen");
  const [novoAparelho, setNovoAparelho] = useState({
    nome: '', potencia: '', comodo: '', tempoAtivo: '',
    naTomada: false, tempoStandby: '12', icone: 'FaPlug'
  });

  const iconesComodos = [
    { id: 'FaDoorOpen', icon: <FaDoorOpen /> },
    { id: 'FaCouch', icon: <FaCouch /> },
    { id: 'FaBed', icon: <FaBed /> },
    { id: 'FaUtensils', icon: <FaUtensils /> },
    { id: 'FaBath', icon: <FaBath /> }
  ];

  const iconesAparelhos = [
    { id: 'FaPlug', icon: <FaPlug /> },
    { id: 'FaTv', icon: <FaTv /> },
    { id: 'FaSnowflake', icon: <FaSnowflake /> },
    { id: 'FaLightbulb', icon: <FaLightbulb /> },
    { id: 'FaLaptop', icon: <FaLaptop /> },
    { id: 'FaChargingStation', icon: <FaChargingStation /> }
  ];

  const tarifaAtual = tarifasPorEstado[local.estado] || 0.80;

  // Cálculo de Totais
  const totaisGerais = useMemo(() => {
    let kwhMesTotal = 0;
    aparelhos.forEach(a => {
      const pAtiva = Number(a.potencia);
      const hAtivo = Number(a.tempoAtivo);
      const hStandby = a.naTomada ? Number(a.tempoStandby) : 0;
      const pStandby = pAtiva * 0.02; // Estimação de 2% para standby
      const consumoDiaKwh = ((pAtiva * hAtivo) + (pStandby * hStandby)) / 1000;
      kwhMesTotal += consumoDiaKwh * 30;
    });
    return {
      kwh: kwhMesTotal.toFixed(2),
      custo: (kwhMesTotal * tarifaAtual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  }, [aparelhos, tarifaAtual]);


 // --- FUNÇÃO DE SALVAR ---
  const salvarNoBackend = async () => {
    const dadosParaSalvar = {
      imovel: local,
      comodos: comodos,
      aparelhos: aparelhos,
      consumoTotalKwh: totaisGerais.kwh,
      custoTotalEstimado: totaisGerais.custo
    };

    try {
      // Removida a vírgula extra que causava o erro de sintaxe
      const response = await fetch('http://localhost:3333/api/gerenciamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (response.ok) {
        alert('✅ Dados salvos com sucesso!');
      } else {
        const errorData = await response.json();
        alert(`❌ Erro do servidor: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('❌ Erro de conexão: Certifique-se que o servidor (backend) está rodando na porta 3333.');
    }
  };
  // -----------------------------

  const addComodo = () => {
    if (!nomeComodo) return;
    setComodos([...comodos, { id: Date.now(), nome: nomeComodo, icone: iconeComodoSel }]);
    setNomeComodo("");
  };

  const addAparelho = () => {
    if (!novoAparelho.nome || !novoAparelho.comodo || !novoAparelho.potencia) return;
    setAparelhos([...aparelhos, { ...novoAparelho, id: Date.now() }]);
    setNovoAparelho({ ...novoAparelho, nome: '', potencia: '', tempoAtivo: '', naTomada: false, tempoStandby: '12', icone: 'FaPlug' });
  };

  const renderIcon = (id: string, list: any[]) => list.find(item => item.id === id)?.icon || <FaPlug />;

  return (
    <div className="gerenciamento-wrapper">
      <header className="page-header">
        <h1 className="main-title">Gerenciamento <span>EnergiT</span></h1>
      </header>

      <div className="dashboard-resumo">
        <div className="resumo-card">
          <label className="text-white-label">Consumo Mensal Estimado</label>
          <div className="valor-destaque text-white">{totaisGerais.kwh} <span>kWh</span></div>
        </div>
        <div className="resumo-card yellow">
          <label className="label-dark">Gasto Mensal Estimado</label>
          <div className="valor-destaque label-dark">{totaisGerais.custo}</div>
        </div>
        <div className="resumo-card">
          <label className="text-white-label">Imóvel Selecionado</label>
          <div className="valor-destaque text-white" style={{fontSize: '1.4rem'}}>{local.nome || 'Nome do Imóvel'}</div>
          <small className="text-white-dim">{local.tipo} | {local.estado} (R${tarifaAtual.toFixed(2)}/kWh)</small>
        </div>
      </div>

      <div className="gerenciamento-grid">
        {/* CARD 1: LOCALIZAÇÃO */}
        <section className="card-gerenciamento">
          <div className="card-header"><FaHome /> <h2>1. Localização</h2></div>
          <div className="form-group">
            <label className="label-light">Nome do Imóvel / Apartamento</label>
            <input className="input-dark" placeholder="Ex: Apto 402" value={local.nome} onChange={e => setLocal({...local, nome: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label-light">Tipo</label>
              <select className="input-dark" value={local.tipo} onChange={e => setLocal({...local, tipo: e.target.value})}>
                <option>Casa</option><option>Apartamento</option><option>Escritório</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label-light">Estado (Tarifa)</label>
              <select className="input-dark" value={local.estado} onChange={e => setLocal({...local, estado: e.target.value})}>
                {Object.keys(tarifasPorEstado).map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* CARD 2: CÔMODOS */}
        <section className="card-gerenciamento">
          <div className="card-header"><FaDoorOpen /> <h2>2. Cômodos</h2></div>
          <label className="label-light">Escolha um ícone para o cômodo:</label>
          <div className="icon-selector-row">
            {iconesComodos.map(i => (
              <button key={i.id} className={`icon-btn ${iconeComodoSel === i.id ? 'active' : ''}`} onClick={() => setIconeComodoSel(i.id)}>{i.icon}</button>
            ))}
          </div>
          <div className="input-with-button">
            <input className="input-dark" placeholder="Nome do Cômodo (Ex: Sala)" value={nomeComodo} onChange={e => setNomeComodo(e.target.value)} />
            <button className="btn-square-add" onClick={addComodo}><FaPlus /></button>
          </div>
          <div className="badges-list">
            {comodos.map(c => <span key={c.id} className="rect-badge">{renderIcon(c.icone, iconesComodos)} {c.nome}</span>)}
          </div>
        </section>

        {/* CARD 3: APARELHOS */}
        <section className="card-gerenciamento full-width">
          <div className="card-header"><FaTv /> <h2>3. Registro de Aparelhos</h2></div>
          
          <div className="aparelho-form-top">
            <div className="form-group">
              <label className="label-light">Selecione o Ícone:</label>
              <div className="icon-selector-row">
                {iconesAparelhos.map(i => (
                  <button key={i.id} className={`icon-btn ${novoAparelho.icone === i.id ? 'active' : ''}`} onClick={() => setNovoAparelho({...novoAparelho, icone: i.id})}>{i.icon}</button>
                ))}
              </div>
            </div>

            <div className="aparelho-inputs-grid">
              <div className="form-group">
                <label className="label-light">Nome</label>
                <input className="input-dark" placeholder="Ex: TV LED" value={novoAparelho.nome} onChange={e => setNovoAparelho({...novoAparelho, nome: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label-light">Watts</label>
                <input className="input-dark" type="number" placeholder="W" value={novoAparelho.potencia} onChange={e => setNovoAparelho({...novoAparelho, potencia: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label-light">Uso (h/dia)</label>
                <input className="input-dark" type="number" placeholder="h" value={novoAparelho.tempoAtivo} onChange={e => setNovoAparelho({...novoAparelho, tempoAtivo: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label-light">Cômodo</label>
                <select className="input-dark" value={novoAparelho.comodo} onChange={e => setNovoAparelho({...novoAparelho, comodo: e.target.value})}>
                  <option value="">Onde está?</option>
                  {comodos.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                </select>
              </div>
            </div>

            <div className="standby-logic-area">
              <div className="checkbox-group">
                <input type="checkbox" id="tomada" checked={novoAparelho.naTomada} onChange={e => setNovoAparelho({...novoAparelho, naTomada: e.target.checked})} />
                <label htmlFor="tomada" className="text-white-dim">Fica conectado na tomada mesmo sem uso?</label>
              </div>
              {novoAparelho.naTomada && (
                <div className="form-group fade-in">
                  <label className="label-light">Horas inativo na tomada:</label>
                  <select className="input-dark" value={novoAparelho.tempoStandby} onChange={e => setNovoAparelho({...novoAparelho, tempoStandby: e.target.value})}>
                    <option value="6">6 Horas</option>
                    <option value="12">12 Horas</option>
                    <option value="18">18 Horas</option>
                    <option value="24">Sempre (24h)</option>
                  </select>
                </div>
              )}
            </div>
            <button className="btn-primary" onClick={addAparelho}>+ Adicionar Aparelho</button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Aparelho</th>
                  <th>Cômodo</th>
                  <th>Ativo</th>
                  <th>Standby</th>
                  <th>Custo Mensal</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {aparelhos.map(a => {
                  const pStandby = Number(a.potencia) * 0.02;
                  const hStandby = a.naTomada ? Number(a.tempoStandby) : 0;
                  const custo = (((Number(a.potencia) * Number(a.tempoAtivo)) + (pStandby * hStandby)) / 1000) * 30 * tarifaAtual;
                  return (
                    <tr key={a.id}>
                      <td className="td-with-icon">{renderIcon(a.icone, iconesAparelhos)} {a.nome}</td>
                      <td>{a.comodo}</td>
                      <td>{a.potencia}W / {a.tempoAtivo}h</td>
                      <td style={{color: a.naTomada ? '#ff6b6b' : '#666'}}>{a.naTomada ? `${pStandby.toFixed(1)}W (${a.tempoStandby}h)` : 'Off'}</td>
                      <td className="text-yellow">{custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td><button className="btn-del-icon" onClick={() => setAparelhos(aparelhos.filter(x => x.id !== a.id))}><FaTrash /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* BOTÃO DE SALVAR FINALIZADO */}
          <div className="save-action-area" style={{ marginTop: '30px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={salvarNoBackend} style={{ background: '#27ae60', padding: '15px 35px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <FaSave />  Salvar no Sistema
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gerenciamento;