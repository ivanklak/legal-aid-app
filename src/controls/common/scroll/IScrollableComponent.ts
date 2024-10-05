import React from "react";
import {IDOMElement} from "../IDOMElement";
import {IScrollable} from "./IScrollable";
import {IScrollableComponentProps} from "./IScrollableComponentProps";

// интерфейс компонента области прокрутки
// IDOMElement: правильно IScrollable, удобно Element, поскольку observe() работает только с типом Element, удобно обращаться к offsetTop/offsetLeft - поэтому HTMLElement
export interface IScrollableComponent extends React.Component<IScrollableComponentProps>, IScrollable, IDOMElement {
}
