import PostRequest from "../../../service/api/requests/PostRequest";
import JSONResponseHandler from "../../../service/api/handlers/JSONResponseHandler";

export interface LoginResponse {
    access_token: string;
    id: string;
    refresh_token: string;
    role: string;
}

const LOGIN_URL = 'http://localhost:8080/auth/loginn';

class PostLoginRequest extends PostRequest<LoginResponse> {
    public constructor(private email: string, private pwd: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<LoginResponse>();
    protected url = LOGIN_URL;
    protected body = {
        email: this.email,
        pwd: this.pwd
    }
}

export default PostLoginRequest;