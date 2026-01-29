import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/configdatabase.js';
import Locais from './Locais.js'; // Verifique se o arquivo físico é Locais.ts

class EnergyBill extends Model {
  public id!: number;
  public consumoKwh!: number;
  public valor!: number;
  public mesReferencia!: string;
  public locationId!: number;
}

EnergyBill.init({
  consumoKwh: { type: DataTypes.FLOAT, allowNull: false },
  valor: { type: DataTypes.FLOAT, allowNull: false },
  mesReferencia: { type: DataTypes.STRING, allowNull: false },
}, { 
  sequelize, 
  modelName: 'EnergyBill',
  tableName: 'energy_bills' 
});

// ✅ CORREÇÃO: Usando 'Locais' (o nome que você importou lá em cima)
Locais.hasMany(EnergyBill, { foreignKey: 'locationId' });
EnergyBill.belongsTo(Locais, { foreignKey: 'locationId' });

export default EnergyBill;