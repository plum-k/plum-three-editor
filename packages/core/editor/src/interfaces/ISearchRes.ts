import ISearchContent from ".//ISearchContent";

export default interface ISearchRes<T> {
    content: Array<ISearchContent<T>>
}
