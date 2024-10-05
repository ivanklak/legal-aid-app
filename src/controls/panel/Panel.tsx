import React from "react";
import {IScrollableRecognizerProps, ScrollRecognizer} from "../common/scroll";
import classNames from "classnames";
import {IScrollable} from "../common/scroll";
import {ScrollArea, ScrollBarVisibility} from "../scrollArea";
import {Debounce} from "../../core/utils";
import {EnrichPropsEmpty, RootComponentProps} from "../common/EnrichProps";
import styles from "./Panel.module.sass";
import {WidgetStyle} from "../style/Widget.Style";

export interface PanelProps extends IScrollableRecognizerProps {
	horizontalScrollBarVisibility?: ScrollBarVisibility;	// режим горизонтального сколла
	verticalScrollBarVisibility?: ScrollBarVisibility;		// режим вертикального скролла
	scrollMargin?: number;									// отступ между скроллом и контентом
	//
	className?: string;										// специальные стили
	style?: React.CSSProperties;							// специальные стили
	children?: React.ReactNode;								// дети
	onScroll?: () => void;									// событие изменения положения прокрутки
	useMinSiteWidthContainer?: boolean;						// ограничивать  ширину контейнера минимальной шириной сайта из конфига
	useMaxSiteWidthContainer?: boolean;						// ограничивать ширину контейнера максимальной шириной сайта из конфига
	//
	scrollTopStorageKey?: string;							// ключ сохранения в сторадж scrollTop
	needSaveScrollTopToStorage?: boolean;					// стоит ли сохранять в сторадж
}

const TIMEOUT_BEFORE_SCROLL_RESTORING: number = 100;		// задержка перед повторным восстановлением положения скролла

// <div/> или <ScrollArea/>, простая обертка для виджета
export class Panel extends React.PureComponent<PanelProps> {
	private readonly _refDiv: React.RefObject<HTMLDivElement>;
	private readonly _refScrollArea: React.RefObject<ScrollArea>;
	private _restoreScrollTimeout: number;
	private _readScrollTimeout: number;
	private _elementScrollTop: number;
	private _scrollDebounce: Debounce<void>;

	constructor(props: PanelProps) {
		super(props);
		//
		this._refDiv = React.createRef();
		this._refScrollArea = React.createRef();
		this._restoreScrollTimeout = null;
		this._readScrollTimeout = null;
		this._elementScrollTop = null;
		this._scrollDebounce = new Debounce<void>(this.scrollHandler, 100);
	}

	componentWillUnmount() {
		window.clearTimeout(this._restoreScrollTimeout);
		window.clearTimeout(this._readScrollTimeout);
		this._restoreScrollTimeout = null;
		this._readScrollTimeout = null;
		//
		// TODO сохранить положение прокрутки в рамках сессии (add SessionStorage class)
		if (this.props.needSaveScrollTopToStorage && this._elementScrollTop) {
			// SessionStorage.instance.setScrollPosition(this.props.scrollTopStorageKey, this._elementScrollTop);
			this._elementScrollTop = null;
		}
	}

	// восстановить положение прокрутки
	public restoreScrollPosition(key: string) {
		// определим как мы попали на текущий роутинг (вошли заново или восстановили из браузера)
		// если вошли заново - ничего не делаем, если восстановили - пытаемся вернуть прокрутку как было
		// const navigationType = (this.context as TLocationContext)?.navigationType;
		// if (navigationType != NavigationType.Pop) return;
		// //
		// const scrollTop = SessionStorage.instance.getScrollPosition(key);
		// const scrollable = this.element;
		// if (scrollTop == null || !scrollable) return;
		// //
		// scrollable.scrollTop = scrollTop;
		// // задали, а не задалось?
		// if (scrollable.scrollTop != scrollTop) {
		// 	// одна из причин: контент не успел отрисоваться (виджеты точно загружены, но флаги 'hide' могли не примениться ещё
		// 	// другая причина: контент теперь иной высоты - не сможем докрутиться никогда
		// 	// попробуем чуть позже снова
		// 	window.clearTimeout(this._restoreScrollTimeout);
		// 	this._restoreScrollTimeout = window.setTimeout(() => {
		// 		// последний раз пробуем
		// 		this._restoreScrollTimeout = null;
		// 		scrollable.scrollTop = scrollTop;
		// 	}, TIMEOUT_BEFORE_SCROLL_RESTORING);
		// }
	}

