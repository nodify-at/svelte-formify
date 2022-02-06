import {Field} from "$lib";
import {number, object, string} from "yup";

export class Role {
    @Field(number()) identified: number
}
export class Test {
    static readonly defaults = {name: '', role: { identified: 0 }}

    @Field(string().required()) name = ''
    @Field(object(), Role) role: Role = { identified: 0 }
}

