import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

// Função para cadastro de usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o email já está em uso
    const userExists = await registerUser(nome, email, senha);

    // Retorna o usuário cadastrado
    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      user: userExists,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Função de login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const token = await loginUser(email, senha);
    res.status(200).json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
