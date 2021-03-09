import { ConfigurationObject } from '../object/configuration.obj';

export class LoggerService {
    environment : string;
    logLevel : string;

    constructor(configurationObj : ConfigurationObject) {
        this.environment = configurationObj.environment;
        this.logLevel = configurationObj.logLevel;
    }

    log(message: string) : void {
      console.log(message);
    }

    logError(message: string) : void {
      console.error(message);
    }
    
}