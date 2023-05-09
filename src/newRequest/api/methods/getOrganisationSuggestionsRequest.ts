import GetOrganisationSuggestionsRequest from "../requests/GetOrganisationSuggestionsRequest";

export default async (query: string) => {
    const getOrganisationSuggestionsRequest = new GetOrganisationSuggestionsRequest(query);

    const data = await getOrganisationSuggestionsRequest.send();

    return data;
}