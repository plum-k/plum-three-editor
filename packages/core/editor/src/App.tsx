import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import {ThreeEdit} from "./view";
import {Fragment} from "react";

const routerConfig: RouteObject[] = [
    {
        path: '/',
        element: <ThreeEdit/>,
    }
]

function App() {
    const router = createBrowserRouter(routerConfig)

    return (
        <Fragment>
            <RouterProvider router={router}/>
        </Fragment>
    )
}

export default App
