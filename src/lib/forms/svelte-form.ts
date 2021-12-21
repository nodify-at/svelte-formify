import { Writable, writable }                                   from 'svelte/store'
import type { BaseSchema, ValidationError }                     from 'yup'
import { object }                                               from 'yup'
import { Utils }                                                from './commons/utils'
import { REFLECT_VALIDATION_KEY }                               from './commons/constants'
import type { Context, ExtendedObject, Prototyped, RecordType } from '$lib/forms/commons/generic-types'

export class SvelteForm<T> {

    readonly values: Writable<ExtendedObject<T, Context>>
    private readonly schema: BaseSchema<T>

    constructor(target: Prototyped<T>, initialValues?: T) {
        this.schema = createValidator(target)

        this.values = writable({} as ExtendedObject<T, Context>)
        this.values.update(() => this.fill(initialValues as unknown as ExtendedObject<T, Context>))
    }

    fill = (values: ExtendedObject<T, Context>, parents: string[] = []): ExtendedObject<T, Context> => {
        const item = {} as ExtendedObject<T, Context>
        Object.keys(values).forEach(key => {
            item[key] = {}
            if (typeof values[key] === 'object') {
                item[key] = this.fill(values[key], [key, ...parents])
            } else {
                item[key] = {
                    __context: true,
                    __key: parents.length ? `${parents.join('.')}.${key}` : key,
                    value: values[key]
                } as Context
            }
        })
        return item
    }

    handleBlur = async ({target}: { target: HTMLInputElement }): Promise<void> => {
        let error: ValidationError | undefined = undefined
        try {
            await this.schema.validateAt(target.name, this.rawValues, {recursive: true})
        } catch (e) {
            error = e
        } finally {
            this.values.update(value => {
                const current = Utils.get<ExtendedObject<T, Context>, Context>(value, target.name) as Context
                current.value = target.value
                current.touched = true
                current.dirty = false
                current.error = error
                return value
            })
        }
    }

    handleFocus = ({target}: { target: HTMLInputElement }): void => {
        this.values.update(value => {
            const current = Utils.get<ExtendedObject<T, Context>, Context>(value, target.name) as Context
            current.value = target.value
            current.error = undefined
            return value
        })
    }

    onInput = ({target}: { target: HTMLInputElement }): void => {
        this.values.update(value => {
            const current = Utils.get<ExtendedObject<T, Context>, Context>(value, target.name) as Context
            current.value = target.value
            current.dirty = true
            current.error = undefined
            return value
        })
    }

    get rawValues(): T {
        return this.getRawValues(this.updatedValues as any, {} as T)
    }

    private getRawValues(values: RecordType<T, Context>, actualObject: T): T {
        for (const key in values) {
            if (typeof values[key] == 'object') {
                if (values[key].__context) {
                    actualObject[key] = values[key].value
                } else {
                    actualObject[key] = {} as any
                    actualObject[key] = this.getRawValues(values[key], actualObject[key])
                }
            } else if (values[key] && values[key].value) {
                actualObject[key] = values[key].value
            }
        }
        return actualObject
    }

    private get updatedValues() {
        let val: ExtendedObject<T, Context>
        this.values.subscribe(current => val = current)()
        return val
    }
}

const createValidator = <T>(target: Prototyped<T>): BaseSchema<T> => {
    return object().shape({
        ...Reflect.getMetadata(REFLECT_VALIDATION_KEY, target.prototype)
    }) as unknown as BaseSchema<T>
}
