import { Query, Resolver } from 'type-graphql';
import { HealthCheckData } from '../data/healthcheck.data';
import HealthCheck from '../schema/healthcheck.schema';

@Resolver()
export class HealthCheckResolver {
  @Query(returns => HealthCheck)
  HealthCheck() : HealthCheckData {
    const healthCheckData : HealthCheckData = {
      status: 'good',
    };

    return healthCheckData;
  }
}