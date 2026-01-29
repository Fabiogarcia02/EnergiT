import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Validação de segurança
if (!process.env.DATABASE_URL) {
  console.error("❌ ERRO: A variável DATABASE_URL não foi encontrada no arquivo .env");
  // Removi o process.exit(1) para evitar que o nodemon entre em loop infinito de erro
}

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false, 
  dialectOptions: {
    // Se estiver usando Supabase/Render, descomente as linhas abaixo:
    /*
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
    */
  }
});

// Removi a chamada automática de testConnection() aqui para evitar 
// que ela rode antes do Sequelize terminar de carregar os modelos no server.ts.

export default sequelize;