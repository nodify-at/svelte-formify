# svelte-formify
A library to manage and validate the forms. This library uses decorators to define validations.

#### This project is still under development, be careful if you decide to use on a production environment 

## Installation
```shell
npm i svelte-formify
```

## Components
This library provides 3 main core components:

* ``` @Field ``` to define properties and validations
* ``` SvelteForm ``` to manage form state, get errors and the validated input values
* ``` <FormField> ``` a simple input field to use and prevents boilerplate codes while create input fields

### @Field
Field decorator expects the declarations from `yup` library, you can nest any yup validation function while creating
a Field.

> Important: We must pass the Type explicitly for nested types. ESBuild does not support emitDecoratorMetadata yet.

#### Usage example:
```typescript
import { number, object, string } from 'yup'
import { Field }                  from 'svelte-formify'

export class Role {
    @Field(string().required().oneOf(['admin', 'test'])) name: string
}

export class User {
    @Field(string().required()) username: string
    @Field(string().required()) password: string
    @Field(string().required()) firstName: string
    @Field(string().required()) lastName: string
    @Field(object(), Role) role: Role // due to a restriction on ESBuild we can not emit decorator metadata for now, therefore we must pass the type for nested values explicitly
}
```

### SvelteForm
SvelteForm class encapsulates the validations, listens for input changes and updates the errors so you can
show validates states interactively to the user.

SvelteForm expect 2 parameters while constructing it.

1. target: class defines the validation properties
2. initialValues: initial values for this class

SvelteForm stores all data in a ```Context ``` class. A context contains the properties described as below:
* **error** : ValidationError thrown by yup validation
* **touched** true on blur otherwise false
* **dirty** if user is typing
* **value** the value typed by user

#### How get raw values
You can call `getRawValues` function if you need the raw values (e.g. : sending the form)

```typescript
const values = form.getRawValues()
```

#### Listening validation result
You can use `isValid` property which is a Writable to get validation status each time after user changes something.

Example: you want to enable/disable a button depends on validation status:

```sveltehtml
<script lang="ts">
    import { SvelteForm } from 'svelte-formify'
    import { User }       from './models/user' // your model classes

    const {isValid,...form} = new SvelteForm<User>(User, {
        firstName: '',
        lastName: '',
        password: '',
        role: {
            name: 'test'
        },
        username: 'hasan'
    })
</script>

<button disabled={!$isValid}>Login</button>
```


### General usage example
```html
<script lang="ts">
    import { SvelteForm } from 'svelte-formify'
    import { User }       from './models/user' // your model classes

    const {values,...form} = new SvelteForm<User>(User, {
        firstName: '',
        lastName: '',
        password: '',
        role: {
            name: 'test'
        },
        username: 'hasan'
    })

    // e.g. usage of listener to get username while user types 
    $: console.log($values.username.value) // returns the typed value
    $: console.log($values.username.error) // returns the error
    $: console.log($values.username.touched) // true after onBlur
    $: console.log($values.username.dirty) // true while user is typing
</script>

{#if $values.username.error }
    <small>show some error</small>
{/if}
<FormField form={form} property={$values.username} classes="w-full p-2" placeholder="Username *" />
<!-- e.g. nested object usage -->
<FormField form={form} property={$values.role.name} classes="w-full p-2" placeholder="Role *" />
```


