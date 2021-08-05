import { EZSchema } from '@graphql-ez/plugin-schema';
import * as feed from './feed';
import * as post from './post';
import * as user from './user';
import * as vote from './vote';


export const schema: EZSchema = {
    typeDefs: [feed.typeDefs, post.typeDefs, user.typeDefs, vote.typeDefs],
    resolvers: [feed.resolvers, post.resolvers, user.resolvers, vote.resolvers]
};