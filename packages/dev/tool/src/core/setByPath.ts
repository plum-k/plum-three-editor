import {set} from "lodash-es";

export default function setByPath(object: any, name: string, value: unknown) {
    return set(object, name, value);
}

