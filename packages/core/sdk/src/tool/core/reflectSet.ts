export function reflectSet(object: any, name: string, value: string) {
    return Reflect.set(object, name, value);
}
