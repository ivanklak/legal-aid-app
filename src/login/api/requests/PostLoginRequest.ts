import AxiosResponseHandler from "../../../service/api/handlers/AxiosResponseHandler";
import AxiosPostRequest from "../../../service/api/requests/AxiosPostRequest";

export interface LoginResponse {
    access_token: string;
    id: string;
    refresh_token: string;
    role: string;
}

const LOGIN_URL = '/auth/login';

class PostLoginRequest extends AxiosPostRequest<LoginResponse> {
    public constructor(private email: string, private pwd: string) {
        super();
    }

    protected responseHandler = new AxiosResponseHandler<LoginResponse>();
    protected url = LOGIN_URL;
    protected body = {
        email: this.email,
        pwd: this.pwd
    }
}

export default PostLoginRequest;