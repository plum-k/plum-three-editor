import {ParsedUrlQuery} from "querystring";

export default interface IPageQuery extends ParsedUrlQuery {
    page: string,
    size: string,
}
