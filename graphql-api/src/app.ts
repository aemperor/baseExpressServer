import 'reflect-metadata'; // preserve this import prior to graphql
import * as express from 'express';
import * as http from 'http';
import { GraphQlSchema } from './schema';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';

class App {
  public app: express.Application;
  public port: number;
  public timeout: number;
  public schema: GraphQLSchema;

  private readonly METHOD_NOT_ALLOWED : string = 'Method not allowed';
  private readonly SOMETHING_WENT_WRONG : string = 'Something went wrong!';

  constructor(schema: GraphQLSchema, port: number, timeout: number) {
    this.app = express();
    this.schema = schema;
    this.port = port;
    this.timeout = timeout;

    // Initialize Middlewares here
    // NOTE: Middleware ordering is important and must be maintained!
    new Promise((resolve, reject) => {
      this.initializeRouteMiddlewares().then(resolve);
    });
  }

  private async initializeRouteMiddlewares() : Promise<void> {
    this.app.use('/graphql', graphqlHTTP({
      schema: this.schema,
      graphiql: true,
    }));
  }

  public createServer() {
    http.createServer(this.app).listen(this.port);
    console.log(`App listening on port ${this.port}`);
  }

}

export default App;