export class HealthCheckResponseObject {
  buildNumber: number;

  getMessage() : object {
      return {
          buildNumber: this.buildNumber
      };
  }
}