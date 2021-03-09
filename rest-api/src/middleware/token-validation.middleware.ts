import * as express from 'express';
import { HttpStatusCode } from '../enum/https-status-code.enum';

export class TokenValidationMiddleware {
    validateToken(options: { apiTokens : string[], excludePaths : string[] }) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const apiToken = req.get('x-api-token');
            if (this.isRequestTokenValid(apiToken, options.apiTokens)) {
                next();
            } else {
                if (options.excludePaths && options.excludePaths.indexOf(req.path) >= 0) {
                    next();
                } else {
                    res.status(HttpStatusCode.UNAUTHORIZED).json({statusCode: HttpStatusCode.UNAUTHORIZED, message: 'Invalid API Token or no token provided'});
                }
            }
        };
    }

    /**
     * Returns whether the request token is valid or not.
     * @param token The token to verify.
     * @param validTokens The array of tokens allowed.
     * @returns True if valid, false otherwise.
     */
    isRequestTokenValid(token: string, validTokens: string[]) {
        return validTokens.includes(token);
    }
}