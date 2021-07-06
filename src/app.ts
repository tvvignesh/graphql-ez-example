import { BuildContextArgs, CreateApp, gql } from '@graphql-ez/fastify';
import { ezGraphiQLIDE } from '@graphql-ez/plugin-graphiql';
import { ezGraphQLModules } from '@graphql-ez/plugin-modules';
import { ezScalars } from '@graphql-ez/plugin-scalars';

// Context Factory to build the context object in GraphQL Server

function buildContext({ req }: BuildContextArgs) {
    return {
      req,
      foo: 'bar',
    };
}

// Create GraphQL APP by bootstrapping it with the plugins we need

export const { registerModule, buildApp } = CreateApp({
    buildContext,
    ez: {
      plugins: [
        ezGraphiQLIDE(),
        ezGraphQLModules(),
        ezScalars({
            DateTime: 1,
        })
      ],
    }
});

export { gql };
