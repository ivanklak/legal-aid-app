import React, {memo} from "react";
import styles from "./NewRequestOrganisationInfoPart.module.sass";
import Button from "../../../../controls/button/Button";

interface NewRequestOrganisationInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Информация об организации';

const NewRequestOrganisationInfoPart = memo<NewRequestOrganisationInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    return (
        <div className={styles['org-part']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>тут что-то буит</div>
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick}>Prev</Button>
                <Button onClick={onNextPageClick}>Next</Button>
            </div>
        </div>
    )
})

export default NewRequestOrganisationInfoPart;