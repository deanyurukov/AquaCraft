import { Navigate, Outlet, useOutletContext } from "react-router";

const UserRoutes = () => {
    const { user } = useOutletContext();

    return (
        !user ? <Navigate to='/login' /> : <Outlet />
    );
}

export default UserRoutes;