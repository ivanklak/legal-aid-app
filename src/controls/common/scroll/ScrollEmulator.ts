import React, {DOMAttributes} from 'react';
import {IDisposable} from "../../../core/types/IDisposable";
import {CallBack} from "../../../core/types/CallBack";
import {RuntimeError} from "../../../core/errors";
import {UseCounter} from "../../../core/UseCounter";
import {browserUtils} from "../../../core/utils/browserUtils";
import {domUtils} from "../../../core/utils/domUtils";
import {ScrollRecognizer} from "./ScrollRecognizer";
import {scrollUtils} from "./scrollUtils";
import {IScrollable} from "./IScrollable";

const SHIFT_TO_STOP_REPEATER = 2;	// смещение при котором повторитель скролла следует уже остановить

// механизм эмуляции прокрутки для областей, не относящихся к прокручиваемым
export class ScrollEmulator implements IDisposable {
	private static _map: Map<IScrollable, ScrollEmulator> = new Map<IScrollable, ScrollEmulator>();	// все сущности, одна - под скролируемую область
	//
	private _dispose: CallBack<void>;	// уничтожение всего
	public eventSubscribers: Partial<DOMAttributes<HTMLElement>>;	// необходимые подписки на целевой области, которая эмулирует сроллирование

	constructor(scrollable: HTMLElement) {
		// избегаем повторных эмуляторов для этой же области
		const instance = ScrollEmulator._map.get(scrollable);
		if (instance) {
			UseCounter.use(instance);
			return instance; // exists object
		}
		//
		this.disposePrivate = this.disposePrivate.bind(this);
		//
		//
		const hasVerticalScroll = ScrollRecognizer.hasVerticalScroll(scrollable);
		const hasHorizontalScroll = ScrollRecognizer.hasHorizontalScroll(scrollable);
		if (!hasVerticalScroll && !hasHorizontalScroll) throw new RuntimeError('ScrollEmulator: scrollable doesnt have scroll-markers');
		//
		const scrollMode = hasHorizontalScroll ? 'horizontal' : 'vertical';
		//
		//
		// wheel - эмулирует прокрутку в области, wheel породит scroll
		const onWheelOnTarget = (e: React.WheelEvent) => {
			scrollUtils.processWheel(scrollable, e.nativeEvent, scrollMode);
		};
		//
		//
		// также будем эмулировать scroll с помощью touch-событий
		let touchActive = false;			// палец держат
		let alwaysPrevent = false;			// следует считать событие обработанным
		let touchX = 0;						// координаты касания
		let touchY = 0;						// координаты касания
		let moveVelocity = 0;				// скорость пальца px/sec
		let moveTimeStamp: number = 0;		// предыдущее срабатывание сдвига
		let repeatInterval: number = null;	// указать повторите прокрутки
		let emulateScrollPosition: number = null;	// положение прокрутки эмуляции
		let horizontalHash: number = null;	// хэш всех горизонтальных прокруток
		//
		const stopRepeat = () => {
			window.clearInterval(repeatInterval);
			repeatInterval = null;
			emulateScrollPosition = null;
		};
		// чтобы остановить повторитель скролла
		const onScroll = (e: UIEvent) => {
			if (emulateScrollPosition == null) return; // повторителя нет
			//
			const value = hasHorizontalScroll ? scrollable.scrollLeft : scrollable.scrollTop;
			if (Math.abs(emulateScrollPosition - value) < SHIFT_TO_STOP_REPEATER) return; // это мы меняем (значения бывают и целые и дробные и дробные не совпадают и округление не спает и до целого тоже)
			// остановка повторителя - не мы меняем
			stopRepeat();
		};
		// чтобы зафиксировать факт прикосновения и остановить повторитель
		const onTouchStartOnTarget = (e: React.TouchEvent) => {
			stopRepeat();
			moveTimeStamp = Date.now();
			moveVelocity = 0;
			//
			const t = e.touches[0];
			//
			touchActive = true;
			alwaysPrevent = false;
			touchX = t.clientX;
			touchY = t.clientY;
			horizontalHash = domUtils.getAllHorizontalScrollsHash(e.target as HTMLElement);
		};
		// чтобы остановить прокрутку
		const onTouchStartOnScrollable = (e: TouchEvent) => {
			stopRepeat();
		};
		// чтобы запустить повторитель скролла
		const onTouchEnd = (e: TouchEvent) => {
			if (!touchActive) return;
			touchActive = false;
			//
			// если есть скорость - будем эмулировать её затухание
			const startTime = Date.now();
			const startValue = hasHorizontalScroll ? scrollable.scrollLeft : scrollable.scrollTop;
			//
			stopRepeat();	// на всякий случай, и так условие touchActive отсечет проблемы
			repeatInterval = window.setInterval(() => {
				const dTime = (Date.now() - startTime) / 1000;
				const dShift = Math.abs(moveVelocity) * dTime * Math.cos(dTime / (Math.PI / 2));	// организуем затузание
				//
				const value = hasHorizontalScroll ? scrollable.scrollLeft : scrollable.scrollTop;
				const newValue = startValue + dShift * Math.sign(-moveVelocity);
				if (
					moveVelocity < 0 && newValue <= value || moveVelocity > 0 && newValue >= value || // поехали не в ту сторону, переломный момент
					Math.abs(newValue - value) < SHIFT_TO_STOP_REPEATER ||	// смещение незначительно
					moveVelocity == 0	// нет скорости сдвига
				) {
					stopRepeat();
					return;
				}
				emulateScrollPosition = newValue;
				scrollUtils.setScrollPosition(scrollable, newValue, scrollMode);
			}, 20);
		};
		// чтобы сдвинуть скролл и вычислить скорость скролла
		const onTouchMove = (e: TouchEvent) => {
			if (!touchActive) return;
			const t = e.touches[0];
			//
			// все сдвиги
			const dx = t.clientX - touchX;
			const dy = t.clientY - touchY;
			touchX = t.clientX;
			touchY = t.clientY;
			//
			// вычисляем смещение
			const value = hasHorizontalScroll ? scrollable.scrollLeft : scrollable.scrollTop;
			const delta = hasHorizontalScroll ? dx : dy;
			//
			// вычисляем скорость сдвига
			const dt = (Date.now() - moveTimeStamp) / 1000;
			moveTimeStamp = Date.now();
			moveVelocity = delta / dt;
			//
			// обновление страницы, защита от активации эмуляции движения скролла (для хром)
			if (!alwaysPrevent && hasVerticalScroll && browserUtils.isMobileUserAgent() && scrollable.scrollTop == 0 && delta > 0) {
				touchActive = false;
				return;
			}
			// защита от блокировки других прокруток
			if (!alwaysPrevent && (
				hasVerticalScroll && Math.abs(dy) < Math.abs(dx) ||
				hasHorizontalScroll && Math.abs(dx) < Math.abs(dy) ||
				hasVerticalScroll && horizontalHash != domUtils.getAllHorizontalScrollsHash(e.target as HTMLElement))) {
				touchActive = false;
				return;
			}
			alwaysPrevent = true;
			//
			emulateScrollPosition = value - delta;
			if (scrollUtils.setScrollPosition(scrollable, value - delta, scrollMode)) {
				if (e.cancelable) e.stopPropagation();
			}
			e.preventDefault(); // нужно для хром (предотвражение обновления страницы), сафари на это плюет
		};
		//
		// формируем подписки
		this.eventSubscribers = {
			onWheel: onWheelOnTarget,
			onTouchStart: onTouchStartOnTarget,
		};
		// а вот механизм движения следует прицепить к окну, чтобы работало preventDefault (и выключалась перезагрузка страницы)
		window.addEventListener('touchmove', onTouchMove, {passive: false});
		window.addEventListener('touchend', onTouchEnd);
		// чтобы была возможность остановить повторялку сдвига
		scrollable.addEventListener('touchstart', onTouchStartOnScrollable);
		scrollable.addEventListener('scroll', onScroll);
		//
		// формируем убивание эмулятора
		this._dispose = () => {
			// отцепляем события
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
			scrollable.removeEventListener('scroll', onScroll);
			scrollable.removeEventListener('touchstart', onTouchStartOnScrollable);
			// остальные отцепятся сами по воле react
			this.eventSubscribers = null;
			// забываем про этот экземпляр
			ScrollEmulator._map.delete(scrollable);
		};
		//
		// запоминаем, что экземпляр есть
		ScrollEmulator._map.set(scrollable, this);
		UseCounter.use(this);
	}

	// освободить ресурсы
	public dispose() {
		UseCounter.unUse(this, this.disposePrivate);
	}

	private disposePrivate() {
		this._dispose();
		this._dispose = null;
	}
}
