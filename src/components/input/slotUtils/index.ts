import {createSymbol} from './createSymbol';
import {createSvg} from './createSvg';

export type {InputSvgSlotProps} from './SlotComponentType';
// export {InputSlotDropDown, InputSlotDropDownProps} from './inputSlotDropDown';


export const inputSlotHelpers = {
    // Создать слот с символом для input-а
    createSymbol,
    // Создать слот с svg для input-а
    createSvg
};
