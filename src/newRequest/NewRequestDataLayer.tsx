import React, {createContext, FC, useCallback, useContext, useState} from "react";
import {IReason} from "./newRequestForm/parts/newRequestReasonPart/NewRequestReasonPart";

interface NewRequestDataLayerData {
    reason: IReason;
    claimTitle: string;
    claimText: string;
    organisationData: IOrganisationData;
    files: any[],
    setReason: (item: IReason) => void;
    setClaimTitle: (title: string) => void;
    setClaimText: (text: string) => void;
    setOrganisationData: (data: IOrganisationData) => void;
    setFiles: (files: any) => void;
}

interface IOrganisationData {
    name: string;
    inn: string;
    address: string;
    kpp?: string;
}

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
                reason,
                claimTitle,
                claimText,
                organisationData,
                files,
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