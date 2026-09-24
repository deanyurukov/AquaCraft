import { Navigate, Outlet, useOutletContext } from "react-router";

const GuestRoutes = () => {
    const { user } = useOutletContext();

    return (
        user ? <Navigate to='/' /> : <Outlet />
    );
}

export default GuestRoutes;