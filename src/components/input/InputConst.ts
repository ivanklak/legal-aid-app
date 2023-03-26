import {InputSize} from './InputTypes';
import css from './Input.module.sass';

// Мап-а соотношения css классов-модификаторов к элементам InputSize
export const classNameModifyBySize: Record<InputSize, string> = {
	[InputSize.Large]: css['inputContainer_large'],
	[InputSize.Medium]: css['inputContainer_medium'],
	[InputSize.Small]: css['inputContainer_small'],
}
