import React from 'react';
import classes from "classnames";
import {EventEmitter, EventHandle} from "../../core/event";
import {domUtils} from "../../core/utils/domUtils";
import {IDOMElement} from "../../controls/common/IDOMElement";
import {IScrollable, IScrollableRecognizerProps, ScrollRecognizer} from "../../controls/common/scroll";
import {EnrichPropsEmpty, EnrichPropsMethod} from "../../controls/common/EnrichProps";
import {DefaultScrollBarChangedHandle, DefaultScrollBarWidthWatcher} from "./defaultScrollBarWidthWatcher";
import {ScrollBar, ScrollBarOrientation} from "./scrollBar";
import styles from "./scrollArea.module.sass";

// режимы отображения скролов
export enum ScrollBarVisibility {
	none = 'none',												// не видно
	alwaysVisible = 'alwaysVisible',							// видно всегда
	auto = 'auto',												// видно, если viewPort меньше общего размера (по умолчанию)
	autoWithFixedSpace = 'autoWithFixedSpace',					// видно, если viewPort меньше общего размера, но место под скролл выделено всегда одинаковое
	autoWhenHoverWithFixedSpace = 'autoWhenHoverWithFixedSpace',// видно при прокрутке или hover на области, если viewPort меньше общего размера, но место под скролл выделено всегда одинаковое
	autoWhenScrollOverArea = 'autoWhenScrollOverArea',			// видно при прокрутке на области, если viewPort меньше общего размера, но место под скролл НЕ ВЫДЕЛЯЕТСЯ (рисуется поверх)
	autoOverArea = 'autoOverArea',								// видно, если viewPort меньше общего размера, но место под скролл НЕ ВЫДЕЛЯЕТСЯ (рисуется поверх)
}

// типы для события прокрутки
export type ViewPortChangedMessage = ScrollArea;
export type ViewPortChangedHandle = EventHandle<ViewPortChangedMessage>;
export type ViewPortChangedEmitter = EventEmitter<ViewPortChangedMessage>;
export type ViewPortChangedArgs = {
	left?: number;
	top?: number;
	width?: number;
	height?: number;
	hash: number;
};

// тип любого действия
type CallbackType = () => void;

export interface ScrollAreaProps extends IScrollableRecognizerProps {
	horizontalScrollBarVisibility?: ScrollBarVisibility;	// режим горизонтального скрола
	verticalScrollBarVisibility?: ScrollBarVisibility;		// режим вертикального скрола
	marginBetweenViewPortAndScrollBars?: number;			// отступ между viewPort и скролами
	disableViewPortTabStop?: boolean;						// блокировать фокус на области прокрутки
	//
	className?: string;										// специальный стили
	style?: React.CSSProperties;							// специальные стили
	viewPortClassName?: string;								// специальные стили для внутреннего viewPort (штатного)
	viewPortStyle?: React.CSSProperties;					// специальный стиль для внутреннего viewPort (штатного)
	viewPortDecoratorClassName?: string;					// специальные стили для наружнего viewPort
	viewPortDecoratorStyle?: React.CSSProperties;			// специальный стиль для наружнего viewPort
	thumbPanelClassName?: string;							// специальные стили полосы прокрутки
	thumbPanelCapturedClassName?: string;					// специальные стили полосы прокрутки, если ее захватили указательным устройством
	thumbClassName?: string;								// специальные стили таскалки в полосе прокрутки
	//
	enrichProps?: EnrichPropsMethod;						// механизм обогащения props для корневого виджета
	onScrollStarted?(): void;								// начали крутить
	onScrollFinished?(): void;								// закончили крутить
	onViewPortChanged?(e: ViewPortChangedArgs): void,		// изменилась видимая часть (размер, прокрутка)
	//
	children?: React.ReactNode;
}

const VIEW_PORT_CHECK_SIZE_INTERVAL = 200;		// раз в это ms будет происходить проверка размеров, реакция viewPortChanged
const SCROLL_CHECK_INTERVAL: number = 100;		// раз в это ms будет происходить проверка факта начала / окончания прокрутки
const ANIMATION_TIMEOUT: number = 0;			// задержка перед шагом анимации (для безумной плавности - 0, что убьет проц)
const ANIMATION_STEPS: number = 30;				// количество шагов анимации

