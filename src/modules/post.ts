import { gql, registerModule } from '../app';

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

registerModule(
  gql`
    type Link {
      id: ID!
      description: String!
      url: String!
      postedBy: User
      createdAt: DateTime!
    }

    type Subscription {
      newLink: Link
      hello: String!
    }

    extend type Mutation {
      post(url: String!, description: String!): Link!
    }
  `,
  {
    resolvers: {
      Mutation: {
        async post(parent, args, context, info) {
          const { userId } = context;
        
          const newLink = await context.prisma.link.create({
            data: {
              url: args.url,
              description: args.description,
              postedBy: { connect: { id: userId } }
            }
          });

          console.log('Publishing new link:::', newLink);

          await context.pubsub.publish('NEW_LINK', {
            newLink: newLink
          });
        
          return newLink;
        }
        
      },
      Subscription: {
        hello: {
          async *subscribe(_root, _args, _ctx) {
            for (let i = 1; i <= 5; ++i) {
              await sleep(500);

              yield {
                hello: 'Hello World ' + i,
              };
            }
            yield {
              hello: 'Done!',
            };
          },
        },
        newLink: {
          async subscribe(_root, _args, context) {
            // console.log('Val::', await context.pubsub.asyncIterator("NEW_LINK").next());
            const newVal = await (await context.pubsub.asyncIterator("NEW_LINK").next()).value;
            console.log('newVal::', newVal);
            return newVal;
          },
        }
        // newLink: {
        //   subscribe: (parent, args, context, info) => {
        //     // console.log('iterator::', context.pubsub.asyncIterator("NEW_LINK"));
        //     return context.pubsub.asyncIterator("NEW_LINK");
        //   }
        // }
      }
    },
  }
);