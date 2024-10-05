import IResponseHandler from './IResponseHandler';
import BadResponseError from '../errors/BadResponseError';

export default class ExpectedErrorCodeResponseHandler implements IResponseHandler<Response> {
  public async handleResponse(response: Response) {
    if (!response.ok) {
      throw new BadResponseError(response);
    }

    return response;
  }
}
