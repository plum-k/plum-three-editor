import Undefined from "./Undefined";
import Null from "./Null";

type  Nil<T> = Undefined<T> & Null<T>;

export default Nil;