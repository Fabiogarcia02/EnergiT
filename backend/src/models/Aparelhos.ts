import { DataTypes } from 'sequelize';
import sequelize from '../config/configdatabase.js';


const Aparelho = sequelize.define('Aparelho', {
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  potencia: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  tempoAtivo: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  naTomada: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  tempoStandby: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0 
  },
  icone: { 
    type: DataTypes.STRING 
  },
  
  comodo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});


export default Aparelho;