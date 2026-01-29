import { DataTypes } from 'sequelize';
import sequelize from '../config/configdatabase.js';

const Imovel = sequelize.define('Imovel', {
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  tipo: { 
    type: DataTypes.STRING, 
    defaultValue: 'Casa' 
  },
  estado: { 
    type: DataTypes.STRING(2), 
    allowNull: false 
  }
});

// Associações (Exemplo de como fazer no modelo novo se necessário)
// Imovel.hasMany(Comodo, { foreignKey: 'imovelId', as: 'comodos' });

export default Imovel;