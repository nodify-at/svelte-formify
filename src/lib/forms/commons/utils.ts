
export class Utils {

    static set<T>(object: T, path: string, value: string | number | boolean | Record<string, unknown>): T {
        const decomposedPath = path.split('.')
        const base = decomposedPath[0]

        if (base === undefined) {
            return object
        }

        if (!object) {
            return undefined
        }

        // assign an empty object in order to spread object
        object[base] = {}

        // Determine if there is still layers to traverse
        value = decomposedPath.length <= 1 ? value : Utils.set(object[base], decomposedPath.slice(1).join('.'), value)
        return {
            ...object,
            [base]: value
        }
    }

    static get<P, R>(data: P, path: string, defaultValue?: R): P | R {
        const value = path.split(/[.[\]]/).filter(Boolean).reduce((value, key) => (value as any)?.[key], data);
        return value ? value : defaultValue;
    }
}
