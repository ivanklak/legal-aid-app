import PostLoginRequest from "../requests/PostLoginRequest";

export const requestLogin = async (email: string, pwd: string) => {
    const postLoginRequest = new PostLoginRequest(email, pwd);

    const data = await postLoginRequest.send();

    return data
}