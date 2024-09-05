import React, {createContext, FC, useContext, useState} from "react";
import {IReason} from "./newRequestForm/parts/newRequestReasonPart/NewRequestReasonPart";
import {ISuggestions} from "./api/requests/GetOrganisationSuggestionsRequest";
import {SavedOrgData} from "./createForm/manualForm/ManualForm";

interface NewRequestDataLayerData {
    partnerId: string;
    reason: IReason;
    claimTitle: string;
    claimText: string;
    organisationData: IOrganisationData;
    files: any[],
    setPartnerId: (id: string) => void;
    setReason: (item: IReason) => void;
    setClaimTitle: (title: string) => void;
    setClaimText: (text: string) => void;
    setOrganisationData: (data: IOrganisationData) => void;
    setFiles: (files: any) => void;
}

export type IOrganisationData = SavedOrgData | ISuggestions;

export const NewRequestDataLayerContext = createContext<NewRequestDataLayerData | undefined>(undefined);

export const useSafeNewRequestDataLayerContext = () => {
    const newRequestDataLayer = useContext(NewRequestDataLayerContext);

    if (!newRequestDataLayer) {
        throw new Error('no newRequestDataLayer context')
    }

    return newRequestDataLayer;
};

const NewRequestDataLayerProvider: FC = ({ children}) => {
    const [reason, setReason] = useState<IReason>(null);
    const [partnerId, setPartnerId] = useState<string>('');
    const [organisationData, setOrganisationData] = useState<IOrganisationData>(null);

    const [claimTitle, setClaimTitle] = useState<string>('');
    const [claimText, setClaimText] = useState<string>('');
    const [files, setFiles] = useState<any>([]);

    // const saveNewOrganisationData = useCallback((data: Partial<IOrganisationData>) => {
    //     console.log('organisationData', organisationData)
    //     console.log('data', data)
    //     setOrganisationData({
    //         ...organisationData,
    //         ...data,
    //     })
    // }, [organisationData])

    return (
        <NewRequestDataLayerContext.Provider
            value={{
                partnerId,
                reason,
                claimTitle,
                claimText,
                organisationData,
                files,
                setPartnerId,
                setReason,
                setClaimTitle,
                setClaimText,
                setOrganisationData,
                setFiles
            }}
        >
            {children}
        </NewRequestDataLayerContext.Provider>
    )
}

export default NewRequestDataLayerProvider;