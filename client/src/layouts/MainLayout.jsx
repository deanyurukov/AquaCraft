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
        try {
            const data = (await authService.getUserData())[0];
    
            if (data.isValid) {
                setUser(data.data);
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    //! Testing purposes
    useEffect(() => {
        console.log(user);
    }, [user]);

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