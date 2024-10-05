import React from "react";
import {IScrollableElement} from "../common/scroll";
import {ScrollBarVisibility} from "../scrollArea";
import {EventHandle} from "../../core/event";
import {domUtils} from "../../core/utils";
import {Panel} from "./Panel";

interface ScrollablePanelProps {
	hScroll?: ScrollBarVisibility;			// наличие горизонтальной прокрутки с режимом ...
	vScroll?: ScrollBarVisibility;			// наличие вертикальной прокрутки с режимом ...
	scrollMargin?: number | string;			// отступ в px между контентом и сколлом
	useMinSiteWidthContainer?: boolean;		// ограничивать  ширину контейнера минимальной шириной сайта из конфига
	useMaxSiteWidthContainer?: boolean;		// ограничивать ширину контейнера максимальной шириной сайта из конфига
	vars?: Record<string, string>;			// установка любых переменных
	className?: string;						// доп стили
	style?: React.CSSProperties;			// доп класс стилей
	children: React.ReactNode;				// дети
}

// панель может быть прокручиваема
// панель слушает, когда будут загружены дети и прокрутится на то же место, что и было ранее
export class ScrollablePanel extends React.PureComponent<ScrollablePanelProps> implements IScrollableElement {

	private readonly _ref: React.RefObject<Panel> = React.createRef();	// указатель на панель
	private _loadedParametersChangedHandle: EventHandle;				// подписка на загруженность
	private _scrollPositionKey: string;									// постоянная для определения настройки положения прокрутки
	private _scrollPositionRestored: boolean;							// положение прокрутки восстановлено
	private _varMaps: Map<string, string>;								// сохраненные значения переменных


	constructor(props: ScrollablePanelProps) {
		super(props);
		//
		this._scrollPositionRestored = false;
		this._varMaps = new Map();
		// озаботимся восстановлением положения прокрутки, когда виджеты будут загружены (если в конфиге определено поле key)
		// this._scrollPositionKey = this.props.def_key ? `${window.location.pathname}_${this.props.def_key}` : null;
	}

	componentDidMount() {
		// super.componentDidMount();
		//
		// подписка на полную загрузку компонента с детьми
		// this._loadedParametersChangedHandle = this.loadParametersChanged.subscribe(this.onLoadedParametersChanged);		// подписка
		// переопределение переменных, сохраним старые значения
		this._varMaps.clear();
		if (this.props.vars) {
			// @ts-ignore
			Object.entries(this.props.vars).forEach(([key, value]) => {
				const oldValue = domUtils.getCSSVariable(key);
				this._varMaps.set(key, oldValue);
				domUtils.setCSSVariable(key, value);
			});
		}
	}

	componentWillUnmount() {
		// переопределение переменных, восстановим старые значения
		this._varMaps.forEach((oldValue, key) => {
			if (!oldValue) domUtils.removeCSSVariable(key);
			else domUtils.setCSSVariable(key, oldValue);
		});
		this._varMaps.clear();
		this._varMaps = null;
		// отписка
		this._loadedParametersChangedHandle?.dispose();
		this._loadedParametersChangedHandle = null;
		//
		this._scrollPositionKey = null;
	}

	// IScrollableWidget
	public get element() { return this._ref.current?.element; }

	// измененилось состояние загруженности (с детьми)
	private onLoadedParametersChanged = () => {
		// if (!this.loadedAll) return;
		//
		// здесь уже знаем, что виджеты внутренни загружены - восстанавливаем положение прокрутки (один раз)
		if (this._scrollPositionKey && !this._scrollPositionRestored) {
			this._ref.current.restoreScrollPosition(this._scrollPositionKey);
			this._scrollPositionRestored = true;
		}
		//
		// более не нуждаемся в обработчике, все дела сделаны
		this._loadedParametersChangedHandle?.dispose();
		this._loadedParametersChangedHandle = null;
	};

	render(): React.ReactNode {
		// в поле может бьть написано 6 или '6px' или '--scrollSize'
		const c = this.props;
		const scrollMargin =
			typeof c.scrollMargin == 'string'
				? parseInt(domUtils.getCSSVariableOrValue(c.scrollMargin))
				: c.scrollMargin;
		//
		return (
			<Panel
				ref={this._ref}
				// enrichProps={this.enrichProps}
				//
				horizontalScrollBarVisibility={c.hScroll}
				verticalScrollBarVisibility={c.vScroll}
				scrollMargin={scrollMargin}
				style={this.props.style}
				useMinSiteWidthContainer={this.props.useMinSiteWidthContainer}
				useMaxSiteWidthContainer={this.props.useMaxSiteWidthContainer}
				//
				scrollTopStorageKey={this._scrollPositionKey}
				// needSaveScrollTopToStorage={this.loadedAll == true}
				//
				children={this.props.children}
			/>
		);
	}
}
