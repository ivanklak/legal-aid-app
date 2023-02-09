import React from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
    searchMode?: boolean;
}

interface SearchBarState {
    text: string;
    cancelWidth: number;
}

export class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
    private readonly _refInput: React.RefObject<HTMLInputElement>;

    constructor(props: SearchBarProps) {
        super(props);
        //
        this.state = {
            text: '',
            cancelWidth: 0,
        };

        this._refInput = React.createRef();

        this.onTextChange = this.onTextChange.bind(this);
        this.onClearClick = this.onClearClick.bind(this);
    }

    private onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            text: event.target.value
        })
    }

    private onClearClick() {
        this.setState({
            text: ''
        });

        window.setTimeout(() => this._refInput.current?.focus(), 0)
    }

    private onInputFocus() {
        console.log('focus')
    }

    private onInputBlur() {
        console.log('blur')
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
            </div>
        )
    }
}