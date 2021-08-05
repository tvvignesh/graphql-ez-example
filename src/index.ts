import Fastify from 'fastify';
import { ezApp } from './app';

// Create a fastify instance in the server

const app = Fastify({
    logger: true,
});

// Register the app and the relevant modules within - Our modules directory has an index.ts file which inturn loads all the relevant modules we need for the app

const { fastifyPlugin } = ezApp.buildApp({});

app.register(fastifyPlugin);

// Listen for the ready event and exit if error occured

app.ready(err => {
    if (!err) return;
  
    console.error(err);
    process.exit(1);
});

// Start listening to the GraphQL Server in the port

app.listen(process.env.PORT || 3000);