import { IException } from './exception.interface';
import { HttpStatusCode } from '../enum/https-status-code.enum';

export class ServiceException implements IException {
    httpStatusCode: HttpStatusCode;
    message: string;
    error: object;
    serviceName: string;
    serviceMethod: string;
    type: string = 'ServiceException';

    constructor(httpStatusCode: HttpStatusCode, message: string, serviceName: string, serviceMethod: string, error: object) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
        this.serviceName = serviceName;
        this.serviceMethod = serviceMethod;
        this.error = error;
    }

    getResponse() : object {
        return {
            message: this.message,
            error: this.error,
            serviceName: this.serviceName,
            serviceMethod: this.serviceMethod,
            type: this.type
        };
    }
}