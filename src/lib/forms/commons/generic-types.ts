// see: https://stackoverflow.com/a/58436959
import type { ValidationError } from 'yup'

export type Prototyped<T> = { prototype: T }

export type ExtendedObject<T, V> = T extends object ? { [P in keyof T] : ExtendedObject<T[P], V> } :  V
export type RecordType<T, V> = Record<keyof T & keyof V, T>
export type Context = {
    __context: boolean;
    __key: string;
    error?: ValidationError
    touched?: boolean,
    dirty?: boolean,
    value: string | number | boolean | Record<string, unknown>
}

