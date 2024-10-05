import {IScrollable} from "./IScrollable";
import {IDisposable} from "../../../core/types/IDisposable";

// элемент области прокрутки
export interface IScrollStabilizerElement<TObject = any> {
	position?: number;	// положение элемента в списке
	object: TObject;	// объект элемента списка
}

// клон элемента IScrollStabilizerElement в видимой области
interface IStoredScrollStabilizerElement {
	position: number;					// положение элемента в списке
	original: IScrollStabilizerElement;	// исходный элемент
}

// ориентация стабилизации
export enum ScrollStabilizerOrientation {
	horizontal = 'horizontal',
	vertical = 'vertical',
}

// сохраненные положения элементов списка
export class ScrollSnapshot implements IDisposable {
	private _orientation: ScrollStabilizerOrientation;		//  ориентация стабилизации
	private _viewPortElements: IStoredScrollStabilizerElement[];	// видимые элементы
	private _storedScrollPosition: number;					// положение прокрутки
	private _storedScrollPositionAtStart: boolean;			// прокрутка в начале
	private _storedScrollPositionAtEnd: boolean;			// прокрутка в конце

	private constructor(scrollable: IScrollable, orientation: ScrollStabilizerOrientation, viewPortElements: IScrollStabilizerElement[]) {
		// клонируем данные
		this._viewPortElements = viewPortElements.map(x => {
			return {
				position: x.position,
				original: x,
			}
		});
		//
		this._orientation = orientation;
		//
		this._storedScrollPosition = (orientation == ScrollStabilizerOrientation.vertical) ? scrollable.scrollTop : scrollable.scrollLeft;
		this._storedScrollPositionAtStart = (this._storedScrollPosition == 0);
		this._storedScrollPositionAtEnd = (orientation == ScrollStabilizerOrientation.vertical)
			? (scrollable.scrollTop == scrollable.scrollHeight - scrollable.clientHeight)
			: (scrollable.scrollLeft == scrollable.scrollWidth - scrollable.clientWidth);
	}

	public dispose() {
		this._orientation = null;
		this._viewPortElements = null;
		this._storedScrollPosition = null;
		this._storedScrollPositionAtStart = null;
		this._storedScrollPositionAtEnd = null;
	}

	// ориентация
	public get orientation() { return this._orientation; }
	// видимые элементы
	public get viewPortElements() { return this._viewPortElements; }
	// положение прокрутки
	public get storedScrollPosition() { return this._storedScrollPosition; }
	// прокрутка в начале
	public get storedScrollPositionAtStart() { return this._storedScrollPositionAtStart; }
	// прокрутка в конце
	public get storedScrollPositionAtEnd() { return this._storedScrollPositionAtEnd; }

	// создание слепка видимых объектов
	// запомнить коллекцию элементов, которые сейчас видны во viewPort
	// scrollable - где размещаются элементы
	// viewPortElements - элементы в видмой области
	public static create(scrollable: IScrollable, orientation: ScrollStabilizerOrientation, viewPortElements: IScrollStabilizerElement[]) {
		if (!scrollable) throw new Error('ScrollSnapshot.create: scrollable control not set');
		if (!orientation) throw new Error('ScrollSnapshot.create: orientation not set');
		if (!viewPortElements) throw new Error('ScrollSnapshot.create: viewPortElements not set');
		//
		return new ScrollSnapshot(scrollable, orientation, viewPortElements);
	}
}
