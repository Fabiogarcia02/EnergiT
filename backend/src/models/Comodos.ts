import { DataTypes } from 'sequelize';
import sequelize from '../config/configdatabase.js';

const Comodo = sequelize.define('Comodo', {
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  icone: { 
    type: DataTypes.STRING 
  }
});

// No Sequelize moderno com ESM, as associações podem ser feitas assim:
// Comodo.hasMany(Aparelho, { foreignKey: 'comodoId' });

export default Comodo;