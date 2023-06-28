import React, {FC, useCallback, useEffect, useState} from "react";
import {IAppeals} from "../mainPage/MainPage";
import styles from "./Claims.module.css";
import AppealsItem from "../appealsItem";
import {useNavigate} from "react-router-dom";
import {BsArrowDownShort} from "react-icons/bs";
import getClaimsRequest from "../api/metods/getClaimsRequest";
import {ClaimsItemResponse} from "../api/requests/GetClaimsRequest";
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {getDateFromString} from "../../handlers/getDateFromString";

interface ClaimData {
    key: React.Key;
    id: string; //120
    name: string; //"Жалоба на врача"
    createdDate: string; // "2023-06-12 16:52:48.343"
    status: string; //"RESOLVED"
    // text: string; //"Колоноскопия прошла не успешно - я обосрался"
}

const Claims: FC = () => {
    const navigate = useNavigate();
    const [claims, setClaims] = useState<ClaimsItemResponse[]>([]);
    const [rows, setRows] = useState<ClaimData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

    const createTableRows = useCallback((): any => {
        if (!claims.length) return null;

        const rowsArray: ClaimData[] = claims.map((item) => {
            return {
                key: item.id,
                id: item.id,
                name: item.name,
                createdDate: getDateFromString(item.createdDate),
                status: item.status,
            }
        })

        setRows(rowsArray);
    }, [claims])

    const requestClaims = useCallback(async () => {
        const sessionId = localStorage.getItem('id');
        if (!sessionId) return;
        setLoading(true);
        try {
            const response = await getClaimsRequest(sessionId);
            if (response) {
                console.log('res', response)
                setClaims(response.claims);
                createTableRows();
                setLoading(false);
            }
        } catch (err) {
            console.log('err')
            setLoading(false);
        }
        // const response = await axios.post('/claims_details',
        //     { id: 290 },
        //     { headers: {'Content-Type': 'application/json'} }
        // );
        // console.log('response', response)
        // const response2 = await axios.post('/claims', { headers: {'Content-Type': 'application/json'} });
    }, [createTableRows])

    useEffect( () => {
        requestClaims();
    }, [JSON.stringify(claims)])

    const columns: ColumnsType<ClaimData> = [
        {
            title: 'Название',
            dataIndex: 'name',
        },
        {
            title: 'Номер',
            dataIndex: 'id',
            width: 100,
        },
        {
            title: 'Дата',
            dataIndex: 'createdDate',
            width: 150,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            width: 150,
            render: (_, {status}) => (
                <Tag color={'geekblue'} key={status}>
                    {status}
                </Tag>
            ),
        },
    ]

    const handleTableChange = (val: any) => {
        console.log('change', val)
    }

    // if (!claims.length) return null;

    return (
        <>
            {/*<div className={styles.sortBlock}>*/}
            {/*    <div className={styles.sortTab}>Id обращения</div>*/}
            {/*    <div className={styles.sortTab}>*/}
            {/*        <span className={styles.tabText}>Дата</span>*/}
            {/*        <BsArrowDownShort size={16} />*/}
            {/*    </div>*/}
            {/*    <div className={styles.sortTab}>Организация</div>*/}
            {/*    <div className={styles.sortTab}>Статус</div>*/}
            {/*</div>*/}
            <div className={styles.claims}>
                {/*{claims.map((item) => (*/}
                {/*    <AppealsItem item={item} key={item.id} />*/}
                {/*))}*/}
                <Table
                    columns={columns}
                    dataSource={rows}
                    loading={loading}
                    rowKey={(record) => record.id}
                    pagination={false}
                    scroll={{ y: '100%' }}
                    onChange={handleTableChange}
                />
                <div className={styles.allAppeals} onClick={onAllAppealsClick}>
                    <div className={styles.textButton}>
                        Все обращения
                    </div>
                </div>
            </div>
        </>
    )
}

export default Claims