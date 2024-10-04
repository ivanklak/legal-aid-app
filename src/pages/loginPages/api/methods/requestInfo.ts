import PostInfoRequest, {InfoResponse} from "../requests/PostInfoRequest";

export const requestInfo = async (sessionId: string, email: string): Promise<InfoResponse> => {
    const postInfoRequest = new PostInfoRequest(sessionId, email);

    const data: InfoResponse = await postInfoRequest.send();

    return data
}