import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

// Validação de segurança: se a URL não existir, o sistema avisa antes de quebrar
if (!process.env.DATABASE_URL) {
  console.error("❌ ERRO: A variável DATABASE_URL não foi encontrada no arquivo .env");
  process.exit(1); // Para a execução do servidor
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Define como true se quiser ver o SQL no terminal
  dialectOptions: {
    // Caso use bancos na nuvem (como Render ou Supabase), pode precisar de SSL:
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  }
});

// Função para testar a conexão imediatamente (opcional, mas ajuda muito)
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
};

testConnection();

export default sequelize;