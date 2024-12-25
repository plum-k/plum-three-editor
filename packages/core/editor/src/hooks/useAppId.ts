import {useParams} from "react-router-dom";

const useAppId = () => {
    let {id} = useParams<{ id: string }>();
    return id;
}
export default useAppId;