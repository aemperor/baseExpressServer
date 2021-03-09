/**
 * Bare bones logger middleware to be filled in.
 */
export class LoggerMiddleware {
    logger : any;
    errorLogger : any;
    environment : string;

    constructor() {
        this.environment = process.env.ENVIRONMENT;
    }

    public log(message: string) : void {
      console.log(message);
    }

    public logError(message: string): void {
      console.error(message)
    }
}