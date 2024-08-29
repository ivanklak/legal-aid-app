import React, {memo} from "react";
import styles from "./OrganisationForm.module.sass";
import {ISuggestions} from "../../../api/requests/GetOrganisationSuggestionsRequest";
import {IoClose} from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";

interface OrganisationFormProps {
    data: ISuggestions;
    onClose: () => void;
}

const OrganisationForm = memo<OrganisationFormProps>(({data, onClose}) => {

    if (!data) return null;
    return (
        <div className={styles['organisation-form']}>
            <div
                onClick={onClose}
                className={styles['close-btn-container']}
            >
                <IoClose size={20} />
            </div>
            <div className={styles['organisation-icon']}>
                <BsBuildings size={56} />
            </div>
            <div className={styles['organisation-data']}>
                <div className={styles['name']}>{data.value}</div>
                <div>Инн: {data.data.inn}</div>
                {data.data.ogrn && <div>Огрн: {data.data.ogrn}</div>}
                <div>Адресс: {data.data.address.value}</div>
                <div>КПП: {data.data.kpp}</div>
            </div>
        </div>
    )
})

export default OrganisationForm;