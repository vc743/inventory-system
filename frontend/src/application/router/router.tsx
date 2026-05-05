import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "@/application/pages/login/Login";
import Register from "@/application/pages/register/Register";

const Router = () => {

    const router = createBrowserRouter([
        {
            index: true,
            path: "/",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/register",
            element: <Register />
        }
    ])

    return (
        <Suspense>
            <RouterProvider router={router} />
        </Suspense>
    )

}

export default Router;