    import { Sequelize } from 'sequelize';
    import dotenv from 'dotenv';

    dotenv.config();

    const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
      dialect: 'postgres',
      logging: false, 
      dialectOptions: {
        // ATIVE ISSO PARA O NEON FUNCIONAR:
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });

    export default sequelize;