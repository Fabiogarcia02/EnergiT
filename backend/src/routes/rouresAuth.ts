import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// --- REGISTRO ---
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Preencha todos os campos!' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado!' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hashedSenha });

    console.log(`✅ Novo usuário cadastrado: ${email}`);
    res.status(201).json({ message: 'Usuário criado!', user: { id: user.id, nome, email } });
  } catch (error: any) {
    console.error("❌ Erro no cadastro:", error.message);
    res.status(500).json({ message: 'Erro no cadastro', error: error.message });
  }
});

// --- LOGIN ---
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    console.log(`\n🔑 Tentativa de login: ${email}`);

    // Busca o usuário
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("⚠️ Usuário não encontrado no banco.");
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // O PULO DO GATO: Extraímos os dados puros para garantir que 'senha' seja lida
    const userData = user.get(); 

    if (!userData.senha) {
      console.error("❌ Erro grave: Senha não encontrada para este usuário no banco.");
      return res.status(500).json({ message: 'Erro na estrutura do banco de dados.' });
    }

    // Compara a senha enviada com a do banco
    const isMatch = await bcrypt.compare(senha, userData.senha);
    
    if (!isMatch) {
      console.log("⚠️ Senha incorreta.");
      return res.status(400).json({ message: 'Senha incorreta!' });
    }

    // Usa o seu JWT_SECRET do .env
    const secret = process.env.JWT_SECRET || 'chave_mestra_energit';

    const token = jwt.sign(
      { id: user.id }, 
      secret, 
      { expiresIn: '1h' }
    );

    console.log("✅ Login bem-sucedido!");

    res.status(200).json({ 
      token, 
      user: { id: user.id, nome: userData.nome, email: userData.email } 
    });

  } catch (error: any) {
    // Esse log vai te dizer EXATAMENTE o que causou o erro 500 no seu terminal
    console.error("❌ ERRO INTERNO NO LOGIN:", error);
    res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
});

export default router;