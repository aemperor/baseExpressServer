import { IException } from './exception.interface';
import { HttpStatusCode } from '../enum/https-status-code.enum';

export class HttpException implements IException {
    httpStatusCode: HttpStatusCode;
    message: string;
    error: object;
    serviceMethod: string;
    type: string = 'HttpException';

    constructor(httpStatusCode: HttpStatusCode, message: string, serviceMethod: string, error: object) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
        this.serviceMethod = serviceMethod;
        this.error = error;
    }

    getResponse() : object {
        return {
            message: this.message,
            type: this.type
        };
    }
}