import React from "react";
import styles from "./Loader.Circle.module.sass";

interface LoaderCircleProps {
    stroke?: string;		// цвет
}

interface CustomCSSLoader extends React.CSSProperties {
    ["--size"]?: string
    ["--color"]?: string
}

// те же константы есть и в SASS
const LOADER_RADIUS: number = 32;				// радиус окружности
const LOADER_WIDTH: number = 3;				// толщина окружности
const LOADER_STROKE: string = '#8e8e8e';			// цвет окружности

// лоадер - вращающаяся окружность
export class LoaderCircle extends React.PureComponent<LoaderCircleProps> {

    private get loaderCustomStyles(): CustomCSSLoader {
        const styles: CustomCSSLoader = {
            borderColor: `${this.props.stroke ?? LOADER_STROKE} transparent transparent transparent`,
            ["--color"]: `${this.props.stroke ?? LOADER_STROKE}`,
            ["--size"]: `${LOADER_WIDTH}px`,
        }
        return styles;
    }

    render(): React.ReactNode {
        return (
            <div className={styles['global']}>
                <span
                    className={styles['line']}
                    style={this.loaderCustomStyles}
                >
                    <span style={this.loaderCustomStyles}/>
                    <span style={this.loaderCustomStyles}/>
                    <span style={this.loaderCustomStyles}/>
                    <span style={this.loaderCustomStyles}/>
                </span>
            </div>
        );
    }
}
