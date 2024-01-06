import CreateDraftRequest, {CreateDraftParams, CreateDraftResponse} from "../requests/CreateDraftRequest";


export const createDraft = async (params: CreateDraftParams) => {
    const createDraftRequest = new CreateDraftRequest(params);

    const data: CreateDraftResponse = await createDraftRequest.send();

    return data;
}