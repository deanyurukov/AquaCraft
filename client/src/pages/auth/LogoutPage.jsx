import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useContext, useEffect } from "react";
import { appContext } from "../../App";
import authService from "../../services/auth-service";
import { useTranslation } from "react-i18next";

const LogoutPage = () => {
    const { getErrorAndDisplay } = useContext(appContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;
    const { t } = useTranslation();
    const { setUser } = useOutletContext();

    useEffect(() => {
        const logout = async () => {
            if (confirm(t("logout.message"))) {
                const [logoutData, error] = await authService.logout();

                if (!logoutData) {
                    getErrorAndDisplay(error);
                    return;
                }

                localStorage.removeItem("accessToken");
                setUser(null);
                navigate("/");
                getErrorAndDisplay(t(logoutData.message));
            }
            else {
                navigate(from);
            }
        };

        logout();
    }, [navigate]);

    return null;
};

export default LogoutPage;