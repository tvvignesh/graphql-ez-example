import { gql, registerModule } from '../app';

registerModule(
  gql`
    type Feed {
      id: ID!
      links: [Link!]!
      count: Int!
    }

    enum Sort {
      asc
      desc
    }

    input LinkOrderByInput {
      description: Sort
      url: Sort
      createdAt: Sort
    }

    extend type Query {
      feed(
        filter: String
        skip: Int
        take: Int
        orderBy: LinkOrderByInput
      ): Feed!
    }
  `,
  {
    resolvers: {
      Query: {
        async feed (parent, args, context, info) {
          const where = args.filter
            ? {
                OR: [
                  { description: { contains: args.filter } },
                  { url: { contains: args.filter } }
                ]
              }
            : {};
        
          const links = await context.prisma.link.findMany({
            where,
            skip: args.skip,
            take: args.take,
            orderBy: args.orderBy
          });
        
          const count = await context.prisma.link.count({ where });
        
          return {
            id: 'main-feed',
            links,
            count
          };
        },
      },
    },
  }
);