import {IScrollable} from "./IScrollable";

// интерфейс описывает объект, содержащий элемент прокрутки (не обязательно DOMElement)
export interface IScrollableElement {
	readonly element: IScrollable;
}
