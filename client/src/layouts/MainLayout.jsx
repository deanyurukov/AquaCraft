import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../App";
import UnderConstruction from "../components/UnderConstruction";
import Chatbot from "../components/Chatbot";
import authService from "../services/auth-service";

const MainLayout = () => {
    const error = useContext(appContext)[5];
    const location = useLocation();
    const [user, setUser] = useState(null);

    async function getUser() {
        const data = await authService.getAuth();
        console.log(data);
        setUser(data.user);
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            {error && <ErrorMessage key={error} error={error} />}
            <UnderConstruction />
            <Navbar user={user} />
            <Outlet context={{ user, setUser }} />
            <Chatbot />
            <Footer />
        </>
    );
}

export default MainLayout;