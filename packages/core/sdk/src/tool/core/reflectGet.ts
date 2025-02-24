export function reflectGet(object: any, name: string) {
    return Reflect.get(object, name);
}