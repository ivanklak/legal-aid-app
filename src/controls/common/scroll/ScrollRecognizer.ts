import {domUtils} from "../../../core/utils/domUtils";
import {memoUtils} from "../../../core/utils";

const ATTR_HORIZONTAL = 'has-scroll-horizontal';
const ATTR_VERTICAL = 'has-scroll-vertical';

// особые props по которым можно будет найти целевой скролл в DOM
export interface IScrollableRecognizerProps {
	'has-scroll-horizontal'?: boolean;	// определяет наличие горизонтального скролла
	'has-scroll-vertical'?: boolean;	// определяет наличие вертикального скролла
}

// методы маркировки области прокрутки
export namespace ScrollRecognizer {

	// проверяет: является ли DOM элемент маркированным как прокручиваемой область с заданными характеристиками прокручиваемости
	export function isScroll(element: HTMLElement, hasHorizontalScroll: boolean, hasVerticalScroll: boolean): boolean {
		if (!element) return false;
		// проверка маркера горизонтальной прокрутки
		const h = element.getAttribute(ATTR_HORIZONTAL);
		if (hasHorizontalScroll != null && h != hasHorizontalScroll.toString()) return false;
		// проверка маркера вертикальной прокрутки
		const v = element.getAttribute(ATTR_VERTICAL);
		if (hasVerticalScroll != null && v != hasVerticalScroll.toString()) return false;
		// важно просто наличие маркеров
		return (h != null || v != null);
	}

	// маркер горизонтального скролла
	export function hasHorizontalScroll(element: HTMLElement): boolean {
		return element?.getAttribute(ATTR_HORIZONTAL) == 'true';
	}

	// маркер вертикального скролла
	export function hasVerticalScroll(element: HTMLElement): boolean {
		return element?.getAttribute(ATTR_VERTICAL) == 'true';
	}

	const attributeMaker = memoUtils.memoizeOne((hasHorizontal, hasVertical) => {
		if (hasHorizontal == null && hasVertical == null)
			return null;
		else if (hasHorizontal == null && hasVertical != null)
			return {
				'has-scroll-vertical': hasVertical.toString(),
			}
		else if (hasHorizontal != null && hasVertical == null)
			return {
				'has-scroll-horizontal': hasHorizontal.toString(),
			}
		else return {
				'has-scroll-horizontal': hasHorizontal.toString(),
				'has-scroll-vertical': hasVertical.toString(),
			};
	});
	// создание атрибутов прокрутки
	export function makeAttributes(hasHorizontal: boolean, hasVertical: boolean) {
		return attributeMaker(hasHorizontal, hasVertical);
	}
	// создание атрибутов прокрутки
	export function makeAttributesByProps(props: IScrollableRecognizerProps) {
		return attributeMaker(props["has-scroll-horizontal"], props["has-scroll-vertical"]);
	}

	// возвращает прокручиваемую область с характеристиками
	export function findParentScrollable(element: HTMLElement, hasHorizontalScroll: boolean, hasVerticalScroll: boolean) {
		return domUtils.findElement(
			element,
			false,
			tmp => isScroll(tmp, hasHorizontalScroll, hasVerticalScroll)
		);
	}
}
