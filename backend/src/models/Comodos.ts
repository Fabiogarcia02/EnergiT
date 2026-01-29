      
      import { DataTypes } from 'sequelize';
      import sequelize from '../config/configdatabase.js';

      const Comodo = sequelize.define('Comodo', {
        nome: { 
          type: DataTypes.STRING, 
          allowNull: false 
        },
        icone: { 
          type: DataTypes.STRING 
        },
   
      });

      export default Comodo;