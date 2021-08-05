import { BuildContextArgs, CreateApp, InferContext } from '@graphql-ez/fastify';
import { ezGraphiQLIDE } from '@graphql-ez/plugin-graphiql';
import { ezScalars } from '@graphql-ez/plugin-scalars';
import { ezSchema } from '@graphql-ez/plugin-schema';
import { ezWebSockets } from '@graphql-ez/plugin-websockets';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { schema } from './modules';
import { getUserId } from './utils/utils';

// Initialize a pubsub instance to emit events to be used for GraphQL Subscriptions

export const pubsub = new PubSub();

// Initialize the prisma client object - Prisma will be used as the ORM to access the underlying SQLITE database

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});

// Context Factory to build the context object in GraphQL Server

function buildContext({ req }: BuildContextArgs) {
    return {
      req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
}

// Leverage Typescript augmentation
declare module 'graphql-ez' {
  interface EZContext extends InferContext<typeof buildContext> {}
}

// Create GraphQL APP by bootstrapping it with the plugins we need (GraphiQL, GraphQL Scalars, GraphQL WS)

export const ezApp = CreateApp({
    buildContext,
    ez: {
      plugins: [
        ezSchema({
          schema: schema
        }),
        ezGraphiQLIDE(),
        ezScalars({
            DateTime: 1,
        }),
        ezWebSockets('adaptive')
      ],
    }
});
