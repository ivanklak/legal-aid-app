import React from "react";
import styles from "./SearchBar.module.css";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";

interface SearchBarProps {
    searchMode?: boolean;
    navigate: (path: string) => void;
}

interface SearchBarState {
    text: string;
    isHistoryOpened: boolean;
    matchedLinks: RoutesObject[];
    history: string[];
}

interface RoutesObject {
    name: string,
    path: string
}

const navigationLinks: RoutesObject[] = [
    {name: 'дом', path: '/'},
    {name: 'мои обращения', path: '/myRequests'},
    {name: 'новое обращение', path: '/newRequest'},
    {name: 'уведомления', path: '/notifications'},
];

class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
    private readonly _refInput: React.RefObject<HTMLInputElement>;

    constructor(props: SearchBarProps) {
        super(props);
        //
        this.state = {
            text: '',
            isHistoryOpened: false,
            matchedLinks: [],
            history: []
        };

        this._refInput = React.createRef();

        this.onTextChange = this.onTextChange.bind(this);
        this.onClearClick = this.onClearClick.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
    }

    private onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            text: event.target.value
        })

        // надо сбросить навигацию
        if (event.target.value === '') {
            this.setState({
                matchedLinks: []
            })
        }

        this.tryToFind(event.target.value);
    }

    private tryToFind = (str: string) => {
        for (let i = 0; i < navigationLinks.length; i++) {
            const curr = navigationLinks[i];
            const currName = curr.name;
            const nameArray = currName.split(' ');

            for (let j = 0; j < nameArray.length; j++ ) {
                if (nameArray[j] === str) {
                    this.setState({
                        matchedLinks: [...this.state.matchedLinks, curr],
                    })
                }
            }
        }
    }

    private onClearClick() {
        this.setState({
            text: ''
        });

        window.setTimeout(() => this._refInput.current?.focus(), 0)
    }

    private onInputFocus() {
        this.setState({
            isHistoryOpened: true
        })
    }

    private onInputBlur() {
        window.setTimeout(() => {
            this.setState({
                isHistoryOpened: false,
                matchedLinks: [],
            })

            if (this.state.text.length) {
                this.setState({
                    history: [...this.state.history, this.state.text]
                })
            }
        }, 300)
    }

    private onHistoryItemClick = (item: string) => {
        this.setState({
            text: item
        })
    }

    private onLinkClick = (path: string) => {
        this.props.navigate(path);
    }

    render(): JSX.Element {
        return (
            <div className={styles['search-bar']}>
                <div className={styles['input-frame']}>
                    <div className={styles['search-icon']}>🔍</div>
                    <input
                        placeholder='Поиск'
                        spellCheck={false}
                        value={this.state.text}
                        onChange={this.onTextChange}
                        onFocus={this.onInputFocus}
                        onBlur={this.onInputBlur}
                        ref={this._refInput}
                    />
                    {this.state.text ? (
                        <button className={styles['clear-icon']} onClick={this.onClearClick} />
                    ) : null}
                </div>
                <div className={classNames(
                    styles['history'],
                    this.state.isHistoryOpened && styles['history-open']
                )}>
                    <div className={styles['history-container']}>
                        {!this.state.text ? (
                            <>
                                <div className={styles['history-title']}>
                                    История поиска
                                </div>
                                <div className={styles['items']}>
                                    {!!this.state.history.length && (
                                        this.state.history.map((item, index) => (
                                            <div
                                                key={`${item}${index}`}
                                                className={styles['history-item-container']}
                                                onClick={() => this.onHistoryItemClick(item)}
                                            >
                                                <div className={styles['links']}>
                                                    {item}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles['history-title']}>
                                    {this.state.text}
                                </div>
                                <div className={styles['items']}>
                                    {!!this.state.matchedLinks.length && (
                                        this.state.matchedLinks.map((link, index) => (
                                            <div
                                                key={`${link.path}${index}`}
                                                className={styles['link-container']}
                                                onClick={() => this.onLinkClick(link.path)}
                                            >
                                                <div className={styles['link-icon']}>
                                                    ➡️
                                                </div>
                                                <a
                                                    className={styles['links']}
                                                    href={link.path}
                                                >
                                                    {link.name}
                                                </a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

const NavigatedSearchBar = () => {
    const navigate = useNavigate();

    return <SearchBar navigate={navigate} />
}

export default NavigatedSearchBar;