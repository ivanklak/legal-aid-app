import PostRequest from "../../../service/api/requests/PostRequest";
import JSONResponseHandler from "../../../service/api/handlers/JSONResponseHandler";

export interface InfoResponse {
    sessionId: string;
    user: IUserData;
}

export interface IUserData {
    id: number;
    firstName: string;
    lastLame: string;
    patronymic: string;
    email: string;
    phone: string;
    address: string;
    inn: string;
    status: string;
}

const INFO_URL = '/info';

class PostInfoRequest extends PostRequest<InfoResponse> {
    private token: string = localStorage.getItem("token");

    public constructor(private sessionId: string, private email: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<InfoResponse>();
    protected url = INFO_URL;
    protected additionalHeaders = {
        "Authorization": `Bearer ${this.token}`
    }
    protected body = {
        sessionId: this.sessionId,
        email: this.email,
    }
}

export default PostInfoRequest;