    import User from "../models/User.js";
    import bcrypt from "bcryptjs";
    import jwt from "jsonwebtoken";

    export const registerUser = async (nome: string, email: string, senha: string) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new Error("Este e-mail já está em uso.");

      const hashedSenha = await bcrypt.hash(senha, 10);
      return await (User as any).create({ nome, email, senha: hashedSenha });
    };

    export const loginUser = async (email: string, senha: string) => {
      const user: any = await User.findOne({ where: { email } });
      if (!user) throw new Error("E-mail não encontrado.");

      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) throw new Error("Senha incorreta.");

      const secret = process.env.JWT_SECRET || "chave_segura_energit_2026";
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: "8h" });

      return { token, user: { id: user.id, nome: user.nome, email: user.email } };
    };