export enum InputSize {
    Small,
    Medium,
    Large
}

export enum InputSlotPosition {
    Left,
    RightBefore,
    Right
}

export interface InputSlotCompProps {
    position: InputSlotPosition;
    size: InputSize;
    disabled?: boolean;
}

export type InputSlotComp = (slotData: InputSlotCompProps) => JSX.Element;