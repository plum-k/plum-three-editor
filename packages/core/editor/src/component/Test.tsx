import React, {Fragment, useEffect} from "react";

const Test: React.FC = () => {
    const viewer = useViewer()
    useEffect(() => {
    }, [viewer])

    return (
        <Fragment>
        </Fragment>
    )
}

export default Test;
