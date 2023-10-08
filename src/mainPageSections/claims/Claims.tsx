import React, {FC, useCallback, useEffect, useState} from "react";
import {StatusV2} from "../mainPage/MainPage";
import styles from "./Claims.module.css";
import {Link, useNavigate} from "react-router-dom";
import getClaimsRequest from "../api/metods/getClaimsRequest";
import {ClaimsItemResponse} from "../api/requests/GetClaimsRequest";
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {getDateFromString} from "../../handlers/getDateFromString";

interface IUserInfo {
    first_name: string;
    last_name: string;
}

interface IComment {
    createdAt: string;
    id: number;
    text: string;
    user: IUserInfo
}

interface ClaimRowData {
    key: React.Key;
    id: string; //120
    name: string; //"Жалоба на врача"
    createdDate: string; // "2023-06-12 16:52:48.343"
    status: string; //"RESOLVED"
    text: string; //"Колоноскопия прошла не успешно - я обосрался"
    isRowExpandable: boolean;
    comments: IComment[];
}

const Claims: FC = () => {
    const navigate = useNavigate();
    const [claims, setClaims] = useState<ClaimsItemResponse[]>([]);
    const [rows, setRows] = useState<ClaimRowData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

    const createTableRows = useCallback((): any => {
        if (!claims.length) return null;

        const rowsArray: ClaimRowData[] = claims.map((item) => {
            return {
                key: item.genId,
                id: item.genId,
                name: item.name,
                createdDate: getDateFromString(item.createdDate),
                status: item.status,
                text: item.text,
                isRowExpandable: !!item.text,
                comments: item.comments
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
    }, [createTableRows])

    useEffect( () => {
        requestClaims();
    }, [JSON.stringify(claims)])

    const columns: ColumnsType<ClaimRowData> = [
        {
            title: 'Название',
            dataIndex: 'name',
            render: (name) => renderName(name)
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            width: 170,
            render: (_, {status}) => renderStatusTag(status),
        },
        Table.EXPAND_COLUMN,
    ]

    const renderStatusTag = (status: string): JSX.Element => {
        switch (status) {
            case StatusV2.resolved: {
                return (
                    <Tag color='green'>Готово</Tag>
                )
            }
            case StatusV2.decline: {
                return (
                    <Tag color='volcano'>Отклонено</Tag>
                )
            }
            case StatusV2.new: {
                return (
                    <Tag color='geekblue'>Создано</Tag>
                )
            }
            case StatusV2.inProcess: {
                return (
                    <Tag color='blue'>В процессе</Tag>
                )
            }
            case 'NEED_INFO':
            case StatusV2.waitingForAction: {
                return (
                    <Tag color='orange'>Требуется действие</Tag>
                )
            }
            default: return <Tag color='geekblue'>{status}</Tag>
        }
    }

    const renderName = (name: string) => {
        return (
            <div className={styles.row_name}>{name}</div>
        )
    }

    const renderDescription = (claimRowData: ClaimRowData): JSX.Element => {
        return (
            <div>
                <div className={styles.expand_data}>Создано {claimRowData.createdDate}</div>
                <div className={styles.expand_data}>Id: {claimRowData.id}</div>
                <div className={styles.expand_data}>{claimRowData.comments.length} ответов</div>
                <div className={styles.text}>{claimRowData.text}</div>
                <Link to={{pathname: `/myRequests/${claimRowData.id}`}} className={styles.expand_link}>
                    Перейти к обращению
                </Link>
            </div>
        )
    }

    const renderExpandIcon = () => {}

    return (
        <div className={styles.claims}>
            <Table
                columns={columns}
                dataSource={rows}
                loading={loading}
                rowKey={(record) => record.id}
                pagination={false}
                scroll={{ y: '100%' }}
                expandable={{
                    expandedRowRender: (record) => renderDescription(record),
                    rowExpandable: (record) => record.isRowExpandable,
                    // expandIcon: ({ expanded, onExpand, record }) => renderExpandIcon()
                }}
            />
            <div className={styles.allAppeals} onClick={onAllAppealsClick}>
                <div className={styles.textButton}>
                    Все обращения
                </div>
            </div>
        </div>
    )
}

export default Claims