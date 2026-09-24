import { Navigate, Outlet, useOutletContext } from "react-router";

const GuestRoutes = () => {
    const ctx = useOutletContext();

    return (
        ctx.user ? <Navigate to='/' /> : <Outlet context={ctx} />
    );
}

export default GuestRoutes;