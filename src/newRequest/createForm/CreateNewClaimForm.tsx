import React, {ChangeEvent, memo, useCallback, useMemo, useState} from "react";
import styles from "./CreateNewClaimForm.module.sass";
import TextArea from "antd/es/input/TextArea";
import classNames from "classnames";
import {Button, Dropdown, Input, MenuProps, Modal, UploadFile} from "antd";
import {IoIosSearch} from "react-icons/io";
import getOrganisationSuggestionsRequest from "../api/methods/getOrganisationSuggestionsRequest";
import {ISuggestions} from "../api/requests/GetOrganisationSuggestionsRequest";
import ManualForm, {SavedOrgData} from "./manualForm/ManualForm";
import TextEditor from "../../requestItem/textEditor/TextEditor";
import { IoClose } from "react-icons/io5";
import {CreateNewClaimParams} from "../api/requests/PostCreateNewClaimRequest";
import {requestCreateNewClaim} from "../api/methods/requestCreateNewClaim";

interface CreateNewClaimFormProps {}

enum OrganisationTabId {
    search = 'search',
    manual = 'manual'
}

enum ModalType {
    submit= 'submit',
    cancel = 'cancel'
}

interface IModalContext {
    title?: string;
    text: string;
    type: ModalType;
}

const CreateNewClaimForm = memo<CreateNewClaimFormProps>(({}) => {
    // organisation data
    const [orgData, setOrgData] = useState<SavedOrgData>(null);
    const [currentOrgTabId, setCurrentOrgTabId] = useState<OrganisationTabId>(OrganisationTabId.search);
    const [inputSearchValue, setInputSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<ISuggestions[]>(null);
    const [dropdownItems, setDropdownItems] = useState<MenuProps['items']>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ISuggestions>(null);
    // claim data
    const [claimName, setClaimName] = useState<string>('');
    const [claimText, setClaimText] = useState<string>('');
    const [claimFiles, setClaimFiles] = useState<UploadFile[]>([]);
    // ошибка
    const [error, setError] = useState<string>('');
    // modal
    const [modalContext, setModalContext] = useState<IModalContext>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    // clean fields
    const [cleanOrg, setCleanOrg] = useState<boolean>(false);
    const [cleanText, setCleanText] = useState<boolean>(false);

    // memos

    const showCancelButton = useMemo<boolean>(() => {
        const isEmpty = orgData ? !Object.values(orgData).some(val => val !== '') : true;
        return !!(claimName || claimText || !!claimFiles.length || selectedItem || !isEmpty);
    }, [claimName, claimText, claimFiles.length, selectedItem, orgData])

    const menuItems = useMemo<MenuProps>(() => {
        if (!dropdownItems || !dropdownItems.length) return null
        return { items: dropdownItems }
    }, [dropdownItems])

    // handlers

    const handleInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsDropdownOpen(false);
        setInputSearchValue(e.target.value);
    }, [])

    const handleSearch = useCallback(() => {
        if (!inputSearchValue) return;
        getOrganisationSuggestionsRequest(inputSearchValue)
            .then((res) => {
                console.log('res', res.suggestions)
                setSearchResult(res.suggestions);
                createMenuItems(res.suggestions);
            })
            .catch((err) => {
                console.log('error', err)
                setSearchResult(null)
            })
    }, [inputSearchValue])

    const createMenuItems = useCallback((suggestions: ISuggestions[]) => {
        const newArray: MenuProps['items'] = suggestions.map((item, index) => {
            return {
                key: `${item.value + index}`,
                label: renderMenuItem(item, index),
                onClick: () => handleDropdownItemClick(item)
            }
        })
        setDropdownItems(newArray);
        setIsDropdownOpen(true);
    }, [])

    const renderMenuItem = (item: ISuggestions, index?: number): JSX.Element => {
        return (
            <div className={styles['menu-item']} key={`${item.value + index}`}>
                <span className={styles['item-name']}>{item.value}</span><span><span className={styles['item-key']}>инн:</span> {item.data.inn}</span>
                <div>{item.data.address.value}</div>
            </div>
        )
    }

    const handleDropdownItemClick = useCallback((item: ISuggestions) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
        setInputSearchValue('');
    }, [])

    const handleSaveOrganisationData = useCallback((data: SavedOrgData) => {
        setOrgData(data);
        setError(null);
    }, [])

    const handleChangeTextEditor = useCallback((text: string, files: UploadFile[]) => {
        setClaimText(text);
        setClaimFiles(files);
        setError(null);
    }, [])

    const isValidForm = useCallback((): {isValid: boolean; message?: string} => {
        // нет даных об организации
        if (!orgData) return {isValid: false, message: 'Заполните данные организации'};
        // полные ли данные организации
        const isFullOrgData = Object.values(orgData).every((orgValue) => orgValue !== '' && orgValue !== null);
        // нет всех данных организации
        if (!isFullOrgData) return {isValid: false, message: 'Не все данные организации заполнены'};
        // нет названия
        if (!claimName) return {isValid: false, message: 'Введите название обращения'};
        // нет текста
        if (!claimText) return {isValid: false, message: 'Введите описание'};

        return {isValid: true}
    }, [claimName, claimText, orgData])

    const handleChangeClaimName = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setClaimName(event.target.value);
        setError(null);
    }, [])

    const raiseModal = useCallback((context: IModalContext) => {
        setModalContext(context);
        setModalOpen(true);
    }, [])

    const handleCancelClaim = useCallback(() => {
        // raise poppup
        raiseModal({
            title: 'Подтверждение',
            text: 'Вы уверены что хотите отменить обращение? Все введенные данные будут удалены',
            type: ModalType.cancel
        })
    }, []);

    const handleSubmitClaim = useCallback(() => {
        // validate
        const { isValid, message } = isValidForm();

        if (!isValid) {
            setError(message);
            return;
        }
        // raise modal with loading
        raiseModal({
            title: 'Подтверждение',
            text: 'Вы уверены что хотите отправить обращение?',
            type: ModalType.submit
        })
    }, [isValidForm]);

    const handleModalOk = () => {
        if (modalContext.type === ModalType.submit) {
            // send claim
            submitFullForm();
        }
        if (modalContext.type === ModalType.cancel) {
            // remove all data
            setInputSearchValue('');
            setOrgData(null);
            setClaimFiles([]);
            setClaimText('');
            setClaimName('');
            cleanOrgFields();
            cleanTextFields();
        }
        setModalOpen(false);
    };

    const cleanOrgFields = () => {
        setCleanOrg(true);
        setTimeout(() => setCleanOrg(false), 100)
    }

    const cleanTextFields = () => {
        setCleanText(true);
        setTimeout(() => setCleanText(false), 100)
    }

    const handleModalCancel = () => {
        setModalOpen(false);
    };

    const submitFullForm = useCallback(async () => {
        const sessionId = localStorage.getItem('id');
        const files = claimFiles;
        // TODO прикрутить files
        const params: CreateNewClaimParams = {
            claimName: claimName,
            claimText: claimText,
            contentSum: "1500000",
            contentType: "Appeal",
            recipientAddress: orgData.address,
            recipientEmail: "",
            recipientInn: orgData.inn,
            recipientName: orgData.name,
            sessionId: sessionId,
            file: null
        }
        const response = await requestCreateNewClaim(params);

        console.log('requestCreateNewClaim response', response)
    }, [claimName, claimText, orgData?.address, orgData?.inn, orgData?.name])


    const renderOrganisationData = (): JSX.Element => {
        return <ManualForm clean={cleanOrg} saveOrganisationData={handleSaveOrganisationData} />
    }

    const renderSelectedItem = (): JSX.Element => {
        if (!selectedItem) return null;
        return (
            <ManualForm
                clean={cleanOrg}
                selectedOrganisation={selectedItem}
                saveOrganisationData={handleSaveOrganisationData}
            />
        )
    }

    const menuStyle = (): React.CSSProperties => {
        return {
            maxHeight: '70vh',
            maxWidth: '600px',
            minWidth: '440px',
            overflow: 'scroll',
        }
    }

    const renderDropdownContainer = (menu: React.ReactNode) => {
        if (!menu) return null;
        return React.cloneElement(menu as React.ReactElement, { style: menuStyle() })
    }

    const renderCloseIcon = (): React.ReactNode => {
        return (
            <div className={styles['close-icon']}>
                <IoClose size={18}/>
            </div>
        )
    }

    return (
        <div className={styles['create-new-claim-form']}>
            <div className={styles['organisation']}>
                <div className={styles['caption']}>Организация</div>
                <div className={styles['description']}>Введите данные организации или выполните ее поиск</div>
                <div className={styles['pick-block']}>
                    {/*<div className={styles['tabs']}>*/}
                    {/*    <div*/}
                    {/*        onClick={() => handleTabItemClick(OrganisationTabId.search)}*/}
                    {/*        className={classNames(*/}
                    {/*            styles['tabs-item'],*/}
                    {/*            currentOrgTabId === OrganisationTabId.search && styles['_active']*/}
                    {/*        )}*/}
                    {/*    >*/}
                    {/*        Поиск*/}
                    {/*    </div>*/}
                    {/*    <div*/}
                    {/*        onClick={() => handleTabItemClick(OrganisationTabId.manual)}*/}
                    {/*        className={classNames(*/}
                    {/*            styles['tabs-item'],*/}
                    {/*            currentOrgTabId === OrganisationTabId.manual && styles['_active']*/}
                    {/*        )}*/}
                    {/*    >*/}
                    {/*        Ввести вручную*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <Dropdown
                        autoAdjustOverflow={true}
                        placement="bottomLeft"
                        dropdownRender={renderDropdownContainer}
                        menu={menuItems}
                        open={isDropdownOpen}
                    >
                        <div className={classNames(
                            styles['tabs']
                        )}>
                            <div className={classNames(
                                styles['tabs-item'],
                                styles['_search-input']
                            )}>
                                <Input
                                    value={inputSearchValue}
                                    onChange={handleInputSearch}
                                    rootClassName={styles['org-search']}
                                    size="middle"
                                    placeholder="Введите название, ИНН или ОГРН"
                                    allowClear
                                    bordered={false}
                                />
                            </div>
                            <div
                                className={classNames(
                                    styles['tabs-item'],
                                    styles['icon']
                                )}
                                onClick={handleSearch}
                            >
                                <IoIosSearch size={16} />
                            </div>
                        </div>
                    </Dropdown>
                    {/*<div className={classNames(*/}
                    {/*    styles['tabs'],*/}
                    {/*    styles['_search']*/}
                    {/*)}>*/}
                    {/*    <div*/}
                    {/*        className={classNames(*/}
                    {/*            styles['tabs-item'],*/}
                    {/*            styles['icon'],*/}
                    {/*            styles['_trash']*/}
                    {/*        )}*/}
                    {/*        onClick={() => {}}*/}
                    {/*    >*/}
                    {/*        <IoTrashOutline size={16} />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className={styles['content']}>
                    {selectedItem ? renderSelectedItem() : renderOrganisationData()}
                </div>
            </div>
            <TextArea
                bordered={false}
                className={styles['enter-title']}
                placeholder="Введите название"
                onChange={handleChangeClaimName}
                value={cleanText ? '' : claimName}
                autoSize
            />
            <div className={styles['text']}>
                <div className={styles['claim-text-caption']}>Текст обращения</div>
                <TextEditor
                    onChange={handleChangeTextEditor}
                    placeHolder='Используйте меню выше чтобы форматировать описание'
                    showButtons={false}
                    toolBarClassName={styles['editor-tool-bar']}
                    editTextClassName={styles['editor-edit-text']}
                    clean={cleanText}
                />
            </div>
            <div className={styles['error-block']}>
                {error ? error : null}
            </div>
            <div className={styles['submit-block']}>
                <Button
                    type="default"
                    title="Отмена"
                    onClick={handleCancelClaim}
                    disabled={!showCancelButton}
                >
                    Отмена
                </Button>
                <Button
                    type="primary"
                    title="Зарегистрировать обращение"
                    onClick={handleSubmitClaim}
                >
                    Отправить
                </Button>
            </div>
            <Modal
                title={modalContext?.title}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Подтвердить"
                cancelText="Отмена"
                closeIcon={renderCloseIcon()}
            >
                <div>{modalContext?.text}</div>
            </Modal>
        </div>
    )
})

export default CreateNewClaimForm;