// прокручиваемая область, скороллы выглядят одинаково во всех браузерах
export class ScrollArea extends React.PureComponent<ScrollAreaProps> implements IScrollable, IDOMElement {
	public static readonly viewPortChanged: ViewPortChangedEmitter = new EventEmitter<ViewPortChangedMessage>('scrollArea_onViewPortChanged');	// событие прокрутки любого скролла
	private static readonly _instances: ScrollArea[] = [];			// все сущности этого класса
	//
	private readonly _refViewPort: React.RefObject<HTMLDivElement>; 		// ref прокручиваемой области
	private readonly _refHorizontalScroll: React.RefObject<ScrollBar>;		// ref горизонтальной прокрутки
	private readonly _refVerticalScroll: React.RefObject<ScrollBar>;		// ref вертикальной прокрутки
	//
	private static _checkViewPortSizeTimer: number = null;	// таймер перепроверки viewPort
	private _lastClientWidth: number;						// ширина viewPort, по которой реагировали viewPortChanged
	private _lastClientHeight: number;						// высота viewPort, по которой реагировали viewPortChanged
	private _lastScrollWidth: number;						// ширина children, по которой реагировали viewPortChanged
	private _lastScrollHeight: number;						// высота children, по которой реагировали viewPortChanged
	private _lastTop: number;								// положение по вертикали
	private _lastLeft: number;								// положение по горизонтали
	//
	private static _checkScrollTimer: number = null;		// таймер проверки состояния прокручивания списка
	private _scrolling: boolean;		 					// прокручивается ли список
	private _lastScrollTop: number;							// последнее положение прокрутки по вертикали
	//
	private _horizontalScrollVisible: boolean;				// нарисовали ли горизонтальный скрол
	private _verticalScrollVisible: boolean;				// нарисовали ли вертикальный скрол
	//
	private _afterViewPortChanged: CallbackType;			// отложенный вызов действия, который следует выполнить после прокрутки на элемент
	private _scrollAnimatorHandle: number;					// для плавной прокрутки, указатель на таймер
	//
	private _mounted: boolean;
	private _defaultScrollBarChangedHandle: DefaultScrollBarChangedHandle;

	constructor(props: ScrollAreaProps) {
		super(props);
		//
		this.onHorizontalScrollChanged = this.onHorizontalScrollChanged.bind(this);
		this.onVerticalScrollChanged = this.onVerticalScrollChanged.bind(this);
		this.onScroll = this.onScroll.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.defaultScrollBarWidthChanged = this.defaultScrollBarWidthChanged.bind(this);
		//
		this._refViewPort = React.createRef();
		this._refVerticalScroll = React.createRef();
		this._refHorizontalScroll = React.createRef();
		//
		// следилка за размерами
		if (ScrollArea._checkViewPortSizeTimer == null) {
			ScrollArea._checkViewPortSizeTimer = window.setInterval(
				() =>  ScrollArea._instances.forEach(i => i.checkViewPortSize())
				, VIEW_PORT_CHECK_SIZE_INTERVAL);
		}
		// следилка за состоянием сколла
		if (ScrollArea._checkScrollTimer == null) {
			ScrollArea._checkScrollTimer = window.setInterval(
				() =>  ScrollArea._instances.forEach(i => i.checkScrolling())
				, SCROLL_CHECK_INTERVAL);
		}
		//
		this._lastClientHeight = null;
		this._lastClientWidth = null;
		this._lastScrollHeight = null;
		this._lastScrollWidth = null;
		this._lastLeft = null;
		this._lastTop = null;
		//
		this._scrolling = false;
		this._lastScrollTop = 0;
		//
		this._horizontalScrollVisible = false;
		this._verticalScrollVisible = false;
		//
		this._afterViewPortChanged = null;
	}

	componentDidMount(): void {
		ScrollArea._instances.push(this);
		this._mounted = true;
		//
		this.checkViewPortSize();
		if (this._verticalScrollVisible == null || this._horizontalScrollVisible == null) this.invalidate();
		//
		this._defaultScrollBarChangedHandle = DefaultScrollBarWidthWatcher.onChanged.subscribe(this.defaultScrollBarWidthChanged);
	}

	componentWillUnmount(): void {
		const indexOfInstance = ScrollArea._instances.indexOf(this);
		if (indexOfInstance != -1) ScrollArea._instances.splice(indexOfInstance, 1);
		//
		this._lastClientWidth = null;
		this._lastClientHeight = null;
		this._lastScrollWidth = null;
		this._lastScrollHeight = null;
		this._lastLeft = null;
		this._lastTop = null;
		//
		this._scrolling = false;
		this._lastScrollTop = 0;
		//
		this._horizontalScrollVisible = false;
		this._verticalScrollVisible = false;
		//
		this._afterViewPortChanged = null;
		//
		this._defaultScrollBarChangedHandle.dispose();
		this._mounted = false;
	}

