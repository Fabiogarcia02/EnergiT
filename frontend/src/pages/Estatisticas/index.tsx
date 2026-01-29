        import React, { useEffect, useState, useMemo } from "react";
        import axios from "axios";
        import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
        import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
        import "./Estatisticas.css";

        const Estatisticas = () => {
        const [dados, setDados] = useState<any[]>([]);
        const [imovelSelecionado, setImovelSelecionado] = useState<string>("geral");
        const [loading, setLoading] = useState(true);
        const [editandoMeta, setEditandoMeta] = useState(false);
        const [novaMeta, setNovaMeta] = useState(0);

        const COLORS = ["#f1c40f", "#2ecc71", "#e74c3c", "#3498db", "#9b59b6", "#e67e22"];

        useEffect(() => {
            buscarDados();
        }, []);

        const buscarDados = async () => {
            try {
            const response = await axios.get("http://127.0.0.1:3333/api/dashboard/dados");
            setDados(response.data);
            } catch (err) {
            console.error("Erro ao buscar dados", err);
            } finally {
            setLoading(false);
            }
        };

        const salvarMeta = async () => {
            if (imovelSelecionado === "geral") return;
            try {
            await axios.patch(`http://127.0.0.1:3333/api/locais/${imovelSelecionado}/meta`, {
                meta_kwh: novaMeta
            });
            setEditandoMeta(false);
            buscarDados();
            } catch (err) {
            alert("Erro ao atualizar meta.");
            }
        };

        const stats = useMemo(() => {
            let filtrados = imovelSelecionado === "geral" 
            ? dados 
            : dados.filter(i => i.id.toString() === imovelSelecionado);

            let totalKwh = 0;
            let metaTotal = 0;
            const porComodo: any[] = [];

            filtrados.forEach(imovel => {
            metaTotal += imovel.meta_kwh || 0;
            imovel.comodos?.forEach((comodo: any) => {
                let kwhComodo = 0;
                comodo.aparelhos?.forEach((ap: any) => {
                kwhComodo += (ap.potencia * ap.tempoAtivo) / 1000;
                });
                totalKwh += kwhComodo;
                
                const idx = porComodo.findIndex(c => c.name === comodo.nome);
                if (idx > -1) porComodo[idx].value += kwhComodo;
                else porComodo.push({ name: comodo.nome, value: kwhComodo });
            });
            });

            return { totalKwh, metaTotal, porComodo };
        }, [dados, imovelSelecionado]);

        if (loading) return <div className="loader">Carregando inteligência...</div>;

        const estourouMeta = stats.totalKwh > stats.metaTotal && stats.metaTotal > 0;
        const porcentagem = stats.metaTotal > 0 ? (stats.totalKwh / stats.metaTotal) * 100 : 0;

        return (
            <div className="dashboard-wrapper">
            <div className="dashboard-controls">
                <h2>Dashboard Energético</h2>
                <select value={imovelSelecionado} onChange={(e) => {
                setImovelSelecionado(e.target.value);
                setEditandoMeta(false);
                }}>
                <option value="geral">Todos os Imóveis</option>
                {dados.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                </select>
            </div>

            <div className="dashboard-main-grid">
                {/* Card de Meta Dinâmica */}
                <div className={`dash-card meta-status ${estourouMeta ? "status-danger" : "status-success"}`}>
                <div className="card-header">
                    <span>CONSUMO VS META</span>
                    {imovelSelecionado !== "geral" && (
                    <button className="edit-toggle" onClick={() => {
                        setEditandoMeta(!editandoMeta);
                        setNovaMeta(stats.metaTotal);
                    }}>
                        {editandoMeta ? <FaTimes /> : <FaEdit />}
                    </button>
                    )}
                </div>

                {editandoMeta ? (
                    <div className="meta-edit-box">
                    <input type="number" value={novaMeta} onChange={(e) => setNovaMeta(Number(e.target.value))} />
                    <button onClick={salvarMeta}><FaCheck /> Salvar</button>
                    </div>
                ) : (
                    <div className="meta-value-display">
                    <strong>{stats.totalKwh.toFixed(2)}</strong>
                    <small>/ {stats.metaTotal} kWh</small>
                    </div>
                )}

                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${Math.min(porcentagem, 100)}%` }}></div>
                </div>
                <p className="status-msg">{estourouMeta ? "Meta Ultrapassada!" : "Consumo dentro da meta"}</p>
                </div>

                {/* Gráfico de Pizza */}
                <div className="dash-card chart-container">
                <h3>Divisão por Cômodos</h3>
                <div className="chart-area">
                    <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={stats.porComodo} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {stats.porComodo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            </div>
        );
        };

        export default Estatisticas;