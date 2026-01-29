        import React, { useState, useContext, useRef } from 'react';
        import { FaCamera, FaSave, FaUser, FaEnvelope, FaIdCard } from 'react-icons/fa';
        import { toast } from 'react-toastify'; // Importando o toast
        import { AuthContext } from '../../Context/AuthContext';
        import './Perfil.css';

        const Perfil = () => {
        const { user, updateUser } = useContext(AuthContext);
        const [nome, setNome] = useState(user?.name || "");
        const [email, setEmail] = useState(user?.email || "");
        const [preview, setPreview] = useState(user?.avatarUrl || null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
           
            if (file.size > 2 * 1024 * 1024) {
                return toast.error("A imagem deve ter no máximo 2MB");
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                toast.info("Prévia da foto carregada!");
            };
            reader.readAsDataURL(file);
            }
        };

        const handleSave = () => {
            if (!nome.trim() || !email.trim()) {
            return toast.warning("Nome e E-mail são obrigatórios!");
            }

            try {
            updateUser({
                name: nome,
                email: email,
                avatarUrl: preview
            });
            
           
            toast.success("✨ Perfil atualizado com sucesso!");
            } catch (error) {
            toast.error("Erro ao atualizar perfil.");
            }
        };

        return (
            <div className="perfil-container">
            <div className="perfil-card">
                <div className="perfil-header">
                <FaIdCard className="title-icon" />
                <h2>Meu Perfil</h2>
                <p>Gerencie suas informações pessoais</p>
                </div>
                
                <div className="avatar-section">
                <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
                    {preview ? (
                    <img src={preview} alt="Avatar" className="avatar-img" />
                    ) : (
                    <div className="avatar-placeholder">
                        <FaUser size={40} />
                    </div>
                    )}
                    <div className="avatar-overlay">
                    <FaCamera />
                    </div>
                </div>
                <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                <span className="avatar-tip">Alterar foto</span>
                </div>

                <div className="perfil-form">
                <div className="input-group-perfil">
                    <label><FaUser /> Nome Completo</label>
                    <input 
                    type="text" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    placeholder="Digite seu nome"
                    />
                </div>

                <div className="input-group-perfil">
                    <label><FaEnvelope /> E-mail</label>
                    <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="seu@email.com"
                    />
                </div>

                <button onClick={handleSave} className="btn-salvar-perfil">
                    <FaSave /> Salvar Alterações
                </button>
                </div>
            </div>
            </div>
        );
        };

        export default Perfil;