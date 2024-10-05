import {IScrollable} from "./IScrollable";
import {IScrollStabilizerElement, ScrollSnapshot, ScrollStabilizerOrientation} from "./ScrollSnapshot";

export type StabilizerParams = {
	scrollable: IScrollable,							// область прокрутки
	marginalCase: boolean,								// если скролл находился в начале или в конце - стоит ли его восстановить там же
	equalFunc?: (x: IScrollStabilizerElement, y: IScrollStabilizerElement) => boolean,	// проверка эквивалентности старых и новых значений, если ссылка не сохранена
}

// описание результата восстановления
type RestoreResultType = {
	restoredObjectCount: number;	// количество восстановленных объектов (не все в результате попадут во viewPort)
	marginalCase: boolean;			// восстановлено краевое положение скролла
	scrollChanged: boolean;			// изменена ли позиция скролла
};

// описание типа формулы расчета сдвига
type ShiftFormulaType =  (scrollTopShift: number) => number;
type ObjectShiftInfo = { oldPosition: number, newPosition: number };

// атрибут, который вещается на элемент и сообщает, что произошла стабилизация
export const STABILISED_ATTRIBUTE_NAME = 'stabilised';

// класс, позволяющий сдвигать скролл так, чтобы видимые элементы оставались на своих местах
export class ScrollStabilizer {

	// возвращает формулу расчета сдвига элемента
	private static getShiftFormula(info: ObjectShiftInfo): ShiftFormulaType {
		return (scrollTopShift: number) => info.newPosition - info.oldPosition - scrollTopShift;
	}

	// возвращает общее число сдвигов видимых элементов
	private static getTotalShift(itemShifts: ShiftFormulaType[], scrollTopShift: number): number {
		let retval = 0;
		//
		itemShifts.forEach(itemShift => {
			const shift = itemShift(scrollTopShift);
			retval += Math.abs(shift);
		});
		//
		return retval;
	}

