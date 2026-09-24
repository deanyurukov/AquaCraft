import { Navigate, Outlet, useOutletContext } from "react-router";

const UserRoutes = () => {
    const ctx = useOutletContext();

    return (
        !ctx.user ? <Navigate to='/login' /> : <Outlet context={ctx} />
    );
}

export default UserRoutes;