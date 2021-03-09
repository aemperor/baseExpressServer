import { ConfigurationObject } from '../object/configuration.obj';
import { HealthCheckResponseObject } from '../object/healthcheck-response.obj';
import { LoggerService } from './logger.service';

export class HealthCheckService {
    constructor(private readonly config: ConfigurationObject, private readonly loggerService: LoggerService) {

    }

    /**
     * Check health of dependencies
     */
    async getHealthCheckStatus() : Promise<HealthCheckResponseObject> {
        const healthCheckObj : HealthCheckResponseObject = new HealthCheckResponseObject();
        healthCheckObj.buildNumber = this.config.buildNumber;

        this.loggerService.log(`Build Number: ${healthCheckObj.buildNumber}`);

        return healthCheckObj;
    }
}