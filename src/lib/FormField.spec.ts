import {fireEvent, render, waitFor} from "@testing-library/svelte";
import {Context, FormField, SvelteForm} from "./index";
import {Test} from "./__test__/test.models";
import type {ExtendedObject} from "./forms/commons/generic-types";

describe('FormField',  () => {
    let form: SvelteForm<Test>
    let test: ExtendedObject<Test, Context>

    const isValid = () => {
        let isValid = false
        form.isValid.subscribe(current => isValid = current)
        return isValid
    }

    beforeEach(function () {
        form = new SvelteForm<Test>(Test, Test.defaults)
        form.values.subscribe(current => test = current)()
    });

    it('should render an input field and change the value on input', async () => {
        const rendered = render(FormField, {property: test.name, form, classes: 'rounded', placeholder: 'test-input', disabled: undefined})
        const input = rendered.container.querySelector('input')

        await fireEvent.input(input, {target: {value: 'test-changed', name: input.name}})
        expect(form.rawValues.name).toEqual('test-changed')
        expect(isValid()).toBeFalsy() // we didn't render all values
    })

    it('should be dirty if user types', async () => {
        const rendered = render(FormField, {property: test.name, form, classes: 'rounded', placeholder: 'test-input', disabled: undefined})
        const input = rendered.container.querySelector('input')

        expect(test.name.dirty).toBeFalsy()

        await fireEvent.input(input, {target: {value: 'test-changed', name: input.name}})
        expect(test.name.dirty).toBeTruthy()
    })

    it('should be touched on blur', async () => {
        const rendered = render(FormField, {property: test.name, form, classes: 'rounded', placeholder: 'test-input', disabled: undefined})
        const input = rendered.container.querySelector('input')

        expect(test.name.touched).toBeFalsy()

        await waitFor(() => fireEvent.blur(input), { container: rendered.container })
        expect(test.name.touched).toBeTruthy()
    })

    it('should clear all errors on focus', async () => {
        const rendered = render(FormField, {property: test.name, form, classes: 'rounded', placeholder: 'test-input', disabled: undefined})
        const input = rendered.container.querySelector('input')

        expect(test.name.error).toBeUndefined()

        await waitFor(() => fireEvent.blur(input), { container: rendered.container })
        expect(test.name.error).toBeDefined()


        await waitFor(() => fireEvent.focus(input), { container: rendered.container })
        expect(test.name.error).toBeUndefined()
        expect(test.name.dirty).toBeFalsy()
        expect(test.name.touched).toBeTruthy()
    })

})
