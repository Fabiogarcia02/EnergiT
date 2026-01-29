import { DataTypes } from 'sequelize';
import sequelize from '../config/configdatabase.js';

// Definimos o modelo diretamente usando a instância do sequelize que já temos
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
  // Se você não tiver o arquivo Comodos configurado ainda, 
  // pode deixar o ID do cômodo como uma string simples por enquanto
  comodo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Se precisar de associações no futuro, fazemos assim:
// Aparelho.belongsTo(OutroModelo);

export default Aparelho;