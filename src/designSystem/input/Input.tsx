import React, {ChangeEvent, DetailedHTMLProps, InputHTMLAttributes} from "react";
import {InputSize, InputSlotComp, InputSlotPosition} from "./InputTypes";
import classNames from "classnames";
// @ts-ignore
import { ReactComponent as CrossSVG } from './res/cross.svg';
import {classNameModifyBySize} from "./InputConst";
import css from "./Input.module.sass";

type NativeInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
type ExcludedInputPropsKey = 'value' | 'onChange' | 'ref';
export type ExtendsInputProps = Omit<NativeInputProps, ExcludedInputPropsKey>;

export interface InputProps extends ExtendsInputProps {
    value?: string;
    size?: InputSize;
    placeholder?: string;
    inputRef?: React.RefObject<HTMLInputElement>;
    containerRef?: React.RefObject<HTMLDivElement>;
    description?: React.ReactNode;
    error?: boolean | string | null;
    disabled?: boolean;
    readonly?: boolean;
    hasClear?: boolean;
    className?: string;
    inputClassName?: string;
    holdBottomSlotHeight?: boolean;
    bottomOffset?: string;
    renderAfterValue?: () => React.ReactNode;
    leftSlotComp?: InputSlotComp;
    rightBeforeSlotComp?: InputSlotComp;
    rightSlotComp?: InputSlotComp;
    onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
    onClear?: VoidFunction;
}

export class Input extends React.PureComponent<InputProps> {

    private static defaultProps: Partial<InputProps> = {
        size: InputSize.Medium,
        hasClear: true
    };

    private _ref = React.createRef<HTMLInputElement>()
    private get inputRef() { return this.props.inputRef ?? this._ref }


    public focus() {
        this._ref.current?.focus();
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange?.(e.target.value, e);
    }

    private handleClear = () => {
        const { onChange, onClear } = this.props;
        if (onClear) {
            onClear()
        } else {
            onChange?.('');
        }

        this.inputRef.current.focus();
    }

    // реакция на нажатие кнопки
    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { onKeyDown } = this.props;
        const element = e.target;

        if (!(element instanceof HTMLInputElement)) return;
        if (onKeyDown) return onKeyDown(e);

        switch (e.code) {
            case 'ArrowLeft': {
                if (element.selectionStart  > 0) {
                    e.stopPropagation();
                }
                break;
            }
            case 'ArrowRight': {
                if (element.selectionStart < element.value.length) {
                    e.stopPropagation();
                }
                break;
            }
        }
    }

    private renderAfterValueHandler() {
        const { renderAfterValue, value = '' } = this.props;

        return (
            <div
                data-component-part='contentUnderValue'
                className={classNames(css['contentUnderValue'], this.props.inputClassName)}
            >
                <span className={css['contentUnderValue__valueClone']}>{value}</span>{renderAfterValue()}
            </div>
        )
    }

    render() {
        const {
            value,
            size,
            bottomOffset,
            className,
            placeholder,
            description,
            error,
            renderAfterValue,
            holdBottomSlotHeight,
            disabled,
            hasClear,
            leftSlotComp,
            rightBeforeSlotComp,
            rightSlotComp,
            inputRef,
            onClear,
            inputClassName,
            containerRef,
            style,
            ...inputProps
        } = this.props;

        const haveErrorString = typeof error == "string";
        const bottomTextSlot = haveErrorString ? error : description;
        const canShowClear = hasClear && !disabled && !!value?.length;

        const commonSlotProps = { size, disabled };

        const rightBeforeSlot = rightBeforeSlotComp && rightBeforeSlotComp({...commonSlotProps, position: InputSlotPosition.RightBefore });

        return (
            <div
                data-component-part='inputContainer'
                ref={containerRef}
                style={style}
                className={classNames(
                    css['inputContainer'],
                    classNameModifyBySize[size],
                    className
                )}
                tabIndex={-1}
            >
                <div
                    data-component-part='inputLine'
                    className={classNames(
                        css['inputLine'],
                        !!error && css['inputLine_error'],
                        disabled && css['inputLine_disabled'],
                        !leftSlotComp && css['inputLine_leftOffset'],
                        !rightSlotComp && css['inputLine_rightOffset'],
                        (!holdBottomSlotHeight && !bottomTextSlot) && css['inputLine_withoutBottomOffset']
                    )}
                    tabIndex={-1}
                >
                    {leftSlotComp && leftSlotComp({...commonSlotProps, position: InputSlotPosition.Left })}
                    <div
                        data-component-part='inputLineContent'
                        className={css['inputLine__content']}
                        tabIndex={-1}
                    >
                        {renderAfterValue && this.renderAfterValueHandler()}
                        <input
                            {...inputProps}
                            value={value || ''}
                            ref={this.inputRef}
                            disabled={disabled || this.props.readonly}
                            placeholder={placeholder}
                            className={classNames(css['input'], inputClassName)}
                            tabIndex={0}
                            onChange={this.handleChange}
                            type={this.props.type || 'text'}
                            autoComplete={this.props.autoComplete || 'off'}
                            onKeyDown={this.onKeyDown}
                        />
                    </div>
                    {rightBeforeSlot}
                    {canShowClear && (
                        <CrossSVG
                            data-component-part='inputCleanButton'
                            className={classNames(
                                css['clearIcon'],
                                !!rightBeforeSlot && css['clearIcon_withoutOffset']
                            )}
                            onClickCapture={this.handleClear}
                            tabIndex={-1}
                        />
                    )}
                    {rightSlotComp && rightSlotComp({...commonSlotProps, position: InputSlotPosition.Right })}
                </div>
                <div
                    className={classNames(
                        css['bottomText'],
                        !!haveErrorString && css['bottomText_error'],
                        holdBottomSlotHeight && css['bottomText_holdHeight']
                    )}
                >
                    {bottomTextSlot}
                </div>
            </div>
        )
    }
}