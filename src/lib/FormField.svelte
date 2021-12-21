<script lang="ts">
    import { SvelteForm }   from './forms/svelte-form'
    import type { Context } from '$lib/forms/commons/generic-types'

    export let form: SvelteForm<Record<string, unknown>>
    export let classes: string
    export let property: Context
    export let placeholder: string
    export let disabled: 'disabled' | undefined
    export let inputType = 'text'
</script>

<input id={ property.__key }
       name={ property.__key }
       class={classes}
       type={ inputType }
       disabled={disabled}
       class:error={property.error && (property.dirty || property.touched)}
       on:blur={form.handleBlur}
       on:focus={form.handleFocus}
       on:input={form.onInput}
       value={property.value}
       placeholder={placeholder} />
