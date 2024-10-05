import {IDisposable} from "../../../core/types/IDisposable";
import {Instance} from "../../../core/entity";
import {UseCounter} from "../../../core/UseCounter";
import {EventEmitter, EventHandle} from "../../../core/event";
import {RuntimeError} from "../../../core/errors";
import {stringUtils} from "../../../core/utils/stringUtils";
import {IScrollable} from "./IScrollable";

export type ScrollStatusChangedMessage = { isScrolling: boolean, dx: number, dy: number };
export type ScrollStatusChanged = EventEmitter<ScrollStatusChangedMessage>;
export type ScrollStatusChangedHandle = EventHandle<ScrollStatusChangedMessage>;

export type ScrollSizeChangedMessage = { dw: number, dh: number };
export type ScrollSizeChanged = EventEmitter<ScrollSizeChangedMessage>;
export type ScrollSizeChangedHandle = EventHandle<ScrollSizeChangedMessage>;

// описатель одной скроллируемой области
export class ScrollPositionWatcherDescriptor implements IDisposable {
	private _element: IScrollable;  // целевой элемент
	private _onScrollStatusChanged: ScrollStatusChanged;	// событие изменения статуса
	private _onScrollSizeChanged: ScrollSizeChanged; 		// событие изменения внутренней высоты
	private _storedLeft: number;
	private _storedTop: number;
	private _storedScrollHeight: number;
	private _storedScrollWidth: number;
	private _isScrolling: boolean;
	private _isScrollingDx: number;
	private _isScrollingDy: number;
	private _checkTimeout: number;

	constructor(element: IScrollable) {
		this.disposePrivate = this.disposePrivate.bind(this);
		this.checkScrollParams = this.checkScrollParams.bind(this);
		//
		this._element = element;
		this._onScrollStatusChanged = new EventEmitter<ScrollStatusChangedMessage>('ScrollWatcherDescriptor_statusChanged_' + stringUtils.getUniqueId());
		this._onScrollSizeChanged = new EventEmitter<ScrollSizeChangedMessage>('ScrollWatcherDescriptor_sizeChanged_' + stringUtils.getUniqueId());
		this._isScrolling = false;
		this._isScrollingDx = 0;
		this._isScrollingDy = 0;
		//
		this._checkTimeout = window.setTimeout(this.checkScrollParams);
		//
		this.usePrivate();
	}

	// закончить использование
	public dispose() {
		UseCounter.unUse(this, this.disposePrivate);
	}

	// уничтожить, раз нет использований
	private disposePrivate() {
		ScrollPositionWatcher.instance.removeWatcherPrivate(this);
		//
		window.clearTimeout(this._checkTimeout);
		this._element = null;
		this._onScrollStatusChanged = null;
		this._onScrollSizeChanged = null;
	}

	// начать использование
	public usePrivate() {
		UseCounter.use(this);
	}

	// событие изменения состояния прокрутки
	public get onScrollStatusChanged() { return this._onScrollStatusChanged; }

	// событие изменения размера области прокрутки
	public get onScrollSizeChanged() { return this._onScrollSizeChanged; }

	// целевая область слежения
	public get element() { return this._element; }

	// прокручивается ли область сейчас
	public get isScrolling() { return this._isScrolling; }

	// направление смещения горизонтальное
	public get scrollDx() { return this._isScrollingDx; }
	// направление смещения вертикальное
	public get scrollDy() { return this._isScrollingDy; }

	// изменилось ли положение
	private isScrollChanged()  {
		return (
			this._element.scrollTop != this._storedTop ||
			this._element.scrollLeft != this._storedLeft ||
			this._element.scrollWidth != this._storedScrollWidth ||
			this._element.scrollHeight != this._storedScrollHeight
		);
	}

