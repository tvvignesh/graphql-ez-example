import { BuildContextArgs, CreateApp, gql } from '@graphql-ez/fastify';
import { ezGraphiQLIDE } from '@graphql-ez/plugin-graphiql';
import { ezGraphQLModules } from '@graphql-ez/plugin-modules';
import { ezScalars } from '@graphql-ez/plugin-scalars';

function buildContext({ req }: BuildContextArgs) {
    return {
      req,
      foo: 'bar',
    };
}

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
