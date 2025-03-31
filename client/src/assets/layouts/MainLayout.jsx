import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import { useContext, useEffect } from "react";
import { appContext } from "../../App";

const MainLayout = () => {
    const error = useContext(appContext)[5];
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            { error && <ErrorMessage key={error} error={error} /> }
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default MainLayout;