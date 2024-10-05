import React from "react";

// props для компонента, уменющего прокручиваться
export interface IScrollableComponentProps extends Omit<React.RefAttributes<HTMLElement>, 'ref'> {
	onViewPortChanged?(scrollable: HTMLElement, isScroll?: boolean): void;		// положение прокрутки изменилось
	onMount?(scrollable: HTMLElement): void;				// DOM элемент теперь есть
}
