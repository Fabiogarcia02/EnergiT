import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/configdatabase.js';

class User extends Model {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
}

User.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users' // Força o nome da tabela como 'users'
});

export default User;