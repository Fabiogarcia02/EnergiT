import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/configdatabase.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // CreationOptional indica que o campo pode ser omitido ao criar (pois o DB gera o ID)
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare senha: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validação extra para garantir formato de e-mail
    }
  },
  senha: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente (opcional)
});

export default User;