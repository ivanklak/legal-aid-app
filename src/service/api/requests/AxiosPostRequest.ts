import {instance} from "../../../api.config";
import IAxiosResponseHandler from "../handlers/IAxiosResponseHandler";

export default abstract class AxiosPostRequest<TData> {
  protected abstract url: string;

  protected abstract body: unknown;

  protected abstract responseHandler: IAxiosResponseHandler<TData>;

  public async send() {
    const { url, responseHandler } = this;

    const response = await instance.post(url, this.body);

    const data = await responseHandler.handleResponse(response);

    return data;
  }
}
