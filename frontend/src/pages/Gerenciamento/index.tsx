    import React, { useState, useMemo, useEffect } from 'react';
    import { 
      FaPlus, FaHome, FaTv, FaDoorOpen, FaTrash, FaSave, FaPlug, 
      FaBed, FaBath, FaUtensils, FaCouch, FaLightbulb, FaSnowflake, 
      FaLaptop, FaChargingStation, FaSearch 
    } from 'react-icons/fa';
    import { toast } from 'react-toastify'; 
    import './Gerenciamento.css';

    const Gerenciamento = () => {
    
      const tarifasPorEstado: Record<string, number> = {
        'AC': 0.82, 'AL': 0.75, 'AP': 0.78, 'AM': 0.83, 'BA': 0.81, 'CE': 0.79, 'DF': 0.76, 
        'ES': 0.72, 'GO': 0.74, 'MA': 0.77, 'MT': 0.85, 'MS': 0.88, 'MG': 0.86, 'PA': 0.92, 
        'PB': 0.76, 'PR': 0.73, 'PE': 0.78, 'PI': 0.82, 'RJ': 0.95, 'RN': 0.76, 'RS': 0.81, 
        'RO': 0.79, 'RR': 0.80, 'SC': 0.69, 'SP': 0.84, 'SE': 0.75, 'TO': 0.80
      };

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

     
      const API_URL = import.meta.env.VITE_API_URL || "https://energit-1.onrender.com";

      const [listaImoveis, setListaImoveis] = useState<any[]>([]);
      const [imovelIdAtivo, setImovelIdAtivo] = useState<string | null>(null);
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

      const renderIcon = (id: string, list: any[]) => list.find(item => item.id === id)?.icon || <FaPlug />;
      const tarifaAtual = tarifasPorEstado[local.estado] || 0.80;

      useEffect(() => { fetchImoveis(); }, []);

      const fetchImoveis = async () => {
        try {
          const res = await fetch(`${API_URL}/api/dashboard/dados`);
          const data = await res.json();
          setListaImoveis(data);
        } catch (err) { console.error("Erro ao buscar lista:", err); }
      };

      const carregarImovelParaEditar = (id: string) => {
        if (id === "novo") {
          setImovelIdAtivo(null);
          setLocal({ nome: '', tipo: 'Casa', estado: 'MG' });
          setComodos([]);
          setAparelhos([]);
          toast.info("Modo: Novo Local");
          return;
        }
        const imovel = listaImoveis.find(i => i.id.toString() === id);
        if (imovel) {
          setImovelIdAtivo(id);
          setLocal({ nome: imovel.nome, tipo: imovel.tipo, estado: imovel.estado });
          setComodos(imovel.comodos.map((c: any) => ({ id: c.id, nome: c.nome, icone: c.icone })));
          const aps = imovel.comodos.flatMap((c: any) => 
            c.aparelhos.map((a: any) => ({
              id: a.id, nome: a.nome, potencia: a.potencia.toString(), comodo: c.nome,
              tempoAtivo: a.tempoAtivo.toString(), naTomada: a.naTomada,
              tempoStandby: (a.tempoStandby || 0).toString(), icone: a.icone
            }))
          );
          setAparelhos(aps);
          toast.success(`Carregado: ${imovel.nome}`);
        }
      };

      const addComodo = () => {
        if (!nomeComodo.trim()) return toast.warning("Dê um nome ao cômodo.");
        setComodos([...comodos, { id: Date.now(), nome: nomeComodo, icone: iconeComodoSel }]);
        setNomeComodo("");
        toast.success("Cômodo adicionado!");
      };

      const addAparelho = () => {
        if (!novoAparelho.nome || !novoAparelho.comodo || !novoAparelho.potencia) {
            return toast.error("Preencha Watts, Nome e Cômodo!");
        }
        setAparelhos([...aparelhos, { ...novoAparelho, id: Date.now() }]);
        setNovoAparelho({ ...novoAparelho, nome: '', potencia: '', tempoAtivo: '', naTomada: false, tempoStandby: '12', icone: 'FaPlug' });
        toast.success("Aparelho adicionado à lista!");
      };

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

      const salvarNoBackend = async () => {
        if (!local.nome || comodos.length === 0) {
            return toast.warning("⚠️ Informe o nome do local e adicione ao menos um cômodo.");
        }

        setLoading(true);
        const idToast = toast.loading("Sincronizando com o servidor...");

        try {
          const response = await fetch(`${API_URL}/api/gerenciamento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imovel: local, comodos, aparelhos }),
          });

          if (!response.ok) throw new Error("Falha ao salvar");

          toast.update(idToast, { 
            render: '✅ Configurações salvas com sucesso!', 
            type: "success", 
            isLoading: false, 
            autoClose: 3000 
          });
          fetchImoveis();
        } catch (e) { 
            toast.update(idToast, { 
                render: '❌ Erro ao salvar dados. Verifique a conexão.', 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
        }
        finally { setLoading(false); }
      };

     
      return (
        <div className="gerenciamento-wrapper">
          <header className="page-header">
            <h1 className="main-title">Gerenciamento <span>EnergiT</span></h1>
            <div className="edit-selector">
              <FaSearch className="icon-search" />
              <select className="input-dark select-edit" value={imovelIdAtivo || "novo"} onChange={e => carregarImovelParaEditar(e.target.value)}>
                <option value="novo">+ Adicionar Novo Local</option>
                {listaImoveis.map(i => <option key={i.id} value={i.id}>Editar: {i.nome}</option>)}
              </select>
            </div>
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
              <label className="text-white-label">Modo Operação</label>
              <div className="valor-destaque text-white" style={{fontSize: '1.2rem'}}>{imovelIdAtivo ? "Edição de Dados" : "Novo Registro"}</div>
            </div>
          </div>

          <div className="gerenciamento-grid">
            <section className="card-gerenciamento">
              <div className="card-header"><FaHome /> <h2>1. Localização</h2></div>
              <div className="form-group">
                <label className="label-light">Nome do Imóvel</label>
                <input className="input-dark" value={local.nome} onChange={e => setLocal({...local, nome: e.target.value})} />
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
                  <input className="input-dark" placeholder="Nome" value={novoAparelho.nome} onChange={e => setNovoAparelho({...novoAparelho, nome: e.target.value})} />
                  <input className="input-dark" type="number" placeholder="Watts" value={novoAparelho.potencia} onChange={e => setNovoAparelho({...novoAparelho, potencia: e.target.value})} />
                  <input className="input-dark" type="number" placeholder="Uso h/dia" value={novoAparelho.tempoAtivo} onChange={e => setNovoAparelho({...novoAparelho, tempoAtivo: e.target.value})} />
                  <select className="input-dark" value={novoAparelho.comodo} onChange={e => setNovoAparelho({...novoAparelho, comodo: e.target.value})}>
                    <option value="">Cômodo...</option>
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
                      <option value="6">6h</option><option value="12">12h</option>
                      <option value="18">18h</option><option value="24">24h</option>
                    </select>
                  )}
                </div>
                <button className="btn-primary" onClick={addAparelho}>+ Adicionar à Lista</button>
              </div>

              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Aparelho</th><th>Cômodo</th><th>Potência</th><th>Standby</th><th>Custo/Mês</th><th>Ação</th>
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
                          <td>{a.potencia}W</td>
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
                <button className="btn-save-final" onClick={salvarNoBackend} disabled={loading}>
                  {loading ? "Salvando..." : <><FaSave /> {imovelIdAtivo ? "Atualizar Dados" : "Salvar Configurações"}</>}
                </button>
              </div>
            </section>
          </div>
        </div>
      );
    };

    export default Gerenciamento;