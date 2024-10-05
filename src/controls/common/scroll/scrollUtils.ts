import {IScrollable} from "./IScrollable";

// утилитки для скроллирования
export namespace scrollUtils {

	// получить смещение по событию wheel
	export function getWheelValue(e: WheelEvent, mode: 'horizontal' | 'vertical'): number {
		// не будем реагировать при нажатых кнопках (zoom, other features)
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return 0;
		//
		let retval = mode == 'horizontal' ? e.deltaX || e.deltaY : e.deltaY;
		// корректировка значения по скорости прокрутки
		if (e.deltaMode == WheelEvent.DOM_DELTA_PIXEL) retval *= 1;
		else if (e.deltaMode == WheelEvent.DOM_DELTA_LINE) retval *= 40;
		else if (e.deltaMode == WheelEvent.DOM_DELTA_PAGE) retval *= 800;
		//
		return retval;
	}

	// установка положения прокрутки
	export function setScrollPosition(scrollable: IScrollable, value: number, mode: 'horizontal' | 'vertical'): boolean {
		const isHorizontal = (mode == 'horizontal');
		//
		// определяем новое полоежение
		const minValue = 0;
		const maxValue = isHorizontal ? (scrollable.scrollWidth - scrollable.clientWidth) : (scrollable.scrollHeight - scrollable.clientHeight);
		const oldValue = isHorizontal ? scrollable.scrollLeft : scrollable.scrollTop;
		const newValue = Math.max(minValue, Math.min(maxValue, value));
		//
		if (oldValue != newValue) {
			// значение должно поменяться
			if (isHorizontal) scrollable.scrollLeft = newValue;
			else scrollable.scrollTop = newValue;
			//
			return true;
		}
		//
		return false;
	}

	// прокрутка колесиком (изменить положение скрола)
	export function processWheel(scrollable: IScrollable, e: WheelEvent, mode: 'horizontal' | 'vertical'): boolean {
		const delta = getWheelValue(e, mode);
		const isHorizontal = (mode == 'horizontal');
		const value = isHorizontal ? scrollable.scrollLeft : scrollable.scrollTop;
		//
		if (setScrollPosition(scrollable, value + delta, mode)) {
			if (e.cancelable) {
				e.stopImmediatePropagation();
				e.preventDefault();
			}
		}
		//
		return true;	// даже, если значение не изменилось - считаем, что обработали
	}
}
