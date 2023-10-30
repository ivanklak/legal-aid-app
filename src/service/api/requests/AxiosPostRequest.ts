import {instance} from "../../../api.config";
import IAxiosResponseHandler from "../handlers/IAxiosResponseHandler";
import {AxiosRequestConfig} from "axios";

export default abstract class AxiosPostRequest<TData> {
  protected abstract url: string;

  protected abstract body: unknown;

  protected abstract responseHandler: IAxiosResponseHandler<TData>;

  protected additionalHeaders: Record<string, string> = {};

  private get requestConfig(): AxiosRequestConfig {
    const { additionalHeaders } = this;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders,
      }
    }
  }

  public async send() {
    const { url, responseHandler } = this;

    const response = await instance.post(url, this.body, this.requestConfig);

    const data = await responseHandler.handleResponse(response);

    return data;
  }
}
