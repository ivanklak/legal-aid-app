import PostCreateNewClaimRequest, {
    CreateNewClaimParams,
    CreateNewClaimResponse
} from "../requests/PostCreateNewClaimRequest";


export const requestCreateNewClaim = async (params: CreateNewClaimParams): Promise<CreateNewClaimResponse> => {
    const createNewClaimRequest = new PostCreateNewClaimRequest(params);

    const data: CreateNewClaimResponse = await createNewClaimRequest.send();

    return data
}