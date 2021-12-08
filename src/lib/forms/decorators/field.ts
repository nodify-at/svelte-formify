import 'reflect-metadata'
import type { BaseSchema, ObjectSchema } from 'yup'
import { REFLECT_VALIDATION_KEY }        from '../commons/constants'
import type { ObjectShape }              from 'yup/lib/object'


export const Field = (schema: BaseSchema) => (target: Record<string, unknown>, property: string): void => {
    const type = Reflect.getMetadata('design:type', target, property)
    if (!Reflect.hasMetadata(REFLECT_VALIDATION_KEY, target)) {
        Reflect.defineMetadata(REFLECT_VALIDATION_KEY, {}, target)
    }

    if (schema.type === 'object') {
        schema = (schema as ObjectSchema<ObjectShape>).shape(Reflect.getMetadata(REFLECT_VALIDATION_KEY, type.prototype))
    }

    const metadata = Reflect.getMetadata(REFLECT_VALIDATION_KEY, target)
    metadata[property] = schema
}