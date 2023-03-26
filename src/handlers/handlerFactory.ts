/** Сигнатура функции возвращаемой функцией createHandleChange */
export type HandlerFn<TEntity extends {}> = {
	<TKey extends keyof TEntity>(key: TKey): (updateValue: TEntity[TKey]) => void;
	(updateValue: Partial<TEntity>): void;
};

type ChangeHandlerByKey<TEntity extends {}> =
	<TKey extends keyof TEntity>(key: TKey) => (updateValue: TEntity[TKey]) => void;

/**
 * Функция создания обработчика изменений
 * Позволяет использовать меморизированые персональные функции обработчик, так же иметься перегрузка
 * для изменения нескольких полей
 *
 * Пример:
 * 	private handleChange = createHandleChange<State>((updateValue) => {
 * 		this.setState(state => ({ ...state, ...updateValue }));
 * 	})
 * 	...
 * 	<Input
 * 		value={this.state.caption}
 * 		onChange={this.handleChange('caption')}
 * 	/>
 *
 * */
export const createHandleChange = <TEntity extends {}>(
	setFn: (updateValue: Partial<TEntity>) => void
): HandlerFn<TEntity> => {
	const memoBuffer: Record<string, ChangeHandlerByKey<TEntity>> = {};

	return (keyOrUpdateValue: string | Partial<TEntity>) => {
		if (typeof keyOrUpdateValue !== 'string') return setFn(keyOrUpdateValue as any);
		if (memoBuffer[keyOrUpdateValue]) return memoBuffer[keyOrUpdateValue];

		const keyHandler: any = (value: any) => setFn({[keyOrUpdateValue]: value} as Partial<TEntity>);
		memoBuffer[keyOrUpdateValue] = keyHandler;
		return keyHandler;
	};
};






