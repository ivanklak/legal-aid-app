import PostLoginRequest, {LoginResponse} from "../requests/PostLoginRequest";

export const requestLogin = async (email: string, pwd: string): Promise<LoginResponse> => {
    const postLoginRequest = new PostLoginRequest(email, pwd);

    const data: LoginResponse = await postLoginRequest.send();

    return data
}