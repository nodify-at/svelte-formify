<script lang="ts">
    import { SvelteForm } from './forms/svelte-form'

    export let form: SvelteForm<Record<string, unknown>>
    export let classes: string
    export let hasError: boolean
    export let property: string | number | boolean
    export let name: string
    export let placeholder: string
    export let disabled: 'disabled' | undefined
    export let inputType = 'text'
</script>

<input id={ name }
       name={ name }
       class={classes}
       class:error={hasError}
       type={ inputType }
       disabled={disabled}
       on:blur={form.handleBlur}
       on:focus={form.handleFocus}
       value={property}
       on:input={form.onInput}
       placeholder={placeholder} />