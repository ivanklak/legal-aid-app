import AxiosResponseHandler from "../../../service/api/handlers/AxiosResponseHandler";
import AxiosPostRequest from "../../../service/api/requests/AxiosPostRequest";

type Data = {
    sessionId: string
}

class GetClaimsRequest extends AxiosPostRequest<Data> {
    public constructor(private sessionId: string) {
        super();
    }

    protected responseHandler = new AxiosResponseHandler<Data>();
    protected url = "/claims";
    protected body = {
        id: this.sessionId
    }

}

export default GetClaimsRequest;