	// если поменяется ширина скрола - приедем сюда
	private defaultScrollBarWidthChanged() {
		this.invalidate();
	}

	// принудительная перерисовка
	private invalidate() {
		if (!this._mounted) return;
		//
		this.forceUpdate();
	}

	// прокрутить область до top
	// когда сдвинется, возвращаем true, не сдвинется никогда - false
	public scrollToTop(top: number, smooth: boolean): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			const div = this._refViewPort.current;
			if (div && top != null) {
				const newVal = Math.max(0, Math.min(top, div.scrollHeight - div.offsetHeight));
				if (div.scrollTop != newVal) {
					if (smooth != true) {
						// без анимации
						this._afterViewPortChanged = () => resolve(true);
						this.scrollTop = newVal;
					} else {
						// то же самое, но с анимацией
						div.style.scrollBehavior = 'smooth'
						div.scrollTo({
							top: top,
							behavior: 'smooth'
						})
						this.scrollTop = newVal;
						this._afterViewPortChanged = () => {
							div.style.scrollBehavior = '';
							resolve(true);
						}
						this.doViewPortChanged();
					}
				} else resolve(true);		// уже сдвинуто на нужное место
			} else resolve(false); 		// нечего двигать, не отрисовано еще
		});
	}

	// прокрутить вверх до самого начала
	public scrollToZero() {
		//
		if (this.scrollTop != 0) this.scrollTop = 0;
		if (this.scrollLeft != 0) this.scrollLeft = 0;
	}

	// прокрутить до
	public scrollTo(left: number, top: number) {
		if (this.scrollTop != top) this.scrollTop = top;
		if (this.scrollLeft != left) this.scrollLeft = left;
	}

	// умная прокрутка до элемента
	public ensureVisibleByDOMElement(element: HTMLElement, smooth: boolean): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (!this._refViewPort.current || !element) {
				resolve(false);	// не можем
				return;
			}
			//
			let {x, y} = domUtils.parentOffset(element, this._refViewPort.current);
			this.ensureVisibleBySize(y, element.clientHeight, smooth)
				.then(retval => resolve(retval));
		});
	}
	// умная прокрутка до объекта
	public ensureVisibleBySize(elementTop: number, elementHeight: number, smooth: boolean): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (!this._refViewPort.current) {
				resolve(false);	// не можем
				return;
			}
			//
			if (elementTop >= this.scrollTop && elementTop + elementHeight <= this.scrollTop + this.clientHeight) {
				resolve(true);	// находимся в видимой области
				return;
			}
			//
			// пробуем уместить весь элемент во viewPort
			let top: number = 0;
			if (this.scrollTop > elementTop) {
				top = elementTop;
			} else if (this.scrollTop + this.clientHeight < elementTop + elementHeight) {
				if (elementHeight < this.clientHeight) {
					top = this.scrollTop + (elementTop + elementHeight - (this.scrollTop + this.clientHeight));
				} else {
					top = elementTop;
				}
			} else {
				resolve(false);
				return;
			}
			//
			this.scrollToTop(top, smooth)
				.then(retval => resolve(retval));
		});
	}

	// элемент в зоне видимости
	public isElementVisible(left: number, top: number, width: number, height: number): boolean {
		let checked: boolean = false;
		if (top != null && height != null) {
			if (top + height < this._lastTop) return false; // выше
			if (top > this._lastTop + this._lastClientHeight) return false; // ниже
			checked = true;
		}
		if (left != null && width != null) {
			if (left + width < this._lastLeft) return false; // левее
			if (left > this._lastLeft + this._lastClientWidth) return false; // правее
			checked = true;
		}
		return checked;
	}

	// сейчас список прокручивают
	public get isScrolling(): boolean {
		return this._scrolling;
	}
	// сейчас прокручивают какой-нибудь список
	public static get isSomethingScrolling(): boolean {
		for (let i = 0; i < ScrollArea._instances.length; i++) {
			const tmp = ScrollArea._instances[i];
			if (tmp.isScrolling) return true;
		}
		return false;
	}

	// должен ли быть скрыт после прокрутки
	private shouldScrollBeHide(visibility: ScrollBarVisibility) {
		return visibility === ScrollBarVisibility.autoWhenHoverWithFixedSpace ||
			visibility === ScrollBarVisibility.autoWhenScrollOverArea;
	}

	// скролл поверх области
	private shouldScrollBeOver(visibility: ScrollBarVisibility) {
		return visibility === ScrollBarVisibility.autoOverArea ||
			visibility === ScrollBarVisibility.autoWhenScrollOverArea;
	}

	// должен ли быть скролл
	private shouldBeScroll(visibility: ScrollBarVisibility) {
		return visibility === undefined ||
			visibility === ScrollBarVisibility.auto ||
			visibility === ScrollBarVisibility.autoWithFixedSpace ||
			visibility === ScrollBarVisibility.autoWhenHoverWithFixedSpace ||
			visibility === ScrollBarVisibility.autoWhenScrollOverArea ||
			visibility === ScrollBarVisibility.autoOverArea;
	}
	// должен ли быть горизонтальный скролл
	public get shouldBeHorizontalScroll(): boolean {
		return this.shouldBeScroll(this.props.horizontalScrollBarVisibility);
	}
	// должен ли быть вертикальный скролл
	public get shouldBeVerticalScroll(): boolean {
		return this.shouldBeScroll(this.props.verticalScrollBarVisibility);
	}

	// должен ли быть скролл
	private shouldAlwaysAllocateSpaceToScroll(visibility: ScrollBarVisibility) {
		return visibility === ScrollBarVisibility.autoWithFixedSpace ||
			visibility === ScrollBarVisibility.autoWhenHoverWithFixedSpace;
	}
	// должен ли быть виден сейчас горизонтальный скролл
	private get shouldHorizontalScrollBeVisible(): boolean {
		return this._horizontalScrollVisible || this.shouldAlwaysAllocateSpaceToScroll(this.props.horizontalScrollBarVisibility);
	}
	// должен ли быть виден сейчас вертикальный скролл
	private get shouldVerticalScrollBeVisible(): boolean {
		return this._verticalScrollVisible || this.shouldAlwaysAllocateSpaceToScroll(this.props.verticalScrollBarVisibility);
	}

	// дети в виде DOM-элементов
	public get children(): HTMLCollection {
		if (this._refViewPort.current) {
			return this._refViewPort.current.children;
		}
		return null;
	}
	// // количество детей
	// public get childrenCount(): number {
	// 	if (this._refViewPort.current) {
	// 		return this._refViewPort.current.children.length;
	// 	}
	// 	return null;
	// }

	// возвращает высоту viewPort
	public get clientHeight(): number {
		return this._lastClientHeight;
	}
	// возвращает высоту всего компонента
	public get offsetHeight(): number {
		const useScrollBar = this.shouldHorizontalScrollBeVisible;
		let retval = this.clientHeight;
		//
		if (useScrollBar) retval += ScrollBar.SIZE;
		if (useScrollBar && this.props.marginBetweenViewPortAndScrollBars) retval += this.props.marginBetweenViewPortAndScrollBars;
		//
		return retval;
	}
	// возвращает длину прокрутки
	public get scrollHeight(): number {
		return this._lastScrollHeight;
	}
	// возвращает положение прокрутки
	public get scrollTop(): number {
		return this._lastTop;
	}
	// изменяет положение прокрутки
	public set scrollTop(val: number) {
		console.log('set scrollTop -> val', val)
		if (this._lastTop == val) return;
		//
		const div = this._refViewPort.current;
		if (div) {
			const newVal = Math.min(Math.max(0, val), div.scrollHeight - div.clientHeight);
			if (div.scrollTop != newVal) {
				div.scrollTop = newVal;
				this._lastTop = newVal;
				this.checkScrollingExt(false);
				this.doViewPortChanged();
			}
		}
	}

	// возвращает ширину viewPort
	public get clientWidth(): number {
		return this._lastClientWidth;
	}
	// возвращает ширину всего компонента
	public get offsetWidth(): number {
		const useScrollBar = this.shouldVerticalScrollBeVisible;
		let retval = this.clientWidth;
		//
		if (useScrollBar) retval += ScrollBar.SIZE;
		if (useScrollBar && this.props.marginBetweenViewPortAndScrollBars) retval += this.props.marginBetweenViewPortAndScrollBars;
		//
		return retval;
	}
	// возвращает длину прокрутки
	public get scrollWidth(): number {
		return this._lastScrollWidth;
	}
	// возвращает положение прокрутки
	public get scrollLeft(): number {
		return this._lastLeft;
	}
	// изменяет положение прокрутки
	public set scrollLeft(val: number) {
		if (this._lastLeft == val) return;
		//
		const div = this._refViewPort.current;
		if (div) {
			const newVal = Math.min(Math.max(0, val), div.scrollWidth - div.clientWidth);
			if (div.scrollLeft != newVal) {
				div.scrollLeft = newVal;
				this._lastLeft = newVal;
				this.checkScrollingExt(false);
				this.doViewPortChanged();
			}
		}
	}

	// // видны ли полосы прокрутки (приходится прятать в некоторых случаях виртуализации)
	// public get scrollBarsVisible(): boolean {
	// 	if (this._refHorizontalScroll.current) {
	// 		if (!this._refHorizontalScroll.current.visible) return false;
	// 	}
	// 	if (this._refVerticalScroll.current) {
	// 		if (!this._refVerticalScroll.current.visible) return false;
	// 	}
	// 	return true;
	// }
	// // устанавливает видимость полос прокрутки
	// public set scrollBarsVisible(value: boolean) {
	// 	if (this._refHorizontalScroll.current) {
	// 		this._refHorizontalScroll.current.visible = value;
	// 	}
	// 	if (this._refVerticalScroll.current) {
	// 		this._refVerticalScroll.current.visible = value;
	// 	}
	// }

	// // дети в виде html
	// public get viewPortChildren(): HTMLCollection {
	// 	const div = this._refViewPort.current;
	// 	return div ? div.children : null;
	// }

	// apashkov переименовал из viewPortElement в element, следуя интерфейсу IDOMElement
	// элемент разметки, содержащий детей
	public get element(): HTMLElement {
		return this._refViewPort.current;
	}
	// элемент горизонтального скролла
	public get horizontalScrollBarElement(): HTMLElement {
		const sb = this._refHorizontalScroll.current;
		return sb ? sb.element : null;
	}
	// элемент вертикального скролла
	public get verticalScrollBarElement(): HTMLElement {
		const sb = this._refVerticalScroll.current;
		return sb ? sb.element : null;
	}
	// // корневой элемент контрола
	// public get element(): HTMLElement {
	// 	// viewPortDefault -> viewPort
	// 	return this.viewPortElement?.parentElement?.parentElement;
	// }

	// проверка видимой области
	private checkViewPortSize() {
		const div = this._refViewPort.current;
		if (!div) return;
		//
		const w = div.clientWidth;
		const h = div.clientHeight;
		const sw = div.scrollWidth;
		const sh = div.scrollHeight;
		// если произошло изменение - отреагируем
		if (this._lastClientWidth != w || this._lastClientHeight != h ||
			this._lastScrollWidth != sw || this._lastScrollHeight != sh) {
			//
			this._lastClientWidth = w;
			this._lastClientHeight = h;
			this._lastScrollWidth = sw;
			this._lastScrollHeight = sh;
			if (this._lastTop == null) this._lastTop = div.scrollTop;
			if (this._lastLeft == null) this._lastLeft = div.scrollLeft;
			//
			this.doViewPortChanged();
		}
	}

	// проверка состояния прокрутки
	private checkScrolling() {
		this.checkScrollingExt(true);
	}
	private checkScrollingExt(setLastValue: boolean) {
		if (this._lastTop == null) return;
		//
		if (this._lastTop != this._lastScrollTop) {
			// положение от последней проверки изменилось
			if (setLastValue) this._lastScrollTop = this._lastTop;
			if (!this._scrolling) {
				// отмечаем факт начала прокрутки
				this._scrolling = true;
				this.props.onScrollStarted && this.props.onScrollStarted();
			}
		} else if (this._scrolling && setLastValue) {
			// положение сохранялось целый таймаут, делаем предположение о том, что скрол остановился
			this._scrolling = false;
			this.props.onScrollFinished && this.props.onScrollFinished();
			if (this.shouldScrollBeHide(this.props.horizontalScrollBarVisibility) ||
				this.shouldScrollBeHide(this.props.verticalScrollBarVisibility)) {
				// следует плавно скрыть скроллы
				this.invalidate();
			}
		}
	}

	// среагировать на изменение видимой области
	private doViewPortChanged() {
		if (this.props.onViewPortChanged) {
			// режим виртуализации? - сигнал перерисовки поступит извне (дети поменяются)
			this.invalidate();	// перерисуем скроллы
			//
			const l = this.scrollLeft;
			const t = this.scrollTop;
			const w = this.clientWidth;
			const h = this.clientHeight;
			this.props.onViewPortChanged({ left: l, top: t, width: w, height: h, hash: l + t + w + h });
			this.doAfterViewPortChanged();
			return;
		}
		// виртуализация не используется - обновляем область сразу
		this.invalidate();	// перерисуем скроллы
		this.doAfterViewPortChanged();
	}

	// после обновлени viewPort нужно вызвать внешний метод (анимация, например)
	private doAfterViewPortChanged() {
		if (this._afterViewPortChanged) {
			this._afterViewPortChanged();
			this._afterViewPortChanged = null;
		}
		//
		ScrollArea.viewPortChanged.emit(this);
	}

	// горизонтальный ползунок сдвинут
	private onHorizontalScrollChanged(value: number) {
		this.scrollLeft = Math.floor(value);
	}

	// вертикальный ползунок сдвинут
	private onVerticalScrollChanged(value: number) {
		this.scrollTop = Math.floor(value);
	}

	// когда штатный скрол сдвигается - двигаем наши скролы и уведомляем
	private onScroll(e: React.UIEvent) {
		const $this = e.currentTarget;
		const top = $this.scrollTop;
		const left = $this.scrollLeft;
		//
		// боремся с режимами
		if (!this._horizontalScrollVisible && left > 0) {
			this.scrollLeft = 0;
			return;
		}
		if (!this._verticalScrollVisible && top > 0) {
			this.scrollTop = 0;
			return;
		}
		//
		// убраны ограничения, что left > 0 и top > 0, т.к. Safari любит делать оттяжку (реализация фиксированных шапок будет неверной, раз список двигается - пусть шапки двигаются)
		if (
			(this._lastTop != top || this._lastLeft != left) &&
			(!this._verticalScrollVisible || this._verticalScrollVisible && top <= ($this.scrollHeight - $this.clientHeight)) &&
			(!this._horizontalScrollVisible || this._horizontalScrollVisible && left <= ($this.scrollWidth - $this.clientWidth))
		) {
			this._lastClientWidth = $this.clientWidth;
			this._lastClientHeight = $this.clientHeight;
			this._lastScrollWidth = $this.scrollWidth;
			this._lastScrollHeight = $this.scrollHeight;
			this._lastTop = $this.scrollTop;
			this._lastLeft = $this.scrollLeft;
			//
			this.checkScrollingExt(false);
			this.doViewPortChanged();
			//
			e.preventDefault();
			e.stopPropagation();
		}
	}

	// может ли быть обработан сдвиг
	public canWheelBeProcessed(e: React.WheelEvent): boolean {
		if (!this._horizontalScrollVisible && !this._verticalScrollVisible) {
			// не наше дело (нет скролов) - пусть идет дальше
			return false;
		}
		//
		if (!this._horizontalScrollVisible && Math.abs(e.deltaX) > 0 &&
			this._verticalScrollVisible && Math.abs(e.deltaY) == 0) {
			// не наше дело (нет сдвига по нужной оси) - пусть идет дальше
			return false;
		}
		//
		if (this._horizontalScrollVisible && Math.abs(e.deltaX) == 0 &&
			!this._verticalScrollVisible && Math.abs(e.deltaY) > 0) {
			// не наше дело (нет сдвига по нужной оси) - пусть идет дальше
			return false;
		}
		//
		return true;
	}
	// прокрутка колесиком или ведем по touchPad (изменить положение вертикального скрола)
	// над всем компонентом
	public onWheel(e: React.WheelEvent): boolean {
		if (!this.canWheelBeProcessed(e)) return false;
		//
		let processed: boolean = false;
		if (Math.abs(e.deltaX) > 0) {
			if (this._refHorizontalScroll.current) this._refHorizontalScroll.current.onWheel(e);
			processed = true;
		}
		if (Math.abs(e.deltaY) > 0) {
			if (this._refVerticalScroll.current) this._refVerticalScroll.current.onWheel(e);
			processed = true;
		}
		if (processed) {
			e.cancelable && e.preventDefault();
			e.stopPropagation();
		}
		return true;
	}

	// отрисовка прокручиваемой области
	render(): React.JSX.Element {
		const sbWidth = DefaultScrollBarWidthWatcher.instance.defaultScrollWidth;
		if (sbWidth == null) return null;					// DOM не готов
		//
		const scrollMargin = this.props.marginBetweenViewPortAndScrollBars === undefined ? 0 : this.props.marginBetweenViewPortAndScrollBars;
		//
		let horizontalScrollVisible: boolean = null;
		if (this.props.horizontalScrollBarVisibility === ScrollBarVisibility.none) horizontalScrollVisible = false;
		else if (this.props.horizontalScrollBarVisibility === ScrollBarVisibility.alwaysVisible) horizontalScrollVisible = true;
		//
		let verticalScrollVisible: boolean = null;
		if (this.props.verticalScrollBarVisibility === ScrollBarVisibility.none) verticalScrollVisible = false;
		else if (this.props.verticalScrollBarVisibility === ScrollBarVisibility.alwaysVisible) verticalScrollVisible = true;
		//
		const divViewPort = this._refViewPort.current;
		if (divViewPort) {
			this._lastClientWidth = divViewPort.clientWidth;
			this._lastClientHeight = divViewPort.clientHeight;
			this._lastScrollWidth = divViewPort.scrollWidth;
			this._lastScrollHeight = divViewPort.scrollHeight;
			// всегда не следует устанавливать, иначе ручной сдвиг будет работать неверно
			if (this._lastTop == null) this._lastTop = divViewPort.scrollTop;
			if (this._lastLeft == null) this._lastLeft = divViewPort.scrollLeft;
			//
			if (this.shouldBeHorizontalScroll && !horizontalScrollVisible) {
				horizontalScrollVisible = (divViewPort.scrollWidth - divViewPort.clientWidth) > 0;
			}
			if (this.shouldBeVerticalScroll && !verticalScrollVisible) {
				verticalScrollVisible = (divViewPort.scrollHeight - divViewPort.clientHeight) > 0;
			}
		}
		//
		// запомним расчеты для wheel
		this._horizontalScrollVisible = horizontalScrollVisible;
		this._verticalScrollVisible = verticalScrollVisible;
		//
		// нужно прятать скролы, если область не прокручивается
		const hideHorizontalScrollsAfterScrolling = this.shouldScrollBeHide(this.props.horizontalScrollBarVisibility) && !this._scrolling;
		const hideVerticalScrollsAfterScrolling = this.shouldScrollBeHide(this.props.verticalScrollBarVisibility) && !this._scrolling;
		//
		const horizontalScrollOver = this.shouldScrollBeOver(this.props.horizontalScrollBarVisibility);
		const verticalScrollOver = this.shouldScrollBeOver(this.props.verticalScrollBarVisibility);
		const hasGrip = horizontalScrollVisible && verticalScrollVisible && horizontalScrollOver && verticalScrollOver;
		//
		const enrichProps = this.props.enrichProps ?? EnrichPropsEmpty;
		return (
			<div
				{...enrichProps({
					className:classes(
							styles['scroll-area'],
						this.shouldHorizontalScrollBeVisible && !horizontalScrollOver && styles['has-horizontal-scroll'],
						this.shouldVerticalScrollBeVisible && !verticalScrollOver && styles['has-vertical-scroll'],
						this.props.className
					),
					style: this.props.style,
				})}
			>
				<div
					className={classes(
						styles['scroll-area__view-port'],
						this.props.viewPortDecoratorClassName
					)}
					style={{
						...(this.shouldHorizontalScrollBeVisible ? {paddingBottom: `${scrollMargin}px`, height: `calc(100% - ${scrollMargin}px)`} : null),
						...(this.shouldVerticalScrollBeVisible ? {paddingRight: `${scrollMargin}px`, width: `calc(100% - ${scrollMargin}px)`} : null),
						...this.props.viewPortDecoratorStyle
					}}
				>
					<div
						ref={this._refViewPort}
						className={classes(
							styles['scroll-area__view-port__default'],
							horizontalScrollVisible && styles['_horizontal-overflow'],
							verticalScrollVisible && styles['_vertical-overflow'],
							this.props.viewPortClassName
						)}
						style={{
							// если по какой-то оси нет прокрутки - запретим ее физически, иначе браузер будет пытаться все время сдвинуть при маленьшем движении мыши
							...(horizontalScrollVisible ? {marginBottom: `${-sbWidth}px`, height: `calc(100% + ${sbWidth}px)`} : null),
							...(verticalScrollVisible ? {marginRight: `${-sbWidth}px`, width: `calc(100% + ${sbWidth}px)`} : null),
							...this.props.viewPortStyle
						}}
						// фиксированная градиентная область для отладки
						// children={
						// 	<div style={{width: '1000px', height: '1000px', background: 'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)'}}/>
						// }
						children={this.props.children}
						tabIndex={(horizontalScrollVisible || verticalScrollVisible) && (this.props.disableViewPortTabStop != true) ? 0 : -1}
						onScroll={this.onScroll}
						// дополнительные характеристики, чтобы можно было обнаружить эту область, когда она еще не переполнена
						{...ScrollRecognizer.makeAttributes(this.shouldBeHorizontalScroll, this.shouldBeVerticalScroll)}
					/>
				</div>
				{
					horizontalScrollVisible && divViewPort ?
						<ScrollBar
							ref={this._refHorizontalScroll}
							className={classes(
								styles['scroll-area__scrollbar'],
								horizontalScrollOver ? styles['_horizontal-over'] : styles['_horizontal'],
								hideHorizontalScrollsAfterScrolling && styles['_hide'],
								horizontalScrollOver && styles['_ignore-hover'],
							)}
							style={hasGrip ? {right: ScrollBar.SIZE.toString() + 'px'} : null}
							thumbClassName={this.props.thumbClassName}
							thumbPanelClassName={this.props.thumbPanelClassName}
							thumbPanelCapturedClassName={this.props.thumbPanelCapturedClassName}
							orientation={ScrollBarOrientation.horizontal}
							length={divViewPort.scrollWidth}
							value={divViewPort.scrollLeft}
							size={divViewPort.clientWidth - (hasGrip ? ScrollBar.SIZE : 0)}	// уже изменилось после задания style
							buttonsVisible={false}
							onValueChanged={this.onHorizontalScrollChanged}
							tabIndex={this.props.disableViewPortTabStop != true ? 0 : -1}
						/> : null
				}
				{
					verticalScrollVisible && divViewPort ?
						<ScrollBar
							ref={this._refVerticalScroll}
							className={classes(
								styles['scroll-area__scrollbar'],
								verticalScrollOver ? styles['_vertical-over'] : styles['_vertical'],
								hideVerticalScrollsAfterScrolling && styles['_hide'],
								verticalScrollOver && styles['_ignore-hover'],
							)}
							style={hasGrip ? {bottom: ScrollBar.SIZE.toString() + 'px'} : null}
							thumbClassName={this.props.thumbClassName}
							thumbPanelClassName={this.props.thumbPanelClassName}
							thumbPanelCapturedClassName={this.props.thumbPanelCapturedClassName}
							orientation={ScrollBarOrientation.vertical}
							length={divViewPort.scrollHeight}
							value={divViewPort.scrollTop}
							size={divViewPort.clientHeight - (hasGrip ? ScrollBar.SIZE : 0)}	// уже изменилось после задания style
							buttonsVisible={false}
							onValueChanged={this.onVerticalScrollChanged}
							tabIndex={this.props.disableViewPortTabStop != true ? 0 : -1}
						/> : null
				}
			</div>
		);
	}

	// проверяет является ли элемент прокручиваемой областью этого компонента
	public static equals(element: HTMLElement): boolean {
		if (!element) return false;
		return element.className.indexOf('scroll-area__view-port__default') != -1;
	}

	// возвращает ближайший по родителю вверх инстанс компонента прокрутки
	public static getScrollableAreaByElement(element: HTMLElement): ScrollArea {
		if (!element) return null;
		//
		let retval: ScrollArea = null;
		let retvalDepth: number = 1000; // глубина пути
		// осуществляем поиск с минимальной глубиной
		for (let i = 0; i < ScrollArea._instances.length; i++) {
			const instance = ScrollArea._instances[i];
			const viewPortElement = instance._refViewPort.current;
			if (!viewPortElement) continue;
			//
			let deep = 0;
			let tmp = element;
			if (tmp == viewPortElement) {
				if (deep < retvalDepth) {
					retval = instance;
					retvalDepth = deep;
				}
				continue;
			}
			while (tmp.parentElement) {
				tmp = tmp.parentElement;
				deep++;
				if (tmp == viewPortElement) {
					if (deep < retvalDepth) {
						retval = instance;
						retvalDepth = deep;
					}
					break;
				}
			}
		}
		//
		return retval;
	}

	// возвращает ближайший по элементу внутрь инстанс компонента прокрутки
	public static getScrollableAreaByParentElement(rootElement: HTMLElement): ScrollArea {
		if (!rootElement) return null;
		//
		for (let i = 0; i < ScrollArea._instances.length; i++) {
			const instance = ScrollArea._instances[i];
			const viewPortElement = instance._refViewPort.current;
			if (!viewPortElement) continue;
			//
			let tmp = viewPortElement as HTMLElement;
			if (tmp == rootElement) return instance;
			while (tmp.parentElement) {
				tmp = tmp.parentElement;
				if (tmp == rootElement) return instance;
			}
		}
		//
		return null;
	}
}