	// OPTIMIZE_DANIIL добавил вызов через setTimeout чтобы не вызывать reflow,
	// надо чтобы ответственные посмотрели во всех ли кейсах это верно работает
	// сохранить размеры и положение, вычислить смещение
	private checkScrollParams(): { dx: number, dy: number, dw: number, dh: number } {
		const dx = this._element.scrollLeft - this._storedLeft;
		const dy = this._element.scrollTop - this._storedTop;
		const dw = this._element.scrollWidth - this._storedScrollWidth;
		const dh = this._element.scrollHeight - this._storedScrollHeight;
		//
		this._storedLeft = this._element.scrollLeft;
		this._storedTop = this._element.scrollTop;
		this._storedScrollWidth = this._element.scrollWidth;
		this._storedScrollHeight = this._element.scrollHeight;
		//
		return { dx: dx, dy: dy, dw: dw, dh: dh };
	}

	// перепроверить изменения и вызвать события
	public checkScrollingPrivate() {
		if (this.isScrollChanged()) {
			// что-то изменилось
			const {dx, dy, dw, dh} = this.checkScrollParams(); // положение или размеры изменились
			if (dx != 0 || dy != 0) {
				// положение изменилось
				if (!this._isScrolling) {
					this._isScrolling = true; // отмечаем факт начала прокрутки
					this._isScrollingDx = Math.sign(dx);
					this._isScrollingDy = Math.sign(dy);
					this._onScrollStatusChanged.emit({ isScrolling: true, dx: this._isScrollingDx, dy: this._isScrollingDy });
				}
			}
			if (dw != 0 || dh != 0) {
				// размеры изменились
				this._onScrollSizeChanged.emit({ dw: dw, dh: dh });
			}
		} else if (this._isScrolling) {
			this._isScrolling = false; // положение сохранялось целый таймаут, делаем предположение о том, что скрол остановился
			this._isScrollingDx = 0;
			this._isScrollingDy = 0;
			this._onScrollStatusChanged.emit({ isScrolling: false, dx: this._isScrollingDx, dy: this._isScrollingDy });
		}
	};
}

const SCROLL_CHECK_INTERVAL: number = 100;		// раз в это ms будет происходить проверка факта начала / окончания прокрутки

// центральный механизм учета скроллируемых областей
// для осуществления возможности отслеживания факта начала и окончания прокрутки
export class ScrollPositionWatcher implements IDisposable {
	private _watchers: ScrollPositionWatcherDescriptor[]; // описание всех скроллов
	private _watchDogHandle: number; // указатель на интервал

	constructor() {
		this.checkAllScrollPosition = this.checkAllScrollPosition.bind(this);
		this._watchers = [];
		this._watchDogHandle = window.setInterval(this.checkAllScrollPosition, SCROLL_CHECK_INTERVAL);
	}

	public dispose() {
		window.clearInterval(this._watchDogHandle);
		this._watchDogHandle = null;
		//
		this._watchers.forEach(x => x.dispose());
		this._watchers = null;
	}

	// singleton
	public static get instance() { return Instance.getOrCreate<ScrollPositionWatcher>(ScrollPositionWatcher, 'ScrollPositionWatcher'); }

	// создать новое слежение за областью element
	public createWatcher(element: IScrollable): ScrollPositionWatcherDescriptor {
		if (!element) throw new RuntimeError('ScrollPositionWatcher.createWatcher: argument null exception');
		//
		const existWatcher = this._watchers.find(x => x.element === element);
		if (existWatcher) {
			existWatcher.usePrivate();	// повторное использование объекта
			return existWatcher;
		}
		//
		const retval = new ScrollPositionWatcherDescriptor(element);
		this._watchers.push(retval);
		return retval;
	}

	// убрать ранее созданный watcher
	public removeWatcherPrivate(watcher: ScrollPositionWatcherDescriptor) {
		if (!watcher) throw new RuntimeError('ScrollPositionWatcher.removeWatcherPrivate: argument null exception');
		//
		const index = this._watchers.indexOf(watcher);
		if (index == -1) throw new RuntimeError('ScrollPositionWatcher.removeWatcherPrivate: watcher not registered');
		this._watchers.splice(index, 1);
	}

	// перепроверить положение всех скролов
	private checkAllScrollPosition() {
		this._watchers.forEach(descriptor => {
			descriptor.checkScrollingPrivate();
		});
	}
}
