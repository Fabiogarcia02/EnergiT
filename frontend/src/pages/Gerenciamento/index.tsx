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

  const [local, setLocal] = useState({ nome: '', tipo: 'Casa', estado: 'MG' });
  const [comodos, setComodos] = useState<any[]>([]);
  const [aparelhos, setAparelhos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
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

  const totaisGerais = useMemo(() => {
    let kwhMesTotal = 0;
    aparelhos.forEach(a => {
      const pAtiva = Number(a.potencia);
      const hAtivo = Number(a.tempoAtivo);
      const hStandby = a.naTomada ? Number(a.tempoStandby) : 0;
      const pStandby = pAtiva * 0.02;
      const consumoDiaKwh = ((pAtiva * hAtivo) + (pStandby * hStandby)) / 1000;
      kwhMesTotal += consumoDiaKwh * 30;
    });
    return {
      kwh: kwhMesTotal.toFixed(2),
      custo: (kwhMesTotal * tarifaAtual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  }, [aparelhos, tarifaAtual]);

  // --- FUNÇÃO DE SALVAMENTO ROBUSTA ---
  const salvarNoBackend = async () => {
    if (!local.nome || comodos.length === 0) {
      alert("⚠️ Preencha o nome do local e adicione ao menos um cômodo.");
      return;
    }

    setLoading(true);

    const dadosParaSalvar = {
      imovel: local,
      comodos: comodos.map(c => ({ nome: c.nome, icone: c.icone })),
      aparelhos: aparelhos.map(a => ({
        nome: a.nome,
        potencia: Number(a.potencia),
        comodo: a.comodo,
        tempoAtivo: Number(a.tempoAtivo),
        naTomada: a.naTomada,
        tempoStandby: Number(a.tempoStandby) || 0,
        icone: a.icone
      }))
    };

    try {
      // Forçando o IP 127.0.0.1 para garantir que o Windows encontre o Node.js
      const response = await fetch('http://127.0.0.1:3333/api/gerenciamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (response.ok) {
        alert('✅ Sucesso! Seus dados de energia foram salvos.');
      } else {
        const errorData = await response.json();
        console.error("Erro retornado pelo servidor:", errorData);
        alert(`❌ Erro: ${errorData.message || 'Falha ao salvar no banco.'}`);
      }
    } catch (error) {
      console.error('Erro crítico de conexão:', error);
      alert('❌ Servidor Offline! Certifique-se de que o seu Backend está rodando no terminal.');
    } finally {
      setLoading(false);
    }
  };

  const addComodo = () => {
    if (!nomeComodo.trim()) return;
    setComodos([...comodos, { id: Date.now(), nome: nomeComodo, icone: iconeComodoSel }]);
    setNomeComodo("");
  };

  const addAparelho = () => {
    if (!novoAparelho.nome || !novoAparelho.comodo || !novoAparelho.potencia) {
      alert("Preencha Nome, Watts e Cômodo!");
      return;
    }
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
          <div className="valor-destaque text-white" style={{fontSize: '1.4rem'}}>{local.nome || 'Pendente'}</div>
          <small className="text-white-dim">{local.tipo} | {local.estado}</small>
        </div>
      </div>

      <div className="gerenciamento-grid">
        {/* 1. LOCALIZAÇÃO */}
        <section className="card-gerenciamento">
          <div className="card-header"><FaHome /> <h2>1. Localização</h2></div>
          <div className="form-group">
            <label className="label-light">Nome do Imóvel</label>
            <input className="input-dark" placeholder="Ex: Minha Casa" value={local.nome} onChange={e => setLocal({...local, nome: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label-light">Tipo</label>
              <select className="input-dark" value={local.tipo} onChange={e => setLocal({...local, tipo: e.target.value})}>
                <option>Casa</option><option>Apartamento</option><option>Escritório</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label-light">Estado</label>
              <select className="input-dark" value={local.estado} onChange={e => setLocal({...local, estado: e.target.value})}>
                {Object.keys(tarifasPorEstado).map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* 2. CÔMODOS */}
        <section className="card-gerenciamento">
          <div className="card-header"><FaDoorOpen /> <h2>2. Cômodos</h2></div>
          <div className="icon-selector-row">
            {iconesComodos.map(i => (
              <button key={i.id} className={`icon-btn ${iconeComodoSel === i.id ? 'active' : ''}`} onClick={() => setIconeComodoSel(i.id)}>{i.icon}</button>
            ))}
          </div>
          <div className="input-with-button">
            <input className="input-dark" placeholder="Nome do Cômodo" value={nomeComodo} onChange={e => setNomeComodo(e.target.value)} />
            <button className="btn-square-add" onClick={addComodo}><FaPlus /></button>
          </div>
          <div className="badges-list">
            {comodos.map(c => <span key={c.id} className="rect-badge">{renderIcon(c.icone, iconesComodos)} {c.nome}</span>)}
          </div>
        </section>

        {/* 3. APARELHOS */}
        <section className="card-gerenciamento full-width">
          <div className="card-header"><FaTv /> <h2>3. Registro de Aparelhos</h2></div>
          
          <div className="aparelho-form-top">
            <div className="form-group">
              <label className="label-light">Ícone:</label>
              <div className="icon-selector-row">
                {iconesAparelhos.map(i => (
                  <button key={i.id} className={`icon-btn ${novoAparelho.icone === i.id ? 'active' : ''}`} onClick={() => setNovoAparelho({...novoAparelho, icone: i.id})}>{i.icon}</button>
                ))}
              </div>
            </div>

            <div className="aparelho-inputs-grid">
              <input className="input-dark" placeholder="Nome do Aparelho" value={novoAparelho.nome} onChange={e => setNovoAparelho({...novoAparelho, nome: e.target.value})} />
              <input className="input-dark" type="number" placeholder="Watts (W)" value={novoAparelho.potencia} onChange={e => setNovoAparelho({...novoAparelho, potencia: e.target.value})} />
              <input className="input-dark" type="number" placeholder="Uso (h/dia)" value={novoAparelho.tempoAtivo} onChange={e => setNovoAparelho({...novoAparelho, tempoAtivo: e.target.value})} />
              <select className="input-dark" value={novoAparelho.comodo} onChange={e => setNovoAparelho({...novoAparelho, comodo: e.target.value})}>
                <option value="">Selecione o Cômodo</option>
                {comodos.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>

            <div className="standby-logic-area">
              <label className="checkbox-group">
                <input type="checkbox" checked={novoAparelho.naTomada} onChange={e => setNovoAparelho({...novoAparelho, naTomada: e.target.checked})} />
                <span className="text-white-dim">Fica na tomada em Standby?</span>
              </label>
              {novoAparelho.naTomada && (
                <select className="input-dark" value={novoAparelho.tempoStandby} onChange={e => setNovoAparelho({...novoAparelho, tempoStandby: e.target.value})}>
                  <option value="6">6h Standby</option>
                  <option value="12">12h Standby</option>
                  <option value="18">18h Standby</option>
                  <option value="24">24h Standby</option>
                </select>
              )}
            </div>
            <button className="btn-primary" onClick={addAparelho}>+ Adicionar à Lista</button>
          </div>

          {/* TABELA */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Aparelho</th>
                  <th>Cômodo</th>
                  <th>Consumo</th>
                  <th>Standby</th>
                  <th>Custo/Mês</th>
                  <th>Remover</th>
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
                      <td>{a.potencia}W ({a.tempoAtivo}h)</td>
                      <td style={{color: a.naTomada ? '#ffbc00' : '#555'}}>{a.naTomada ? `${pStandby.toFixed(1)}W` : 'Não'}</td>
                      <td className="text-yellow">{custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td><button className="btn-del-icon" onClick={() => setAparelhos(aparelhos.filter(x => x.id !== a.id))}><FaTrash /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="save-action-area">
            <button 
              className="btn-save-final" 
              onClick={salvarNoBackend} 
              disabled={loading}
            >
              {loading ? "Salvando..." : <><FaSave /> Salvar configurações</>}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gerenciamento;