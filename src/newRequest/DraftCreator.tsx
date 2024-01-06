import React, {createContext, FC, useContext, useState} from "react";
import {ISuggestions} from "./api/requests/GetOrganisationSuggestionsRequest";
import {useAuth} from "../components/hooks/useAuth";
import {CreateDraftParams, CreateDraftResponse} from "./api/requests/CreateDraftRequest";
import {createDraft} from "./api/methods/requestCreateDraft";


export interface DraftCreatorContextData {
    createOrEditDraft: (params: NewDraftParams) => Promise<void>;
    cleanDraft: () => void;
}

interface NewDraftParams {
    name?: string;
    text?: string;
    file?: File | Blob;
    orgData?: ISuggestions;
    orgName?: string;
    orgInn?: string;
    orgAddress?: string;
}

export const DraftCreatorContext = createContext<DraftCreatorContextData | undefined>(undefined);

export const useDraftCreatorContext = () => {
    const draftData = useContext(DraftCreatorContext);

    if (!draftData) {
        throw new Error('no draftData context')
    }

    return draftData
}

const DraftCreator: FC = ({children}) => {
    const {userData} = useAuth();
    const [draft, setDraft] = useState<CreateDraftResponse>(null);

    // создает или изменяет уже созданный черновик
    const createOrEditDraft = async (params: NewDraftParams) => {
        // если нет draft --> создать новый черновик
        // если есть draft (у него есть id) --> то изменения применятся к уже созданному черновику по id
        const requestParams: CreateDraftParams = {
            userId: userData?.id,
            draftId: draft && draft.id ? draft.id : undefined,
            ...params
        }

        try {
            const response = await createDraft(requestParams);
            setDraft(response);
        } catch (error) {
            console.log('create draft error', error)
        }
    }

    // отчищает созданный черновик --> он теперь живет на серваке
    const cleanDraft = () => {
        setDraft(null);
    }

    return (
        <DraftCreatorContext.Provider
            value={{
                createOrEditDraft,
                cleanDraft
            }}
        >
            {children}
        </DraftCreatorContext.Provider>
    )
}

export default DraftCreator;
