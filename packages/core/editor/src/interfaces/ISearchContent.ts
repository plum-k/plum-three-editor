export default interface ISearchContent<T> {
    id: string;
    score: number;
    sortValues: [];
    content: T;
    highlightFields: { [V in keyof T]: Array<T[V]> };
}
