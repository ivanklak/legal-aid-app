import NetworkError from './NetworkError';

export default class RequestNetworkProblemError extends NetworkError {
  public name = 'RequestNetworkProblemError';

  public constructor(public url: string, public requestInit: RequestInit, public originalError: unknown) {
    super('Request network problem when performing request');
  }
}
