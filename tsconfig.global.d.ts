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