<script lang="ts">
    import { SvelteForm }   from './forms/svelte-form'
    import type { Context } from '$lib/forms/commons/generic-types'

    export let form: SvelteForm<Record<string, unknown>>
    export let classes: string
    export let property: Context
    export let name: string
    export let placeholder: string
    export let disabled: 'disabled' | undefined
    export let inputType = 'text'
</script>

<input id={ name }
       name={ name }
       class={classes}
       type={ inputType }
       disabled={disabled}
       class:error={property.error && (property.dirty || property.touched)}
       on:blur={form.handleBlur}
       on:focus={form.handleFocus}
       on:input={form.onInput}
       value={property.value}
       placeholder={placeholder} />
