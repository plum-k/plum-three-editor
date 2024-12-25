import Sort from "./Sort";
import Tag from "./Tag";

interface NextAndLase {
    title: string,
    id: number
}

export default interface Article {
    img: string,
    id: number,
    title: string,
    digest: string,
    gmtCreate: string,
    text: string,
    pv: number,
    sort: Sort,
    tags: Array<Tag>,
    last: NextAndLase,
    next: NextAndLase,
    commentNum: number
}