	// восстанавливает сдвиг видимых элементов так, чтобы они по максимуму сохранили свое первоначальное значение на экране (двигаем скроол)
	// params - параметры видимой области
	// scrollableElements - новый перечень всех элементов (не только видимая область, вся область)
	// snapshot - слепок, который следует восстановить
	public static restore(params: StabilizerParams, scrollableElements: IScrollStabilizerElement[], snapshot: ScrollSnapshot): RestoreResultType {
		if (!params) throw new Error('ScrollStabilizer.restore: argument null exception');
		if (!params.scrollable) throw new Error('ScrollStabilizer.restore: scrollable control not set');
		if (!scrollableElements) throw new Error('ScrollStabilizer.restore: scrollableElements not set');
		if (!snapshot) throw new Error('ScrollStabilizer.restore: snapshot control not set');
		//
		const retval: RestoreResultType = { restoredObjectCount: null, marginalCase: false, scrollChanged: false };
		if (snapshot.viewPortElements.length == 0) {
			retval.restoredObjectCount = 0;
			return retval;
		}
		//
		// краевые случаи положений прокрутки
		if (params.marginalCase) {
			if (snapshot.orientation == ScrollStabilizerOrientation.vertical) {
				// особый случай - скролл был сверху
				if (snapshot.storedScrollPositionAtStart) {
					retval.marginalCase = true;
					retval.scrollChanged = (params.scrollable.scrollTop != 0);
					if (retval.scrollChanged) {
						if (params.scrollable instanceof HTMLElement) {
							params.scrollable.attributes.setNamedItem(document.createAttribute(STABILISED_ATTRIBUTE_NAME));
						}
						params.scrollable.scrollTop = 0;
					}
					return retval;
				}
				// особый случай - скролл был снизу
				if (snapshot.storedScrollPositionAtEnd) {
					retval.marginalCase = true;
					retval.scrollChanged = (params.scrollable.scrollTop != params.scrollable.scrollHeight - params.scrollable.clientHeight);
					if (retval.scrollChanged) {
						if (params.scrollable instanceof HTMLElement) {
							params.scrollable.attributes.setNamedItem(document.createAttribute(STABILISED_ATTRIBUTE_NAME));
						}
						params.scrollable.scrollTop = params.scrollable.scrollHeight - params.scrollable.clientHeight;
					}
					return retval;
				}
			} else if (snapshot.orientation == ScrollStabilizerOrientation.horizontal) {
				// особый случай - скролл был слева
				if (snapshot.storedScrollPositionAtStart) {
					retval.marginalCase = true;
					retval.scrollChanged = (params.scrollable.scrollLeft != 0);
					if (retval.scrollChanged) {
						if (params.scrollable instanceof HTMLElement) {
							params.scrollable.attributes.setNamedItem(document.createAttribute(STABILISED_ATTRIBUTE_NAME));
						}
						params.scrollable.scrollLeft = 0;
					}
					return retval;
				}
				// особый случай - скролл был справа
				if (snapshot.storedScrollPositionAtEnd) {
					retval.marginalCase = true;
					retval.scrollChanged = (params.scrollable.scrollLeft != params.scrollable.scrollWidth - params.scrollable.clientWidth);
					if (retval.scrollChanged) {
						if (params.scrollable instanceof HTMLElement) {
							params.scrollable.attributes.setNamedItem(document.createAttribute(STABILISED_ATTRIBUTE_NAME));
						}
						params.scrollable.scrollLeft = params.scrollable.scrollWidth - params.scrollable.clientWidth;
					}
					return retval;
				}
			}
		}
		//
		// изменения произошли, после чего ранее сохраненные элементы могут исчезнуть или быть сильно раскинутыми по области скрола
		// отберем те объекты, которые сохранились
		// и найдем пограничные коортидинаты
		let objects: ObjectShiftInfo[] = [];
		let minPosition: number = null;
		let maxPosition: number = null;
		let mapOfObjects = new Map<any, IScrollStabilizerElement>();	// <object, ListItem>
		if (!params.equalFunc) {
			// сохраним линейный список новых ссылок на объекты
			// он нужен для обназначного сопоставления старго и нового объектов
			for (let i = 0; i < scrollableElements.length; i++) {
				const item = scrollableElements[i];
				if (mapOfObjects.has(item.object)) {
					// контроль дублирования
					console.error('ScrollStabilizer.restore: list has some reference duplicates. Stabilization impossible!', item);
					mapOfObjects.forEach((v,k) => console.log('ScrollStabilizer.restore map-value', v));
					return retval;
				} else mapOfObjects.set(item.object, item);
			}
		}
		//
		snapshot.viewPortElements.forEach(oldElement => {
			if (!oldElement) return;
			//
			let newElement: IScrollStabilizerElement;
			if (!params.equalFunc) {
				// быстро получаем по ссылке
				newElement = mapOfObjects.get(oldElement.original.object);
			} else {
				// получаем по функции сравнения (дольше)
				newElement = scrollableElements.find(x => params.equalFunc(x, oldElement.original));
				if (newElement) {
					// осуществим контроль дублирования
					if (mapOfObjects.has(newElement)) {
						console.error('ScrollStabilizer.restore: equalFunc returns duplicates. Stabilization impossible!', newElement);
						mapOfObjects.forEach((v,k) => console.log('ScrollStabilizer.restore map-value', v));
						return retval;
					} else mapOfObjects.set(newElement, newElement);
				}
			}
			if (!newElement) return; // нет больше его
			//
			objects.push({oldPosition: oldElement.position, newPosition: newElement.position });
			if (minPosition == null || newElement.position < minPosition) minPosition = newElement.position;
			if (maxPosition == null || newElement.position > maxPosition) maxPosition = newElement.position;
		});
		mapOfObjects.clear();
		mapOfObjects = null;
		//
		if (objects.length == 0) {
			// ничего не сохранилось
			retval.restoredObjectCount = 0;
			return retval;
		}
		//
		// начиная с минимальной координаты поделим всю область скрола на viewPortHeight/viewPortWidth без пересечений
		// и найдем все объекты, которые туда попадают для того, чтобы отбросить часть объектов, которые слишком далеко отдалились (вышли за пределы видимости)
		let targetObjects: ObjectShiftInfo[] = [];
		let targetScrollPosition: number;	// начало области, в которой наибольшее количество объектов
		let viewPortLength: number = null;
		//
		targetScrollPosition = snapshot.storedScrollPosition;
		if (snapshot.orientation == ScrollStabilizerOrientation.vertical) {
			viewPortLength = params.scrollable.clientHeight;
		} else if (snapshot.orientation == ScrollStabilizerOrientation.horizontal) {
			viewPortLength = params.scrollable.clientWidth;
		}
		//
		if (viewPortLength > 0) {
			for (let i = minPosition; i <= maxPosition; i += viewPortLength) {
				// найдем все, что попало по координатам от i до i + viewPortHeight
				const endOfViewPort = i + viewPortLength;
				const viewPortObjects: ObjectShiftInfo[] = objects.filter(info => info.newPosition >= i && info.newPosition <= endOfViewPort);
				//
				if (viewPortObjects.length > targetObjects.length) {	// этот вариант предпочтительней
					targetObjects = viewPortObjects;
					targetScrollPosition = i;
				}
			}
		}
		objects = null;
		//
		// теперь очевидно, что targetObjects содержит наибольшее количество объектов, которые влезут во viewPort
		// также ясно, что уже двигаем сколл в targetScrollPosition
		// выясним как сдвинуть сколл так, чтобы был минимален общий сдвиг
		let itemShifts: ShiftFormulaType[] = [];
		let minShift0: number = null;
		let maxShift0: number = null;
		// когда выбрали новую область viewPort, уже подразумеваем сдвиг к ней
		const shift: number = targetScrollPosition - snapshot.storedScrollPosition;
		//
		targetObjects.forEach(info => {
			const shiftFormula = ScrollStabilizer.getShiftFormula(info);
			itemShifts.push(shiftFormula);
			//
			const shift0 = shiftFormula(shift);
			if (minShift0 === null || minShift0 > shift0) minShift0 = shift0;
			if (maxShift0 === null || maxShift0 < shift0) maxShift0 = shift0;
		});
		retval.restoredObjectCount = itemShifts.length;	// equals with targetObjects.length
		targetObjects = null;
		//
		if (itemShifts.length == 0 || minShift0 === null || maxShift0 === null) {
			// нечего двигать
			return retval;
		}
		//
		// найдем позицию при которой все элементы съедут минимально с первоначальной позиции
		let bestShift: number = 0;
		let totalShift: number = null;
		for (let shift = minShift0; shift <= maxShift0; shift++) {
			const tmp = ScrollStabilizer.getTotalShift(itemShifts, shift);
			if (totalShift === null || Math.abs(totalShift) > Math.abs(tmp)) {
				bestShift = shift;
				totalShift = tmp;
			}
		}
		itemShifts = null;
		//
		const newScrollPosition = targetScrollPosition + bestShift;
		if (snapshot.orientation == ScrollStabilizerOrientation.vertical) {
			if (params.scrollable.scrollTop != newScrollPosition) {
				if (params.scrollable instanceof HTMLElement) {
					params.scrollable.attributes.setNamedItem(document.createAttribute(STABILISED_ATTRIBUTE_NAME));
				}
				params.scrollable.scrollTop = newScrollPosition;
				retval.scrollChanged = true;
			}
		} else if (snapshot.orientation == ScrollStabilizerOrientation.horizontal) {
			if (params.scrollable.scrollLeft != newScrollPosition) {
				if (params.scrollable instanceof HTMLElement) {
					params.scrollable.attributes.setNamedItem(document.createAttribute(STABILISED_ATTRIBUTE_NAME));
				}
				params.scrollable.scrollLeft = newScrollPosition;
				retval.scrollChanged = true;
			}
		}
		//
		return retval;
	}
}
