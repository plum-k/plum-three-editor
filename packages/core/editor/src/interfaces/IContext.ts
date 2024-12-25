import {IncomingMessage, ServerResponse} from "http";
import {ParsedUrlQuery} from "querystring";

export default interface IContext<Q> {
    req: IncomingMessage
    res: ServerResponse
    params?: Q
    query: ParsedUrlQuery
    preview?: boolean
    previewData?: any
}
