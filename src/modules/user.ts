import { gql } from '@graphql-ez/plugin-schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils/utils.js';

export const typeDefs = gql`
    type Query {
      info: String!
    }

    type Mutation {
      signup(
        email: String!
        password: String!
        name: String!
      ): AuthPayload
      login(email: String!, password: String!): AuthPayload
    }

    type AuthPayload {
      token: String
      user: User
    }

    type User {
      id: ID!
      name: String!
      email: String!
      links: [Link!]!
    }
`;

export const resolvers = {
  Query: {
    info(_root, _args, _ctx) {
      return 'hello world';
    }
  },
  Mutation: {
    async signup(parent, args, context, info) {
      const password = await bcrypt.hash(args.password, 10);
      const user = await context.prisma.user.create({
        data: { ...args, password }
      });
    
      const token = jwt.sign({ userId: user.id }, APP_SECRET);
    
      return {
        token,
        user
      };
    },
    async login(parent, args, context, info) {
      const user = await context.prisma.user.findUnique({
        where: { email: args.email }
      });

      if (!user) {
        throw new Error('No such user found');
      }
    
      const valid = await bcrypt.compare(
        args.password,
        user.password
      );
      if (!valid) {
        throw new Error('Invalid password');
      }
    
      const token = jwt.sign({ userId: user.id }, APP_SECRET);
    
      return {
        token,
        user
      };
    }
  },
  User: {
    async links(parent, args, context) {
      return context.prisma.user
        .findUnique({ where: { id: parent.id } })
        .links();
    }
  }
};