import React from "react";

// описатель DOM-атрибутов в виде props
interface RootProps<T> extends React.HTMLAttributes<T>, React.RefAttributes<T> {};

// props базового элемента разметки, за основу берем <div/>
export interface RootComponentProps extends RootProps<HTMLDivElement> {};

// простая реализация метода обогащения
export const EnrichPropsEmpty = (props: RootComponentProps) => props;

// описание метода enrichProps для пробрасывания в компоненты
export type EnrichPropsMethod = (props: RootComponentProps) => RootComponentProps;
