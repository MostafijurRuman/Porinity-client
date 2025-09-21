import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from "../Pages/Error/ErrorPage";
import HomeLayout from "../Layouts/HomeLayout";
import Home from "../Pages/Home/Home"

import Biodatas from "../Pages/Biodatas/Biodatas";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Contact from "../Pages/Contact/Contact";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivateRoutes from "./PrivateRoutes";


const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout/>,
        errorElement:<ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "biodatas",
                element: <Biodatas/>,
            },
            {
                path: "about-us",
                element: <AboutUs/>,
            },
            {
                path: "contact",
                element: <Contact/>,
            },
            {
                path: "login",
                element: <Login/>,
            },
            {
                path: "register",
                element: <Register/>,
            },
            {
                path: "dashboard",
                element: <PrivateRoutes><Dashboard/></PrivateRoutes>,
            },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
