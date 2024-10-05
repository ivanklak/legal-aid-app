import * as React from "react";
import classes from "classnames";
import {domUtils} from "../../core/utils";
import {KeyboardKey} from "../../core/keyboardKey";
import {IDOMElement} from "../../controls/common/IDOMElement";
import {scrollUtils} from "../../controls/common/scroll/scrollUtils";
import styles from "./scrollBar.module.sass";

export enum ScrollBarOrientation {
	horizontal,
	vertical
}

interface ScrollBarProps {
	orientation: ScrollBarOrientation,		// ориентация
	length: number;							// полная длина, scrollWidth / scrollHeight
	value: number;							// текущий отступ, scrollLeft / scrollTop
	size: number;							// размер viewPort, clientWidth / clientHeight
	onValueChanged?(value: number): void;	// нажатие на кнопку или сдвиг таскалки (thumb)
	buttonsVisible?: boolean;				// показывать кнопки увеличения и уменьшения
	tabIndex?: number;						// индекс фокуса
	//
	className?: string;						// специальные стили компонента
	style?: React.CSSProperties;			// специальные стили компонента
	thumbPanelClassName?: string;			// специальные стили полосы прокрутки
	thumbPanelCapturedClassName?: string;	// специальные стили полосы прокрутки, если ее захватили указательным устройством
	thumbClassName?: string;				// специальные стили таскалки
}

const BUTTON_SIZE: number = 6;				// размер кнопки по дизайну
const BUTTON_MARGIN: number = 3;			// отступ кнопки до holder по дизайну
const THUMB_MIN_SIZE: number = 30;			// минимальные размеры thumb
const VALUE_STEP: number = 10;				// шаг сдвига при кликах на кнопки (клавиатура или крайние кнопки)
const REPEAT_DELAY: number = 100;			// раз в это ms будет повторение последнего события (нажали и держим кнопку или мышь)
const BLOCKED_KEY_INPUTS = ['input', 'select', 'button', 'textarea']; // для правильного поведения keyUp в этих контролах

// контрол скрол-бара, который выглядит одинаково во всех браузерах
export class ScrollBar extends React.PureComponent<ScrollBarProps> implements IDOMElement {
	private readonly _ref: React.RefObject<HTMLDivElement>;	// указатель на головной элемент (для хитрой подписки onWheel)
	//
	private _mouseX: number;						// положение мыши, когда произошел захват thumb
	private _mouseY: number;						// положение мыши, когда произошел захват thumb
	private _oldValue: number;						// значение, когда произошел захват thumb
	//
	private _repeatTimer: number;					// повторятель действия (нажали и держим)
	//
	private _decreaseButtonCaptured: boolean;		// кнопка уменьшения захвачена мышью
	private _thumbCaptured: boolean;				// двигалка thumb захвачена мышью
	private _increaseButtonCaptured: boolean;		// кнопка увеличения захвачена мышью

	constructor(props: ScrollBarProps) {
		super(props);
		//
		this._ref = React.createRef();
		//
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.onDecreaseButtonMouseDown = this.onDecreaseButtonMouseDown.bind(this);
		this.onIncreaseButtonMouseDown = this.onIncreaseButtonMouseDown.bind(this);
		this.onThumbHolderMouseDown = this.onThumbHolderMouseDown.bind(this);
		this.onThumbTargetMouseDown = this.onThumbTargetMouseDown.bind(this);
		this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
		this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
		this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
	}

	componentDidMount(): void {
		this._mouseX = null;
		this._mouseY = null;
		this._oldValue = null;
		//
		this._decreaseButtonCaptured = false;
		this._increaseButtonCaptured = false;
		this._thumbCaptured = false;
		//
		document.addEventListener('mousemove', this.onDocumentMouseMove);
		document.addEventListener('mouseup', this.onDocumentMouseUp);
		document.addEventListener('keyup', this.onDocumentKeyUp);
	}

