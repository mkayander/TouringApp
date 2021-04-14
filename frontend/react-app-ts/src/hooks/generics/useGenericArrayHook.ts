import React, {useState} from "react";

export interface ArrayHook<Type> {
    state: Type[]

    setState: React.Dispatch<Type[]>

    isEmpty(): boolean

    isNotEmpty(): boolean;

    addItem(item: Type): void

    removeItem(item: Type): void

    getItem(index: number): Type | null

    lastItem(): Type | null

    middleItem(): Type | null
}

export function useGenericArrayHook<Type>(initialValue: Type[]): ArrayHook<Type> {
    const [state, setState] = useState(initialValue);
    const isEmpty = (): boolean => state.length === 0;
    const isNotEmpty = (): boolean => state.length > 0;

    const addItem = (item: Type) => {
        setState([...state, item]);
    };

    const removeItem = (item: Type) => {
        const newList = state.filter(value => value !== item);
        setState(newList);
    };

    const getItem = (index: number) => state.length > index ? state[index] : null;

    const lastItem = () => isNotEmpty() ? state[state.length - 1] : null;

    const middleItem = () => isNotEmpty() ? state[state.length / 2] : null;

    return {state, setState, isEmpty, isNotEmpty, addItem, removeItem, getItem, lastItem, middleItem};
}

// export type genericDataHookType = ReturnType<typeof genericDataHook>