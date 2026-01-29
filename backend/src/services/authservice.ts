      import User from "../models/User.js";
      import bcrypt from "bcryptjs";
      import jwt from "jsonwebtoken";

      export const registerUser = async (nome: string, email: string, senha: string) => {
        if (!nome || !email || !senha) {
          throw new Error("Por favor, preencha todos os campos.");
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new Error("Este e-mail já está sendo utilizado.");
        }

        // Criptografando a senha antes de salvar
        const hashedSenha = await bcrypt.hash(senha, 10);
        
        return await (User as any).create({ 
          nome, 
          email, 
          senha: hashedSenha 
        });
      };

      export const loginUser = async (email: string, senha: string) => {
        if (!email || !senha) {
          throw new Error("E-mail e senha são obrigatórios.");
        }

        const user: any = await User.findOne({ where: { email } });
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
          throw new Error("Senha incorreta.");
        }

        // Geração do Token JWT (usa segredo do .env ou padrão de fallback)
        const secret = process.env.JWT_SECRET || "chave_mestra_energit_2026";
        const token = jwt.sign({ id: user.id }, secret, { 
          expiresIn: "8h" 
        });

        return { 
          token, 
          user: { 
            id: user.id, 
            nome: user.nome, 
            email: user.email 
          } 
        };
      };