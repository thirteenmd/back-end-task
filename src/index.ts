import express from 'express';
import 'dotenv/config';

import { initSequelizeClient } from './sequelize';
import { initUsersRouter } from './routers';
import { initErrorRequestHandler, initNotFoundRequestHandler } from './middleware';
import { Dialect } from 'sequelize/dist';

const PORT = process.env.PORT as string;

async function main(): Promise<void> {
  const app = express();

  // TODO(roman): store these credentials in some external configs
  // so that they don't end up in the git repo
  const sequelizeClient = await initSequelizeClient({
    dialect: process.env.DB_DIALECT as Dialect,
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as unknown as number,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
  });

  app.use(express.json());

  app.use('/api/v1/users', initUsersRouter(sequelizeClient));

  app.use('/', initNotFoundRequestHandler());

  app.use(initErrorRequestHandler());

  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.info(`app listening on port: '${PORT}'`);

      resolve();
    });
  });
}

main().then(() => console.info('app started')).catch(console.error);
