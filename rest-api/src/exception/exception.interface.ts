export interface IException {
  message: string;
  error: object;
  type: string;

  getResponse(ex : object) : string | object;
}