	componentWillUnmount(): void {
		this.stopRepeater();
		//
		document.removeEventListener('mousemove', this.onDocumentMouseMove);
		document.removeEventListener('mouseup', this.onDocumentMouseUp);
		document.removeEventListener('keyup', this.onDocumentKeyUp);
	}

	// ширина или высота скрола по дизайну
	public static get SIZE(): number {
		const val = domUtils.getCSSVariable('--scrollSize');
		if (val) return parseInt(val);
		//
		return 6;	// default by saas
	}


	// незамедлительная перерисовка
	private invalidate() {
		this.forceUpdate(); // pureComponent
	}

	// клик клавиатуры (изменить положение скрола)
	private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (this.isDisabled || !this.props.onValueChanged) return;
		try {
			const activeElement = document.activeElement;
			if (activeElement && BLOCKED_KEY_INPUTS.indexOf(activeElement.tagName.toLowerCase()) != -1) {
				return; // фокус на специальных элементах, которые поддерживают KeyUp
			}
		} catch {}
		//
		let val: number = this.props.value;
		switch (e.key) {
			case KeyboardKey.Up.key:
				if (this.props.orientation == ScrollBarOrientation.vertical && val > 0) val = Math.max(0, val - this.step);
				break;
			case KeyboardKey.Down.key:
				if (this.props.orientation == ScrollBarOrientation.vertical && val < this.maxValue) val = Math.min(this.maxValue, val + this.step);
				break;
			case KeyboardKey.Left.key:
				if (this.props.orientation == ScrollBarOrientation.horizontal && val > 0) val = Math.max(0, val - this.step);
				break;
			case KeyboardKey.Right.key:
				if (this.props.orientation == ScrollBarOrientation.horizontal && val < this.maxValue) val = Math.min(this.maxValue, val + this.step);
				break;
			case KeyboardKey.Home.key:
				val = 0;
				break;
			case KeyboardKey.End.key:
				val = this.maxValue;
				break;
			case KeyboardKey.PageUp.key:
				if (val > 0) val = Math.max(0, val - this.props.size);
				break;
			case KeyboardKey.PageDown.key:
				if (val < this.maxValue) val = Math.min(this.maxValue, val + this.props.size);
				break;
			default:
				return;
		}
		//
		if (this.props.value != val) {
			this.props.onValueChanged(val);
			//
			e.preventDefault();
			e.stopPropagation();
			//
			e.persist();
			this.startRepeater(() => this.onKeyDown(e));
		}
	}

	// отпустили кнопку - остановим (не будем заморачиваться с анализом кнопки)
	private onDocumentKeyUp() {
		this.stopRepeater();
	}

	// прокрутка колесиком (изменить положение скрола)
	public onWheel(e: React.WheelEvent) {
		if (this.isDisabled || !this.props.onValueChanged) return;
		//
		const delta = scrollUtils.getWheelValue(e.nativeEvent, this.props.orientation == ScrollBarOrientation.horizontal ? 'horizontal' : 'vertical');
		const val = Math.max(0, Math.min(this.maxValue, this.props.value + delta));
		if (this.props.value != val) {
			this.props.onValueChanged(val);
		}
	}

	// кнопка уменьшения - уменьшить
	private onDecreaseButtonMouseDown(e: React.MouseEvent<HTMLSpanElement>) {
		if (this.isDisabled || !this.props.onValueChanged || e.button != 0) return;
		this._decreaseButtonCaptured = true;
		//
		let val: number = this.props.value;
		if (val > 0) val = Math.max(0, val - this.step);
		//
		if (this.props.value != val) {
			this.props.onValueChanged(val);
		}
		//
		e.preventDefault();
		e.stopPropagation();
		//
		e.persist();
		this.startRepeater(() => this.onDecreaseButtonMouseDown(e));
	}

	// кнопка увеличения - увеличить
	private onIncreaseButtonMouseDown(e: React.MouseEvent<HTMLSpanElement>) {
		if (this.isDisabled || !this.props.onValueChanged || e.button != 0) return;
		this._increaseButtonCaptured = true;
		//
		let val: number = this.props.value;
		if (val < this.maxValue) val = Math.min(this.maxValue, val + this.step);
		//
		if (this.props.value != val) {
			this.props.onValueChanged(val);
		}
		//
		e.preventDefault();
		e.stopPropagation();
		//
		e.persist();
		this.startRepeater(() => this.onIncreaseButtonMouseDown(e));
	}

	// ткнули в холдер - нужно сместиться в эту сторону на page
	private onThumbHolderMouseDown(e: React.MouseEvent<HTMLDivElement>) {
		if (this.isDisabled || !this.props.onValueChanged || e.button != 0) return;
		//
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		let mousePosition: number = 0;
		if (this.props.orientation == ScrollBarOrientation.horizontal) {
			mousePosition = e.clientX - rect.left;
		} else if (this.props.orientation == ScrollBarOrientation.vertical) {
			mousePosition = e.clientY - rect.top;
		}
		//
		if (mousePosition >= this.thumbValue && mousePosition < this.thumbValue + this.thumbSize) return; // ткнули на thumb
		const clickAfterThumb = (mousePosition > this.thumbValue + this.thumbSize);
		//
		let val: number = this.props.value;
		if (clickAfterThumb) {
			val = Math.min(this.maxValue, val + this.props.size);
		} else {
			val = Math.max(0, val - this.props.size);
		}
		//
		if (this.props.value != val) {
			this.props.onValueChanged(val);
		}
		//
		e.preventDefault();
		e.stopPropagation();
		//
		e.persist();
		this.startRepeater(() => this.onThumbHolderMouseDown(e));
	}

	// захват мышью thumb
	private onThumbTargetMouseDown(e: React.MouseEvent<HTMLSpanElement>) {
		if (this.isDisabled || !this.props.onValueChanged || e.button != 0) return;
		//
		if (this._thumbCaptured != true) {
			this._thumbCaptured = true;
			this.invalidate();
		}
		//
		this._mouseX = e.clientX;
		this._mouseY = e.clientY;
		this._oldValue = this.props.value;
		//
		e.preventDefault();
		e.stopPropagation();
	}

	// перемещение мыши относительно документа (изменить положение скрола)
	private onDocumentMouseMove(e: MouseEvent) {
		if (e.button != 0 || this.isDisabled || !this.props.onValueChanged ||
			this._mouseY === null || this._mouseX === null ||
			this.holderFreeSpace == 0) return;
		//
		let shift: number = 0;
		if (this.props.orientation == ScrollBarOrientation.horizontal) {
			shift = e.clientX - this._mouseX;
		} else if (this.props.orientation == ScrollBarOrientation.vertical) {
			shift  = e.clientY - this._mouseY;
		}
		//
		const valueShift = shift * (this.props.length - this.props.size) / this.holderFreeSpace;
		const newValue: number = Math.max(0, Math.min(this.maxValue, this._oldValue + valueShift));
		if (newValue != this.props.value) this.props.onValueChanged(newValue);
	}

	// отпустили мышь
	private onDocumentMouseUp() {
		// остановим перемещение, если было
		this._mouseX = null;
		this._mouseY = null;
		this._oldValue = null;
		//
		if (this._thumbCaptured != false || this._increaseButtonCaptured != false || this._decreaseButtonCaptured != false) {
			this._thumbCaptured = false;
			this._increaseButtonCaptured = false;
			this._decreaseButtonCaptured = false;
			//
			this.forceUpdate();
		}
		//
		this.stopRepeater();
	}

	// остановить повторятель действия
	private stopRepeater() {
		clearInterval(this._repeatTimer);
		this._repeatTimer = null;
	}

	// запланировать повторятель
	private startRepeater(callBack: () => void) {
		this.stopRepeater();
		//
		this._repeatTimer = window.setInterval(callBack, REPEAT_DELAY);
	}

	// заблокирована ли прокрутка
	private get isDisabled(): boolean {
		if (this.props.value === undefined || this.props.value === null || isNaN(this.props.value)) return true;
		return false;
	}

	// максимальное значение прокрутки
	private get maxValue(): number {
		return this.props.length - this.props.size;
	}

	// минимальный сдвиг
	private get step(): number {
		return Math.max(this.maxValue / this.props.size, VALUE_STEP);
	}

	// размеры места под thumb
	private get holderSize(): number {
		return this.props.size - (this.props.buttonsVisible != false ? (BUTTON_SIZE + BUTTON_MARGIN) * 2 : 0);
	}

	// размеры thumb
	private get thumbSize(): number {
		return Math.max(THUMB_MIN_SIZE, this.holderSize * this.props.size / this.props.length);
	}

	// размеры пространства, которое может быть занято thumb
	private get holderFreeSpace(): number {
		return this.holderSize - this.thumbSize;
	}

	// положение thumb в координатах holder
	private get thumbValue(): number {
		if (this.props.length == this.props.size) return 0;
		return this.holderFreeSpace * this.props.value / (this.props.length - this.props.size);
	}

	// виден ли контрол
	public get visible(): boolean {
		const div = this._ref.current;
		return div ? div.style.visibility != 'hidden' : false;
	}
	// устанавливает видимость контрола
	public set visible(value: boolean) {
		const div = this._ref.current;
		if (div) div.style.visibility = value ? '' : 'hidden';
	}

	// целевой элемент скролла
	public get element(): HTMLElement {
		return this._ref.current;
	}

	render(): React.JSX.Element {
		return (
			<div
				ref={this._ref}
				className={classes(
					styles['scrollbar'],
					this.props.className,
					this.props.orientation == ScrollBarOrientation.horizontal && styles['_horizontal'],
					this.props.orientation == ScrollBarOrientation.vertical && styles['_vertical'],
				)}
				style={this.props.style}
				onKeyDown={this.onKeyDown}
				onWheel={this.onWheel}
				tabIndex={this.props.tabIndex}
			>
				{
					this.props.buttonsVisible != false ?
						<span
							className={classes(
								styles['scrollbar__button'],
								styles['_decrease'],
								(this.isDisabled || this.props.value == 0) && styles['_disabled'],
								this._decreaseButtonCaptured && styles['_selected']
							)}
							onMouseDown={this.onDecreaseButtonMouseDown}
						>
							<span/>
						</span> : null
				}
				<div
					className={classes(
						styles['scrollbar__thumb-panel'],
						this.props.thumbPanelClassName,
						this._thumbCaptured && this.props.thumbPanelCapturedClassName,
					)}
					onMouseDown={this.onThumbHolderMouseDown}
				>
					{
						!this.isDisabled ?
							<span
								className={classes(
									styles['scrollbar__thumb-panel__thumb'],
									this.props.thumbClassName,
									this._thumbCaptured && styles['_selected'],
									(this.props.size == this.props.length) && styles['_disabled']
								)}
								style={{
									...(this.props.orientation == ScrollBarOrientation.horizontal ? {marginLeft: Math.max(0, this.thumbValue) + 'px', width: this.thumbSize + 'px'} : null),
									...(this.props.orientation == ScrollBarOrientation.vertical ? {marginTop: Math.max(0, this.thumbValue) + 'px', height: this.thumbSize + 'px'} : null),
								}}
								onMouseDown={this.onThumbTargetMouseDown}
							>
								<span/>
							</span> : null
					}
				</div>
				{
					this.props.buttonsVisible != false ?
						<span
							className={classes(
								styles['scrollbar__button'],
								styles['_increase'],
								(this.isDisabled || this.props.value == this.maxValue) && styles['_disabled'],
								this._increaseButtonCaptured && styles['_selected']
							)}
							onMouseDown={this.onIncreaseButtonMouseDown}
						>
						<span/>
					</span> : null
				}
			</div>
		);
	}
}
