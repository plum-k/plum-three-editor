import {set} from "lodash-es";

export function setByPath(object: any, name: string, value: unknown) {
    return set(object, name, value);
}

