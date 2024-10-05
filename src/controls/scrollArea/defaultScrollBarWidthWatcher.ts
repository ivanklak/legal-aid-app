import {EventEmitter, EventHandle} from '../../core/event';
import {Instance} from "../../core/entity";
import {ApplicationNode} from "../../core/utils/domUtils";

import styles from "./scrollArea.module.sass";

// Описание типов для события DefaultScrollBarChanged - изменение ширины полосы прокрутки в браузере (спасибо macOS за настройку)
export type DefaultScrollBarChangedMessage = void;
export type DefaultScrollBarChangedHandle = EventHandle<DefaultScrollBarChangedMessage>;
export type DefaultScrollBarChangedEmitter = EventEmitter<DefaultScrollBarChangedMessage>;

// компонент следит за шириной скрола, а также предоставлет ее
export class DefaultScrollBarWidthWatcher {
	private _div: HTMLElement;
	private _watchTimer: number;
	private _oldWidth: number;

	private constructor() {
		this._watchTimer = null;
		this._div = null;
		//
		this.createInvisibleDiv();
		this._oldWidth = this.defaultScrollWidth;
		//
		this.createWatchDogTimer();
	}

	// singleton
	public static get instance() { return Instance.getOrCreate<DefaultScrollBarWidthWatcher>(DefaultScrollBarWidthWatcher, 'DefaultScrollBarWidthWatcher'); }

	// создает фиктивный элемент разметки
	private createInvisibleDiv() {
		if (this._div) return;
		//
		this._div = document.createElement('div');
		this._div.className = styles['measure-default-scroll'];
		//
		ApplicationNode.instance.element.appendChild(this._div);
	}

	// удаляет фиктивный элемент разметки
	private removeInvisibleDiv() {
		if (!this._div) return;
		//
		this._div.parentNode.removeChild(this._div);
		this._div = null;
	}

	// возвращает ширину скрола в элементе разметки
	public get defaultScrollWidth(): number {
		if (!this._div) return null;
		//
		const scrollbarWidth = (this._div.offsetWidth - this._div.clientWidth);
		return scrollbarWidth;
	}

	// следилка за размерами
	private createWatchDogTimer() {
		this._watchTimer = window.setInterval(() => {
				const newWidth = this.defaultScrollWidth;
				if (this._oldWidth != newWidth) {
					this._oldWidth = newWidth;
					DefaultScrollBarWidthWatcher.onChanged.emit();
				}
			},
			500);
	}

	// уничтожение таймера
	private disposeWatchDogTimer() {
		clearTimeout(this._watchTimer);
		this._watchTimer = null;
	}

	// если ширина скрола поменяется - полетит событие
	public static onChanged: DefaultScrollBarChangedEmitter = new EventEmitter<DefaultScrollBarChangedMessage>('defaultScrollBarWidthChanged');

	// очистка ресурсов
	public dispose() {
		this.disposeWatchDogTimer();
		this.removeInvisibleDiv();
	}
}
