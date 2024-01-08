import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeContext, type Context } from '@lib/schema';
import sequelize from './core/sequelize';
import schema from './schema';

async function main() {
  await sequelize.authenticate();

  // TODO migration script
  // await sequelize.sync({ force: true });
  // console.warn('Database synchronized');

  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server, {
    context: async () => makeContext(),
  }));

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/graphql 🚀`);
  });
}

main().catch(console.error);
