import React, {memo, useEffect, useMemo, useState} from "react";
import styles from "./NewRequestForm.module.sass";
import NewRequestReasonPart from "./parts/newRequestReasonPart/NewRequestReasonPart";
import NewRequestOrganisationInfoPart from "./parts/newRequestOrganisationInfoPart/NewRequestOrganisationInfoPart";
import NewRequestRequestInfoPart from "./parts/newRequestRequestInfoPart/NewRequestRequestInfoPart";
import NewRequestUserDataPart from "./parts/newRequestUserDataPart/NewRequestUserDataPart";
import NewRequestFinalPart from "./parts/newRequestFinalPart/NewRequestFinalPart";
import {useSafeNewRequestDataLayerContext} from "../NewRequestDataLayer";
import {Steps} from "antd";
import {partners} from "./utils/partners";

interface NewRequestFormProps {}

export enum PageId {
    reason,	                    // choose reason
    organisationInfo,	// enter address
    requestInfo,            // property info and cleaning
    userData,                  // user doesnt want to register or login
    final,				        // summary
}

interface IRequestPart {
    title: string;
    alias: string;
    content: React.ReactNode;
}

const PARTNER_ID_PARAM = 'id';

const NewRequestForm = memo<NewRequestFormProps>(({}) => {
    const [currentPartId, setCurrentPartId] = useState<number>(PageId.reason);
    const {setPartnerId, setOrganisationData} = useSafeNewRequestDataLayerContext();

    useEffect(() => {
        const searchString = new URLSearchParams(window.location.search);
        if (searchString.has(PARTNER_ID_PARAM)) {
            const id = searchString.get(PARTNER_ID_PARAM);
            if (!id?.length) return;
            //
            setPartnerId(id);
            //
            const partnerData = partners.find((p) => p.id === id);
            if (!partnerData) return;
            //
            setOrganisationData(partnerData);
        }
    }, [])

    const handleNextPage = () => {
        if (currentPartId === steps.length - 1) return;
        setCurrentPartId(currentPartId + 1);
    }

    const handlePrevPage = () => {
        if (currentPartId === 0) return;
        setCurrentPartId(currentPartId - 1);
    }

    const steps = useMemo<IRequestPart[]>(() => {
        return [
            {
                title: 'Причина',
                alias: 'reason',
                content: <NewRequestReasonPart onNextPageClick={handleNextPage} />,
            },
            {
                title: 'Организация',
                alias: 'organisationInfo',
                content: (
                    <NewRequestOrganisationInfoPart
                        onNextPageClick={handleNextPage}
                        onPrevPageClick={handlePrevPage}
                    />
                ),
            },
            {
                title: 'Обращение',
                alias: 'requestInfo',
                content: (
                    <NewRequestRequestInfoPart
                        onNextPageClick={handleNextPage}
                        onPrevPageClick={handlePrevPage}
                    />
                ),
            },
            {
                title: 'Контакты',
                alias: 'userData',
                content: (
                    <NewRequestUserDataPart
                        onNextPageClick={handleNextPage}
                        onPrevPageClick={handlePrevPage}
                    />
                ),
            },
            {
                title: 'Итог',
                alias: 'final',
                content: <NewRequestFinalPart onPrevPageClick={handlePrevPage} />
            },
        ]
    }, [handleNextPage, handlePrevPage]);

    const requestParts = useMemo(() => {
        return steps.map((part) => {
          return {
              key: part.alias,
              title: part.title
          }
        })
    }, [steps]);

    return (
        <div>
            <Steps current={currentPartId}
                items={requestParts}
                responsive={false}
            />
            <div className={styles['content']}>
                {steps[currentPartId].content}
            </div>
        </div>
    )
})

export default NewRequestForm;