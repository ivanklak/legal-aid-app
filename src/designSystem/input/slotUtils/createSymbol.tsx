import React from "react";
import classNames from "classnames";
import {InputSlotComp, InputSize, InputSlotPosition} from "../InputTypes";
import css from './SlotComponent.module.sass';

const styleModifyBySize: Record<InputSize, string> = {
	[InputSize.Small]: css.symbolSlot_small,
	[InputSize.Medium]: css.symbolSlot_medium,
	[InputSize.Large]: css.symbolSlot_large,
}

const styleModifyByPosition: Record<InputSlotPosition, string> = {
	[InputSlotPosition.Left]: css.symbolSlot_left,
	[InputSlotPosition.RightBefore]: css.symbolSlot_rightBefore,
	[InputSlotPosition.Right]: css.symbolSlot_right,
}

export const createSymbol = (symbol: string): InputSlotComp => ({position, size}) => {
	const className = classNames(
		css.symbolSlot,
		styleModifyBySize[size],
		styleModifyByPosition[position],
	);

	return (
		<div className={className}>
			{symbol}
		</div>
	)
}
