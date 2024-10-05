import React, {CSSProperties} from "react";
import {Property} from "csstype";

// описание всех свойств CSS
export interface WidgetStyle {
	margin?: Property.Margin;
	marginLeft?: Property.MarginLeft;
	marginRight?: Property.MarginRight;
	marginTop?: Property.MarginTop;
	marginBottom?: Property.MarginBottom;

	padding?: Property.Padding;
	paddingLeft?: Property.PaddingLeft;
	paddingRight?: Property.PaddingRight;
	paddingTop?: Property.PaddingTop;
	paddingBottom?: Property.PaddingBottom;


	gap?: Property.Gap;
	//
	color?: Property.Color;
	backgroundColor?: Property.BackgroundColor;
	//
	display?: Property.Display;
	position?: Property.Position;
	//
	flex?: Property.Flex;
	flexFlow?: Property.FlexFlow;
	alignItems?: Property.AlignItems;
	//
	height?: Property.Height;
	width?: Property.Width;
	minWidth?: Property.Width;
	maxWidth?: Property.Width;
	//
	borderRadius?: Property.BorderRadius
	boxShadow?: Property.BoxShadow;
	overflow?: Property.Overflow;
	transform?: Property.Transform;
	//
	boxSizing?: Property.BoxSizing;
}

export namespace WidgetStyle {

	// установка стилей в dom-элементе
	export function setElementStyle(element: HTMLElement, s: React.CSSProperties): void {
		for (let key in s) {
			// @ts-ignore
			const val = s[key];
			// @ts-ignore
			if (val) element.style[key] = val;
		}
	}

	// разделяет стили для два - внешнее и внутреннее оформление
	export function separateStyleForScrollArea(style: React.CSSProperties) {
		const innerStyleKeys:(keyof WidgetStyle)[] = ['display', 'gap', 'flexFlow', 'padding', 'boxSizing'];
		let innerStyle: CSSProperties = null;
		let outerStyle: CSSProperties = null;
		if (style) {
			innerStyle = {};
			outerStyle = {};
			for (let key in style) {
				// @ts-ignore
				const v = style[key];
				if (!v) continue;
				// @ts-ignore
				if (innerStyleKeys.includes(key)) {
					// @ts-ignore
					innerStyle[key] = v;
				} else {
					// @ts-ignore
					outerStyle[key] = v;
				}
			}
		}
		//
		return {
			innerStyle: innerStyle,
			outerStyle: outerStyle,
		}
	}
}
