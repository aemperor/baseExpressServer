import App from './app';
import { config } from 'dotenv';
import { ConfigurationObject } from './object/configuration.obj';
import HealthCheckController from './controller/healthcheck.controller';
import { HealthCheckService } from './service/healthcheck.service';
import { LoggerService } from './service/logger.service';

const DEFAULT_PORT = 3030;
const DEFAULT_TIMEOUT = 5; // in seconds

if (!process.env.DOTENV_PATH) {
    process.env.DOTENV_PATH = `./env/${process.env.ENVIRONMENT}.env`;
}
config( { path : process.env.DOTENV_PATH } );

const configurationDto : ConfigurationObject = new ConfigurationObject(process.env);

const port = process.env.EXPRESS_HTTP_PORT ? Number(process.env.EXPRESS_HTTP_PORT) : DEFAULT_PORT;
const timeout = process.env.EXPRESS_TIMEOUT ? Number(process.env.EXPRESS_TIMEOUT) : DEFAULT_TIMEOUT;

const loggerService : LoggerService = new LoggerService(configurationDto);

const app = new App(
    [
        new HealthCheckController(new HealthCheckService(configurationDto, loggerService)),
    ],
    port,
    timeout
);

app.createServer();
