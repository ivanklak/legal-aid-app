import PostRequest from "../../../service/api/requests/PostRequest";
import JSONResponseHandler from "../../../service/api/handlers/JSONResponseHandler";

type Data = {
    sessionId: string
}

class GetClaimsRequest extends PostRequest<Data> {
    public constructor(private sessionId: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<Data>();
    protected url = "http://localhost:8080/claims";
    protected body = {
        id: this.sessionId
    }

}

export default GetClaimsRequest;