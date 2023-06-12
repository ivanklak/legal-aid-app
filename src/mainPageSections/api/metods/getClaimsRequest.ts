import GetClaimsRequest from "../requests/GetClaimsRequest";

export default async (sessionId: string) => {
    const getClaimsRequest = new GetClaimsRequest(sessionId);

    const data = await getClaimsRequest.send();

    return data;
}