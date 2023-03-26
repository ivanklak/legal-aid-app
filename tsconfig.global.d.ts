// Для нового синтаксиса импорта стилей вида: import styles from './MobileApp.variables.scss';
declare module '*.variables.scss' {
    const content: { [key: string]: string };
    export default content;
}
// Для нового синтаксиса импорта стилей вида: import styles from './MobileApp.module.sass';
declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
}

// Для нового синтаксиса импорта стилей вида: import styles from './MobileApp.module.sass';
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

// Для импорта svg как модуля
declare module '*.svg' {
    export default class extends React.Component<{
        key?: React.Key;
        ref?: React.LegacyRef<React.ReactSVGElement>;

        // Attributes which also defined in HTMLAttributes
        // See comment in SVGDOMPropertyConfig.js
        className?: string;
        color?: string;
        height?: number | string;
        id?: string;
        lang?: string;
        max?: number | string;
        media?: string;
        method?: string;
        min?: number | string;
        name?: string;
        style?: React.CSSProperties;
        target?: string;
        type?: string;
        width?: number | string;

        // Other HTML properties supported by SVG items in browsers
        role?: string;
        tabIndex?: number;

        // Focus Events
        onFocus?: React.FocusEventHandler<SVGElement>;
        onFocusCapture?: React.FocusEventHandler<SVGElement>;
        onBlur?: React.FocusEventHandler<SVGElement>;
        onBlurCapture?: React.FocusEventHandler<SVGElement>;

        // Keyboard Events
        onKeyDown?: React.KeyboardEventHandler<SVGElement>;
        onKeyDownCapture?: React.KeyboardEventHandler<SVGElement>;
        onKeyPress?: React.KeyboardEventHandler<SVGElement>;
        onKeyPressCapture?: React.KeyboardEventHandler<SVGElement>;
        onKeyUp?: React.KeyboardEventHandler<SVGElement>;
        onKeyUpCapture?: React.KeyboardEventHandler<SVGElement>;

        // MouseEvents
        onClick?: React.MouseEventHandler<SVGElement>;
        onClickCapture?: React.MouseEventHandler<SVGElement>;
        onContextMenu?: React.MouseEventHandler<SVGElement>;
        onContextMenuCapture?: React.MouseEventHandler<SVGElement>;
        onDoubleClick?: React.MouseEventHandler<SVGElement>;
        onDoubleClickCapture?: React.MouseEventHandler<SVGElement>;
        onDrag?: React.DragEventHandler<SVGElement>;
        onDragCapture?: React.DragEventHandler<SVGElement>;
        onDragEnd?: React.DragEventHandler<SVGElement>;
        onDragEndCapture?: React.DragEventHandler<SVGElement>;
        onDragEnter?: React.DragEventHandler<SVGElement>;
        onDragEnterCapture?: React.DragEventHandler<SVGElement>;
        onDragExit?: React.DragEventHandler<SVGElement>;
        onDragExitCapture?: React.DragEventHandler<SVGElement>;
        onDragLeave?: React.DragEventHandler<SVGElement>;
        onDragLeaveCapture?: React.DragEventHandler<SVGElement>;
        onDragOver?: React.DragEventHandler<SVGElement>;
        onDragOverCapture?: React.DragEventHandler<SVGElement>;
        onDragStart?: React.DragEventHandler<SVGElement>;
        onDragStartCapture?: React.DragEventHandler<SVGElement>;
        onDrop?: React.DragEventHandler<SVGElement>;
        onDropCapture?: React.DragEventHandler<SVGElement>;
        onMouseDown?: React.MouseEventHandler<SVGElement>;
        onMouseDownCapture?: React.MouseEventHandler<SVGElement>;
        onMouseEnter?: React.MouseEventHandler<SVGElement>;
        onMouseLeave?: React.MouseEventHandler<SVGElement>;
        onMouseMove?: React.MouseEventHandler<SVGElement>;
        onMouseMoveCapture?: React.MouseEventHandler<SVGElement>;
        onMouseOut?: React.MouseEventHandler<SVGElement>;
        onMouseOutCapture?: React.MouseEventHandler<SVGElement>;
        onMouseOver?: React.MouseEventHandler<SVGElement>;
        onMouseOverCapture?: React.MouseEventHandler<SVGElement>;
        onMouseUp?: React.MouseEventHandler<SVGElement>;
        onMouseUpCapture?: React.MouseEventHandler<SVGElement>;

        // Touch Events
        onTouchCancel?: React.TouchEventHandler<SVGElement>;
        onTouchCancelCapture?: React.TouchEventHandler<SVGElement>;
        onTouchEnd?: React.TouchEventHandler<SVGElement>;
        onTouchEndCapture?: React.TouchEventHandler<SVGElement>;
        onTouchMove?: React.TouchEventHandler<SVGElement>;
        onTouchMoveCapture?: React.TouchEventHandler<SVGElement>;
        onTouchStart?: React.TouchEventHandler<SVGElement>;
        onTouchStartCapture?: React.TouchEventHandler<SVGElement>;

        // Pointer Events
        onPointerDown?: React.PointerEventHandler<SVGElement>;
        onPointerDownCapture?: React.PointerEventHandler<SVGElement>;
        onPointerMove?: React.PointerEventHandler<SVGElement>;
        onPointerMoveCapture?: React.PointerEventHandler<SVGElement>;
        onPointerUp?: React.PointerEventHandler<SVGElement>;
        onPointerUpCapture?: React.PointerEventHandler<SVGElement>;
        onPointerCancel?: React.PointerEventHandler<SVGElement>;
        onPointerCancelCapture?: React.PointerEventHandler<SVGElement>;
        onPointerEnter?: React.PointerEventHandler<SVGElement>;
        onPointerEnterCapture?: React.PointerEventHandler<SVGElement>;
        onPointerLeave?: React.PointerEventHandler<SVGElement>;
        onPointerLeaveCapture?: React.PointerEventHandler<SVGElement>;
        onPointerOver?: React.PointerEventHandler<SVGElement>;
        onPointerOverCapture?: React.PointerEventHandler<SVGElement>;
        onPointerOut?: React.PointerEventHandler<SVGElement>;
        onPointerOutCapture?: React.PointerEventHandler<SVGElement>;
        onGotPointerCapture?: React.PointerEventHandler<SVGElement>;
        onGotPointerCaptureCapture?: React.PointerEventHandler<SVGElement>;
        onLostPointerCapture?: React.PointerEventHandler<SVGElement>;
        onLostPointerCaptureCapture?: React.PointerEventHandler<SVGElement>;

        // UI Events
        onScroll?: React.UIEventHandler<SVGElement>;
        onScrollCapture?: React.UIEventHandler<SVGElement>;

        // Wheel Events
        onWheel?: React.WheelEventHandler<SVGElement>;
        onWheelCapture?: React.WheelEventHandler<SVGElement>;

        // Animation Events
        onAnimationStart?: React.AnimationEventHandler<SVGElement>;
        onAnimationStartCapture?: React.AnimationEventHandler<SVGElement>;
        onAnimationEnd?: React.AnimationEventHandler<SVGElement>;
        onAnimationEndCapture?: React.AnimationEventHandler<SVGElement>;
        onAnimationIteration?: React.AnimationEventHandler<SVGElement>;
        onAnimationIterationCapture?: React.AnimationEventHandler<SVGElement>;

        // Transition Events
        onTransitionEnd?: React.TransitionEventHandler<SVGElement>;
        onTransitionEndCapture?: React.TransitionEventHandler<SVGElement>;
    }, any> {
    }
}
