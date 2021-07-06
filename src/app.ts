import { BuildContextArgs, CreateApp, gql, InferContext } from '@graphql-ez/fastify';
import { ezGraphiQLIDE } from '@graphql-ez/plugin-graphiql';
import { ezGraphQLModules } from '@graphql-ez/plugin-modules';
import { ezScalars } from '@graphql-ez/plugin-scalars';
import { ezWebSockets } from '@graphql-ez/plugin-websockets';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { getUserId } from './utils/utils';

export const pubsub = new PubSub();

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});

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
