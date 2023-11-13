import React, {ChangeEvent, memo, useCallback, useMemo, useState} from "react";
import styles from "./CreateNewClaimForm.module.sass";
import TextArea from "antd/es/input/TextArea";
import classNames from "classnames";
import {Dropdown, Input, MenuProps} from "antd";
import {IoIosSearch} from "react-icons/io";
import getOrganisationSuggestionsRequest from "../api/methods/getOrganisationSuggestionsRequest";
import {ISuggestions} from "../api/requests/GetOrganisationSuggestionsRequest";

interface CreateNewClaimFormProps {

}

enum OrganisationTabId {
    search = 'search',
    manual = 'manual'
}

const CreateNewClaimForm = memo<CreateNewClaimFormProps>(({}) => {
    const [currentOrgTabId, setCurrentOrgTabId] = useState<OrganisationTabId>(OrganisationTabId.search);
    const [inputSearchValue, setInputSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<ISuggestions[]>(null);
    const [dropdownItems, setDropdownItems] = useState<MenuProps['items']>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ISuggestions>(null);

    const menuItems = useMemo<MenuProps>(() => {
        if (!dropdownItems || !dropdownItems.length) return null
        return { items: dropdownItems }
    }, [dropdownItems])

    const handleTabItemClick = useCallback((id: OrganisationTabId) => {
        setCurrentOrgTabId(id);
    }, [])

    const handleInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsDropdownOpen(false);
        setInputSearchValue(e.target.value);
    }, [])

    const handleSearch = useCallback(() => {
        console.log('inputSearchValue', inputSearchValue);
        getOrganisationSuggestionsRequest(inputSearchValue)
            .then((res) => {
                console.log('res', res.suggestions)
                setSearchResult(res.suggestions);
                createMenuItems(res.suggestions);
            })
            .catch((err) => {
                console.log('error', err)
                setSearchResult(null)
                // setOptions([{label: renderErrorTitle('Произошла ошибка')}])
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
        // setDropdownItems([]);
    }, [])

    console.log('searchResult', searchResult)
    console.log('selectedItem', selectedItem)


    const renderOrganisationData = (): JSX.Element => {
        return (
            <div>
                renderOrganisationData
            </div>
        )
    }

    const renderEmptyOrganisationData = (): JSX.Element => {
        return (
            <div>
                renderEmptyOrganisationData
            </div>
        )
    }

    const renderFullOrganisationData = (): JSX.Element => {
        return (
            <div>
                renderFullOrganisationData
            </div>
        )
    }

    const renderSelectedItem = (): JSX.Element => {
        if (!selectedItem) return null;
        return (
            <div>
                <div>{selectedItem.value}</div>
                <div>{selectedItem.data.inn}</div>
                <div>{selectedItem.data.address.value}</div>
            </div>
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

    return (
        <div className={styles['create-new-claim-form']}>
            <TextArea
                bordered={false}
                className={styles['enter-title']}
                placeholder="Введите название"
                autoSize
            />
            <div className={styles['organisation']}>
                <div className={styles['caption']}>Организация</div>
                <div className={styles['pick-block']}>
                    <div className={styles['tabs']}>
                        <div
                            onClick={() => handleTabItemClick(OrganisationTabId.search)}
                            className={classNames(
                                styles['tabs-item'],
                                currentOrgTabId === OrganisationTabId.search && styles['_active']
                            )}
                        >
                            Поиск
                        </div>
                        <div
                            onClick={() => handleTabItemClick(OrganisationTabId.manual)}
                            className={classNames(
                                styles['tabs-item'],
                                currentOrgTabId === OrganisationTabId.manual && styles['_active']
                            )}
                        >
                            Ввести вручную
                        </div>
                    </div>
                    {currentOrgTabId === OrganisationTabId.search && (
                        <Dropdown
                            autoAdjustOverflow={true}
                            placement="bottomLeft"
                            dropdownRender={renderDropdownContainer}
                            menu={menuItems}
                            open={isDropdownOpen}
                        >
                            <div className={classNames(
                                styles['tabs'],
                                styles['_search']
                            )}>
                                <div className={classNames(
                                    styles['tabs-item'],
                                    styles['_search-input']
                                )}>
                                    <Input
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
                                        styles['search-icon']
                                    )}
                                    onClick={handleSearch}
                                >
                                    <IoIosSearch size={16} />
                                </div>
                            </div>
                        </Dropdown>
                    )}
                </div>
                <div className={styles['content']}>
                    {currentOrgTabId === OrganisationTabId.manual
                        ? renderEmptyOrganisationData()
                        : selectedItem
                            ? renderSelectedItem()
                            : renderOrganisationData()
                    }
                </div>
            </div>
            <div className={styles['text']}>text</div>
        </div>
    )
})

export default CreateNewClaimForm;