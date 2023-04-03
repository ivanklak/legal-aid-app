import React, {HTMLAttributes} from 'react';
import classNames from "classnames";
import styles from './HorizontalScroll.module.sass';

export interface HorizontalScrollProps {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	onScroll?(): void;
	attrs?: HTMLAttributes<HTMLDivElement>;
}

export class HorizontalScroll extends React.PureComponent<HorizontalScrollProps> {
	readonly ref: React.RefObject<HTMLDivElement>;

	constructor(props: HorizontalScrollProps) {
		super(props);
		this.ref = React.createRef();
	}

	public get element(): HTMLDivElement {
		return this.ref.current;
	}

	render() {
		return  (
			<div
				ref={this.ref}
				className={classNames(
					styles.horizontal_overflow,
					this.props.className,
				)}
				style={this.props.style}
				children={this.props.children}
				onScroll={this.props.onScroll}
				{...this.props.attrs}
			/>
		);
	}
}
