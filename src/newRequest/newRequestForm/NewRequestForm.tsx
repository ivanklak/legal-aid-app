import React, {memo, useMemo, useState} from "react";
import styles from "./NewRequestForm.module.sass";
import NewRequestReasonPart from "./parts/newRequestReasonPart/NewRequestReasonPart";
import NewRequestOrganisationInfoPart from "./parts/newRequestOrganisationInfoPart/NewRequestOrganisationInfoPart";
import NewRequestRequestInfoPart from "./parts/newRequestRequestInfoPart/NewRequestRequestInfoPart";
import NewRequestUserDataPart from "./parts/newRequestUserDataPart/NewRequestUserDataPart";
import NewRequestFinalPart from "./parts/newRequestFinalPart/NewRequestFinalPart";
import {Steps} from "antd";

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

const NewRequestForm = memo<NewRequestFormProps>(({}) => {
    const [currentPartId, setCurrentPartId] = useState<number>(PageId.reason);

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
            <Steps current={currentPartId} items={requestParts} />
            {steps[currentPartId].content}
        </div>
    )
})

export default NewRequestForm;