import * as express from 'express';
import { IController } from './controller.interface';
import { HealthCheckService } from '../service/healthcheck.service';
import { HealthCheckResponseObject } from '../object/healthcheck-response.obj';
import { HttpStatusCode } from '../enum/https-status-code.enum';
import { ServiceException } from '../exception/service.exception';

class HealthCheckController implements IController {
    path: string = '/healthcheck';
    router: express.Router = express.Router();

    constructor(private readonly healthCheckService : HealthCheckService) {
        this.initializeRoutes();
    }

    public initializeRoutes() : void {
        this.router.get(this.path, async (req: express.Request, res: express.Response) => {
            await this.getStatus(req, res);
        });
    }

    private async getStatus(req: express.Request, res: express.Response) : Promise<void> {
        try {
            console.log(req);
            const responseObj : HealthCheckResponseObject = await this.healthCheckService.getHealthCheckStatus();
            res.status(HttpStatusCode.OK).send(responseObj.getMessage());
        } catch (ex) {
            const serviceException = <ServiceException> ex;
            res.status(serviceException.httpStatusCode).send(serviceException.getResponse());
        }
    }
}

export default HealthCheckController;