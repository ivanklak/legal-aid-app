import React, {ComponentType} from "react";
import classNames from "classnames";
import {InputSize, InputSlotPosition} from '../InputTypes';
import {InputSvgSlotProps} from './SlotComponentType';
import css from './SlotComponent.module.sass';

const styleModifyBySize: Record<InputSize, string> = {
	[InputSize.Small]: css.svgSlot_small,
	[InputSize.Medium]: css.svgSlot_medium,
	[InputSize.Large]: css.svgSlot_large,
}

const styleModifyByPosition: Record<InputSlotPosition, string> = {
	[InputSlotPosition.Left]: css.svgSlot_left,
	[InputSlotPosition.RightBefore]: css.svgSlot_rightBefore,
	[InputSlotPosition.Right]: css.svgSlot_right,
}

export const createSvg = (Svg: ComponentType<{ [key: string]: unknown }>, globalClassName?: string): (val: InputSvgSlotProps) => JSX.Element => {
	return ({
		position,
		size,
		className,
		onClick
	}) => {
		const totalClassName = classNames(
			css['svgSlot'],
			!!onClick && css['svgSlot_interactive'],
			styleModifyBySize[size],
			styleModifyByPosition[position],
			globalClassName,
			className
		);

		return <Svg className={totalClassName} onClick={onClick} />;
	}
}