	// прокручиваемая область
	public get element(): IScrollable {
		if (this._refDiv.current)
			return this._refDiv.current;
		else if (this._refScrollArea.current)
			return this._refScrollArea.current;
		//
		return null;
	}

	private scrollHandler = () => {
		// Запоминаем значение scrollTop если есть ключ для дальнейшего сохранения
		if (this.props.scrollTopStorageKey) {
			window.clearTimeout(this._readScrollTimeout);
			// OPTIMIZE_DANIIL это сделано чтобы избежать рефлоу и не читать scrollTop на unmount
			this._readScrollTimeout = window.setTimeout(() => {
				const scrollTop = this.element?.scrollTop;
				if (scrollTop == null) return;
				this._elementScrollTop = scrollTop;
			})
		}
		//
		this.props.onScroll?.();
	}

	private get enrichProps() {
		return EnrichPropsEmpty;
	}

	private enrichPropsScrollArea = (props: RootComponentProps) => {
		const p = this.enrichProps(props);
		const {outerStyle} = WidgetStyle.separateStyleForScrollArea(this.props.style);
		p.style = outerStyle;	// меняем установку внешних стилей
		return p;
	};

	private onScroll = () => {
		console.log('--- onScroll ---')
		// @ts-ignore
		this._scrollDebounce.call();
	}

	render(): React.ReactNode {
		// сформируем стиль отображения
		if ((this.props.horizontalScrollBarVisibility == null || this.props.horizontalScrollBarVisibility == ScrollBarVisibility.none) &&
			(this.props.verticalScrollBarVisibility == null || this.props.verticalScrollBarVisibility == ScrollBarVisibility.none)
		) {
			const style = this.props.style || {};
			// если нет скроллов - не будем усложнять разметку
			return (
				<div
					{...this.enrichProps({
						ref: this._refDiv,
						className: classNames(
							styles['panel'],
							this.props.className,
							this.props.useMaxSiteWidthContainer && styles['with-max-width'],
							this.props.useMinSiteWidthContainer && styles['with-min-width'],
						),
						style: style,
						onScroll: this.onScroll,
						children: this.props.children,
						// дополнительные характеристики, чтобы можно было обнаружить эту область, когда она еще не переполнена
						...ScrollRecognizer.makeAttributesByProps(this.props)
					})}
				/>
			);
		} else {
			// вычленяем из общих стилей отступ между элементами, т.к. нужно применять не к внешней оболочке скролла, а к внутренней
			let {innerStyle} = WidgetStyle.separateStyleForScrollArea(this.props.style);

			// возможно, скроллы будут
			return (
				<ScrollArea
					enrichProps={this.enrichPropsScrollArea}
					ref={this._refScrollArea}
					horizontalScrollBarVisibility={this.props.horizontalScrollBarVisibility ? this.props.horizontalScrollBarVisibility : ScrollBarVisibility.none}
					verticalScrollBarVisibility={this.props.verticalScrollBarVisibility ? this.props.verticalScrollBarVisibility: ScrollBarVisibility.none}
					marginBetweenViewPortAndScrollBars={this.props.scrollMargin}
					viewPortStyle={innerStyle}
					viewPortClassName={classNames(
						this.props.className,
						this.props.useMaxSiteWidthContainer && styles['with-max-width'],
						this.props.useMinSiteWidthContainer && styles['with-min-width']
					)}
					children={this.props.children}
					onViewPortChanged={this.onScroll}
					// дополнительные характеристики, чтобы можно было обнаружить эту область, когда она еще не переполнена
					{...ScrollRecognizer.makeAttributesByProps(this.props)}
				/>
			)
		}
	}
}
