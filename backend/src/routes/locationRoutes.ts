import { Router, Request, Response } from 'express';
import Location from '../models/Location.js';
import EnergyBill from '../models/EnergyBill.js';

const router = Router();

// --- CRIAR NOVO LOCAL (Casa/Apto) ---
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { nome, tipo, userId } = req.body;

    if (!nome || !tipo || !userId) {
      return res.status(400).json({ message: 'Dados incompletos!' });
    }

    const location = await Location.create({ nome, tipo, userId });
    res.status(201).json({ message: 'Local cadastrado com sucesso!', location });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao cadastrar local', error: error.message });
  }
});

// --- LISTAR LOCAIS DE UM USUÁRIO ---
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const locations = await Location.findAll({ where: { userId } });
    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar locais', error: error.message });
  }
});

// --- REGISTRAR GASTO ENERGÉTICO ---
router.post('/energy', async (req: Request, res: Response) => {
  try {
    const { consumoKwh, valor, mesReferencia, locationId } = req.body;

    if (!consumoKwh || !valor || !mesReferencia || !locationId) {
      return res.status(400).json({ message: 'Preencha todos os campos do gasto!' });
    }

    const bill = await EnergyBill.create({ consumoKwh, valor, mesReferencia, locationId });
    res.status(201).json({ message: 'Gasto registrado com sucesso!', bill });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao registrar gasto', error: error.message });
  }
});

export default router;