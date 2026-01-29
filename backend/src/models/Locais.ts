
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
      },
      // Campo de meta para o Dashboard
      meta_kwh: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
      }
    });

    export default Imovel;