import {uniqueId} from "lodash-es";

export function logStack(name: string = uniqueId()) {
    console.log(new Error(name).stack)
}