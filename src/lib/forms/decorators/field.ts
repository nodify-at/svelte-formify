import '@abraham/reflection'
import type { ArraySchema, BaseSchema, ObjectSchema } from 'yup'
import { REFLECT_VALIDATION_KEY }                     from '../commons/constants'
import type { ObjectShape }                           from 'yup/lib/object'
import { object as yupObject }                                     from 'yup'

type Prototyped = { prototype: object }

export const Field = (schema: BaseSchema, objectType?: Prototyped) => (target: object, property: string): void => {

    const type = Reflect.getMetadata<{ prototype: object}>('design:type', target, property)

    if (!Reflect.hasMetadata(REFLECT_VALIDATION_KEY, target)) {
        Reflect.defineMetadata(REFLECT_VALIDATION_KEY, {}, target)
    }

    if (schema.type === 'object') {
        const prototype = type ? type.prototype : objectType?.prototype
        if (!prototype) {
            throw new Error('It seems like we can not emit decorator types, please pass the type as a second argument. e.g.: @Field<object(), MyClass>')
        }
        schema = (schema as ObjectSchema<ObjectShape>).shape(Reflect.getMetadata(REFLECT_VALIDATION_KEY, prototype) as never)
    }

    if (schema.type === 'array') {
        const prototype =  objectType?.prototype
        if (!prototype) {
            throw new Error('For the arrays, you must give the type explicitly!')
        }

        const current = Reflect.getMetadata(REFLECT_VALIDATION_KEY, prototype) as never
        schema = (schema as ArraySchema<never>).of(yupObject().shape(current))
    }
    const metadata = Reflect.getMetadata(REFLECT_VALIDATION_KEY, target)
    metadata[property] = schema
}
