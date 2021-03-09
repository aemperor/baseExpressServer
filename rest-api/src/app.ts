import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as cors from 'cors';
import * as expressRequestId from 'express-request-id';
import { IController } from './controller/controller.interface';
import { HttpStatusCode } from './enum/https-status-code.enum';
import { HttpException } from './exception/http-exception';
// import { LoggerMiddleware } from './middleware/logger.middleware';
import { TokenValidationMiddleware } from './middleware/token-validation.middleware';

class App {
    public app: express.Application;
    public port: number;
    public timeout: number;
    // private readonly loggerMiddleware : LoggerMiddleware = new LoggerMiddleware();
    private readonly validationMiddleware : TokenValidationMiddleware = new TokenValidationMiddleware();
    private readonly METHOD_NOT_ALLOWED : string = 'Method not allowed';
    private readonly SOMETHING_WENT_WRONG : string = 'Something went wrong!';

    constructor(controllers: IController[], port: number, timeout: number) {
        this.app = express();
        this.port = port;
        this.timeout = timeout;

        // NOTE: Middleware ordering is important and must be maintained!
        this.initializePreRouteMiddlewares();
        this.initializeControllers(controllers);
        this.initializePostRouteMiddlewares();
        this.initializeMethodNotAllowedExceptions();
        this.initializeRouterUnhandledExceptionHandler();
        this.initializeHeaders();
    }

    private wrapAsync(fn : any) {
        return ((req : express.Request, res : express.Response, next : express.NextFunction) => {
            fn(req, res, next).catch(next);
        });
    }

    private initializeMethodNotAllowedExceptions() : void {
        // wrap PUT calls
        this.app.put('*', this.wrapAsync(async (req : express.Request, res : express.Response) => {
            await new Promise<void>(resolve => setTimeout(() => resolve(), this.timeout));
            throw new Error(this.METHOD_NOT_ALLOWED);
        }));

        // wrap DELETE calls
        this.app.delete('*', this.wrapAsync(async (req : express.Request, res : express.Response) => {
            await new Promise<void>(resolve => setTimeout(() => resolve(), this.timeout));
            throw new Error(this.METHOD_NOT_ALLOWED);
        }));

        // wrap PATCH calls
        this.app.patch('*', this.wrapAsync(async (req : express.Request, res : express.Response) => {
            await new Promise<void>(resolve => setTimeout(() => resolve(), this.timeout));
            throw new Error(this.METHOD_NOT_ALLOWED);
        }));

        // wrap HEAD calls
        this.app.head('*', this.wrapAsync(async (req : express.Request, res : express.Response) => {
            await new Promise<void>(resolve => setTimeout(() => resolve(), this.timeout));
            throw new Error(this.METHOD_NOT_ALLOWED);
        }));
    }

    private initializePreRouteMiddlewares() : void {
        this.app.use(bodyParser.json());

        this.app.use(expressRequestId({
            setHeader: true,
            headerName: 'x-request-id',
            attributeName: 'requestId'
        }));

        const options = {
            apiTokens : process.env.API_TOKENS ? process.env.API_TOKENS.split(',') : [],
            excludePaths : ['/healthcheck']
        };

        this.app.use(this.validationMiddleware.validateToken(options));

        // Unexpected error handler middleware
        this.app.use((err : any, req : express.Request, res : express.Response, next : express.NextFunction) => {
            if (err.message === this.METHOD_NOT_ALLOWED) {
                res.status(HttpStatusCode.METHOD_NOT_ALLOWED).send();
            } else {
                const exception = new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, this.SOMETHING_WENT_WRONG, 'initializeMiddlewares', err);
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(exception.getResponse());
            }
        });

        // this.app.use(this.loggerMiddleware.getLogger());
    }

    private initializePostRouteMiddlewares() : void {
        // this.app.use(this.loggerMiddleware.getErrorLogger());
    }

    private initializeRouterUnhandledExceptionHandler() : void {
        this.app.get('*', this.wrapAsync(async (req: express.Request, res: express.Response) => {
            await new Promise<void>(resolve => setTimeout(() => resolve(), this.timeout));
            throw new Error(this.SOMETHING_WENT_WRONG);
        }));

        this.app.post('*', this.wrapAsync(async (req: express.Request, res: express.Response) => {
            await new Promise<void>(resolve => setTimeout(() => resolve(), this.timeout));
            throw new Error(this.SOMETHING_WENT_WRONG);
        }));
    }

    private initializeHeaders() : void {
        this.app.use( cors ({
            credentials: true,
            allowedHeaders: ['Content-Type', 'x-api-token']
        }));
    }

    private initializeControllers(controllers: IController[]) : void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public createServer() {
        if (process.env.HTTPS === 'true') {
            // locally self-signed certs
            const sslKey = fs.readFileSync(process.env.EXPRESS_SSL_KEY_FILE, 'utf8');
            const sslCert = fs.readFileSync(process.env.EXPRESS_SSL_CERT_FILE, 'utf8');
            const serverOptions = {
                key: sslKey,
                cert: sslCert,
                rejectUnauthorized: false
            };
            https.createServer(serverOptions, this.app).listen(this.port);
        } else {
            http.createServer(this.app).listen(this.port);
        }
        console.log(`App listening on port ${this.port}`);
    }
}

export default App;