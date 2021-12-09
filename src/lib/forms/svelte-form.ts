import type { Writable }                     from 'svelte/store'
import { writable }                          from 'svelte/store'
import type { BaseSchema, ValidationError }  from 'yup'
import { object }                            from 'yup'
import { Utils }                             from './commons/utils'
import { REFLECT_VALIDATION_KEY }            from './commons/constants'
import type { KeysOfTransition, Prototyped } from '$lib/forms/commons/generic-types'


export class SvelteForm<T> {
    readonly values: Writable<T>
    readonly errors: Writable<KeysOfTransition<T, ValidationError>>

    private readonly schema: BaseSchema<T>

    constructor(target: Prototyped<T>, initialValues?: T) {
        this.schema = createValidator(target)
        this.values = writable(initialValues)
        this.errors = writable({} as KeysOfTransition<T, ValidationError>)
    }

    handleBlur = async ({ target }: { target: HTMLInputElement } ): Promise<void> => {
        try {
            await this.schema.validateAt(target.name, this.updatedValues, {recursive: true})
            this.errors.update(error => Utils.set(error, target.name, undefined))
        } catch (e) {
            this.errors.update(error => Utils.set(error, target.name, e))
        }
    }

    handleFocus = ({ target }: { target: HTMLInputElement }): void => this.errors.update(error => Utils.set(error, target.name, undefined)) // reset validation

    onInput = ({target}: { target: HTMLInputElement }): void => this.values.update(current => Utils.set(current, target.name, target.value))

    isValid = (): boolean => {
        const errors = this.errorsSync
        return Object.keys(errors).every(key => typeof errors[key] === 'undefined')
    }

    private get updatedValues() {
        let val
        this.values.subscribe(current => val = current)()
        return val
    }

    private get errorsSync() {
        let val
        this.errors.subscribe(current => val = current)()
        return val
    }
}

const createValidator = <T>(target: Prototyped<T>): BaseSchema<T> => {
    return object().shape({
        ...Reflect.getMetadata(REFLECT_VALIDATION_KEY, target.prototype)
    }) as unknown as BaseSchema<T>
}
