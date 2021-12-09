# svelte-forms-validation
A library to manage and validate the forms. This library uses decorators to define validations.

#### This project is still under development, be careful if you decide to use on a production environment 

## Installation
```shell
npm i svelte-forms-validation
```

## Components
This library provides 3 main core components:

* ``` @Field ``` to define properties and validations
* ``` SvelteForm ``` to manage form state, get errors and the validated input values
* ``` <FormField> ``` a simple input field to use and prevents boilerplate codes while create input fields

### @Field
Field decorator expects the declarations from `yup` library, you can nest any yup validation function while creating
a Field.

#### Usage example:
```typescript
import { number, object, string } from 'yup'
import { Field }                  from 'svelte-forms-validation'

export class Role {
    @Field(string().required().oneOf(['admin', 'test'])) name: string
}

export class User {
    @Field(string().required()) username: string
    @Field(string().required()) password: string
    @Field(string().required()) firstName: string
    @Field(string().required()) lastName: string
}
```

### SvelteForm
SvelteForm class encapsulates the validations, listens for input changes and updates the errors so you can
show validates states interactively to the user.

SvelteForm expect 2 parameters while constructing it.

1. target: class defines the validation properties
2. initialValues: initial values for this class

#### Usage example
```html
<script lang="ts">
    import { SvelteForm } from 'svelte-forms-validation'
    import { User }       from './models/user'

    const {values, errors, ...form} = new SvelteForm<User>(User, {
        firstName: '',
        lastName: '',
        password: '',
        role: {
            name: 'test'
        },
        username: 'hasan'
    })

    // e.g. usage of listener to get username while user types 
    $: console.log($values.username)
    $: console.log($errors['role.name']) // supports dot notation
</script>

{#if $errors.username }
    <small>show some error</small>
{/if}
<FormField name="username" form={form} property={$values.username} classes="w-full p-2" placeholder="Username *" />
<!-- e.g. nested object usage -->
<FormField name="role.name" form={form} property={$values.role.name} classes="w-full p-2" placeholder="Role *" />
```


