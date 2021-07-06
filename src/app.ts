import { BuildContextArgs, CreateApp, gql, InferContext } from '@graphql-ez/fastify';
import { ezGraphiQLIDE } from '@graphql-ez/plugin-graphiql';
import { ezGraphQLModules } from '@graphql-ez/plugin-modules';
import { ezScalars } from '@graphql-ez/plugin-scalars';
import { ezWebSockets } from '@graphql-ez/plugin-websockets';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
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

declare module 'graphql-ez' {
  interface EZContext extends InferContext<typeof buildContext> {}
}

// Create GraphQL APP by bootstrapping it with the plugins we need (GraphiQL, GraphQL Modules, GraphQL Scalars, GraphQL WS)

export const { registerModule, buildApp } = CreateApp({
    buildContext,
    ez: {
      plugins: [
        ezGraphiQLIDE(),
        ezGraphQLModules(),
        ezScalars({
            DateTime: 1,
        }),
        ezWebSockets('adaptive')
      ],
    }
});

export { gql };
