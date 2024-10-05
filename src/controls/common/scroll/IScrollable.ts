// любая область прокрутки должна содержать следующие свойства
export interface IScrollable {
	scrollLeft: number;
	scrollTop: number;
	readonly scrollWidth: number;
	readonly scrollHeight: number;
	readonly clientWidth: number;
	readonly clientHeight: number;
}
