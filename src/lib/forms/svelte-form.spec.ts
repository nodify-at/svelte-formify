import {Context, SvelteForm} from "$lib";
import type {ExtendedObject} from "./commons/generic-types";
import {Test} from "../__test__/test.models";

describe('Svelte Form', () => {
    const form = new SvelteForm<Test>(Test, Test.defaults)
    let value: ExtendedObject<Test, Context>
    form.values.subscribe(current => value = current)

    it('should create a form', () => {
        form.onInput({target: {value: 'test', name: 'name'}} as never)
        expect(form.getRawValues().name).toEqual('test')
    })

    it('should notify changes', () => {
        let value: ExtendedObject<Test, Context>

        form.values.subscribe(current => value = current)
        form.onInput({target: {value: 'test', name: 'name'}} as never)

        expect(value.name.touched).toBeFalsy()
        expect(value.name.dirty).toBeTruthy()
        expect(value.name.value).toEqual('test')
    })

    it('should be touched on blur', async () => {
        await form.handleBlur({target: {name: 'name'}} as never)

        expect(value.name.touched).toBeTruthy()
        expect(value.name.dirty).toBeFalsy()
    })

    it('should clean error on focus', async () => {
        let value: ExtendedObject<Test, Context>

        form.values.subscribe(current => value = current)

        await form.handleBlur({target: {name: 'name'}} as never)
        expect(value.name.error).toBeDefined()

        await form.handleFocus({target: {name: 'name'}} as never)
        expect(value.name.error).toBeUndefined()
    })

    it('should have an error if the value is invalid', async () => {
        form.onInput({target: {value: 'test', name: 'role.identified'}} as never)
        await form.handleBlur({target: {name: 'role.identified'}} as never)

        expect(value.role.identified.error).toBeDefined()
    })

    it('should not have an error if the value is valid', async () => {
        form.onInput({target: {value: '0', name: 'role.identified'}} as never)
        await form.handleBlur({target: {name: 'role.identified'}} as never)
        expect(value.role.identified.error).toBeUndefined()
    })

    it('should not have an error if the value is valid in the array', async () => {
        const item = form.fill({name: undefined, role: {identified: 1}, roles: [{ identified: 2 }]})
        form.values.set(item)

        form.  onInput({target: {value: '0', name: 'roles[0].identified'}} as never)
        await form.handleBlur({target: {name: 'roles[0].identified', value: '0'}} as never)

        expect(value.roles[0].identified.error).toBeUndefined()
        expect(form.getRawValues().roles[0].identified).toEqual('0')
    })

    it('should fill the default values', function () {
        const item = form.fill({name: 'test', role: {identified: 1}})
        expect(item.role.identified.value).toEqual(1)
        expect(item.name.value).toEqual('test')
    })

    it('should fill the values even if a field is undefined', function () {
        const item = form.fill({name: undefined, role: {identified: 1}})
        expect(item.role.identified.value).toEqual(1)
        expect(item.name).toBeDefined()
        expect(item.name.value).toEqual(undefined)
    })

    it('should fill the array values', function () {
        form.patch({name: undefined, role: {identified: 1}, roles: [{ identified: 2 }]})

        const values = form.getRawValues()
        expect(values.roles[0].identified).toEqual(2)
    })
})
