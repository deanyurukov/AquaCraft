import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { appContext } from "../../../App";
import authService from "../../services/auth-service";
import { useTranslation } from "react-i18next";

const LogoutPage = () => {
    const [isLoggedIn] = useContext(appContext);
    const getErrorAndDisplay = useContext(appContext)[6];
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;
    const { t } = useTranslation();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        const logout = async () => {
            if (confirm(t("logout.message"))) {
                const [logoutData, error] = await authService.logout();

                if (!logoutData) {
                    getErrorAndDisplay(error);
                    return;
                }

                localStorage.removeItem("accessToken");
                navigate("/");
                getErrorAndDisplay(t(logoutData.message));
            }
            else {
                navigate(from);
            }
        };

        logout();
    }, [isLoggedIn, navigate]);

    return null;
};

export default LogoutPage;