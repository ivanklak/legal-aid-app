import React, {ChangeEvent, memo, useCallback, useMemo, useState} from "react";
import styles from "./NewRequestOrganisationInfoPart.module.sass";
import Button from "../../../../controls/button/Button";
import classNames from "classnames";
import {Dropdown, Input, MenuProps} from "antd";
import {IoIosSearch} from "react-icons/io";
import ManualForm, {SavedOrgData} from "../../../createForm/manualForm/ManualForm";
import {ISuggestions} from "../../../api/requests/GetOrganisationSuggestionsRequest";
import {HiOutlineInbox} from "react-icons/hi2";
import getOrganisationSuggestionsRequest from "../../../api/methods/getOrganisationSuggestionsRequest";
import {IoWarningOutline} from "react-icons/io5";

interface NewRequestOrganisationInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Информация об организации';

const NewRequestOrganisationInfoPart = memo<NewRequestOrganisationInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const [orgData, setOrgData] = useState<SavedOrgData>(null);
    const [inputSearchValue, setInputSearchValue] = useState<string>('');
    const [dropdownItems, setDropdownItems] = useState<MenuProps['items']>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ISuggestions>(null);
    // clean fields
    const [cleanOrg, setCleanOrg] = useState<boolean>(false);
    const [cleanText, setCleanText] = useState<boolean>(false);

    const renderNothingFoundItem = () => {
        return (
            <div className={styles['nothing-found-menu-item']}>
                <HiOutlineInbox />
                <span className={styles['nothing-found-text']}>Нет организаций соответствующих вашему запросу</span>
            </div>
        )
    }

    const nothingFoundedItem = useMemo(() => {
        return {
            key: 'empty',
            label: renderNothingFoundItem(),
            onClick: () => setIsDropdownOpen(false)
        }
    }, [])

    const menuItems = useMemo<MenuProps>(() => {
        if (!dropdownItems || !dropdownItems.length) return { items: [nothingFoundedItem] }
        return { items: dropdownItems }
    }, [dropdownItems])

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

    const handleInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsDropdownOpen(false);
        setInputSearchValue(e.target.value);
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

    const handleSearch = useCallback(() => {
        if (!inputSearchValue) return;
        getOrganisationSuggestionsRequest(inputSearchValue)
            .then((res) => {
                console.log('res', res.suggestions)
                createMenuItems(res.suggestions);
            })
            .catch((err) => {
                console.log('error', err)
            })
    }, [inputSearchValue])

    const handleSaveOrganisationData = useCallback((data: SavedOrgData) => {
        setOrgData(data);
        // setError(null);
    }, [])

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

    return (
        <div className={styles['org-part']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела</div>
            <div className={styles['org-part-content']}>
                <div className={styles['caption']}>Организация</div>
                <div
                    className={classNames(
                        styles['description'],
                        // isOrganisationError && styles['_red']
                    )}
                >
                    <span>Введите данные организации или выполните ее поиск</span>
                    {/*{isOrganisationError && <IoWarningOutline className={styles['warning-icon']} size={15}/>}*/}
                </div>
                <div className={styles['pick-block']}>
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
                </div>
                <div className={styles['content']}>
                    {selectedItem ? renderSelectedItem() : renderOrganisationData()}
                </div>
            </div>
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button onClick={onNextPageClick} className={styles['next-btn']}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestOrganisationInfoPart;