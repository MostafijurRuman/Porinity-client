import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import ErrorPage from "../Pages/Error/ErrorPage";
import HomeLayout from "../Layouts/HomeLayout";
import Home from "../Pages/Home/Home"

import Biodatas from "../Pages/Biodatas/Biodatas";
import BiodataDetails from "../Pages/Biodatas/BiodataDetails";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Contact from "../Pages/Contact/Contact";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivateRoutes from "./PrivateRoutes";
import Checkout from "../Pages/Checkout/Checkout";
import EditBiodata from "../Pages/Dashboard/EditBiodata";
import ViewBiodata from "../Pages/Dashboard/ViewBiodata";
import MyContactRequests from "../Pages/Dashboard/MyContactRequests";
import FavouritesDashboard from "../Pages/Dashboard/FavouritesDashboard";
import EditProfile from "../Pages/EditProfile/EditProfile";


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
                path: "biodatas/:id",
                element: <PrivateRoutes><BiodataDetails/></PrivateRoutes>,
            },
            {
                path: "checkout/:id",
                element: <PrivateRoutes><Checkout/></PrivateRoutes>,
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
                path: "edit-profile",
                element: <PrivateRoutes><EditProfile/></PrivateRoutes>,
            },
            {
                path: "dashboard",
                element: <PrivateRoutes><Dashboard/></PrivateRoutes>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="edit-biodata" replace />,
                    },
                    {
                        path: "edit-biodata",
                        element: <EditBiodata />,
                    },
                    {
                        path: "view-biodata",
                        element: <ViewBiodata />,
                    },
                    {
                        path: "my-contact-requests",
                        element: <MyContactRequests />,
                    },
                    {
                        path: "favourites",
                        element: <FavouritesDashboard />,
                    },
                ],
            },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
