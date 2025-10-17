import {
    createBrowserRouter,
    RouterProvider,
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
import PremiumBiodataCheckout from "../Pages/Checkout/PremiumBiodataCheckout";
import PremiumUserCheckout from "../Pages/Checkout/PremiumUserCheckout";
import EditBiodata from "../Pages/Dashboard/EditBiodata";
import ViewBiodata from "../Pages/Dashboard/ViewBiodata";
import MyContactRequests from "../Pages/Dashboard/MyContactRequests";
import FavouritesDashboard from "../Pages/Dashboard/FavouritesDashboard";
import DashboardLanding from "../Pages/Dashboard/DashboardLanding";
import AdminManageUsers from "../Pages/Dashboard/Admin/AdminManageUsers";
import AdminPremiumApprovals from "../Pages/Dashboard/Admin/AdminPremiumApprovals";
import AdminPremiumUserApprovals from "../Pages/Dashboard/Admin/AdminPremiumUserApprovals";
import AdminContactApprovals from "../Pages/Dashboard/Admin/AdminContactApprovals";
import AdminSuccessStories from "../Pages/Dashboard/Admin/AdminSuccessStories";
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
                path: "premium-biodata/:id",
                element: <PrivateRoutes><PremiumBiodataCheckout/></PrivateRoutes>,
            },
            {
                path: "premium-user",
                element: <PrivateRoutes><PremiumUserCheckout/></PrivateRoutes>,
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
                        element: <DashboardLanding />,
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
                    {
                        path: "manage",
                        element: <AdminManageUsers />,
                    },
                    {
                        path: "premium-biodata-approvals",
                        element: <AdminPremiumApprovals />,
                    },
                    {
                        path: "premium-user-approvals",
                        element: <AdminPremiumUserApprovals />,
                    },
                    {
                        path: "approvedContactRequest",
                        element: <AdminContactApprovals />,
                    },
                    {
                        path: "success-stories",
                        element: <AdminSuccessStories />,
                    },
                ],
            },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
