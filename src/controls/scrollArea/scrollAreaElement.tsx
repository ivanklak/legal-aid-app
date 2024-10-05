import React from 'react';
import {IScrollableComponent, IScrollableComponentProps} from "../../controls/common/scroll";
import {ScrollArea, ScrollAreaProps} from './scrollArea';


interface ScrollAreaElementProps extends IScrollableComponentProps, Omit<ScrollAreaProps, 'onViewPortChanged'> {
}

// обертка области прокручивания на освнове scrollArea
export class ScrollAreaElement extends React.PureComponent<ScrollAreaElementProps> implements IScrollableComponent {
	private readonly _ref: React.RefObject<ScrollArea>;

	constructor(props: ScrollAreaElementProps) {
		super(props);
		//
		this._ref = React.createRef();
		this.onViewPortChanged = this.onViewPortChanged.bind(this);
	}

	componentDidMount() {
		this.props.onMount?.(this.element);	// позвоним и скажем, что DOM готов
	}

	private onViewPortChanged() {
		this._ref.current && this.props.onViewPortChanged?.(this.element);
	}

	public get element() { return this._ref.current?.element; }

	public get scrollLeft() { return this.element?.scrollLeft; }
	public set scrollLeft(value: number) { this.element && (this.element.scrollLeft = value); }

	public get scrollTop() { return this.element?.scrollTop; }
	public set scrollTop(value: number) { this.element && (this.element.scrollTop = value); }

	public get scrollWidth() { return this.element?.scrollWidth; }
	public get scrollHeight() { return this.element?.scrollHeight; }

	public get clientWidth() { return this.element?.clientWidth; }
	public get clientHeight() { return this.element?.clientHeight; }

	render() {
		return (
			<ScrollArea
				{...this.props}
				//
				ref={this._ref}
				onViewPortChanged={this.onViewPortChanged}
				children={this.props.children}
			/>
		)
	}
}
