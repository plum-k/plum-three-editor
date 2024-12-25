import User from "./entity/User";

export default interface IComment {
    id: number,
    gmtCreate: string,
    content: string,
    user: User,
    sonComments: Array<IComment>,
    level: number
}
