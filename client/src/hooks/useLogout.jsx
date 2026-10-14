import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { appContext } from "../App";
import authService from "../services/auth-service";
import { useTranslation } from "react-i18next";

const useLogout = (setUser) => {
    const { getErrorAndDisplay } = useContext(appContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const logout = async () => {
        if (!confirm(t("logout.message"))) {
            return;
        }

        const [logoutData, error] = await authService.logout();

        if (!logoutData) {
            getErrorAndDisplay(error);
            return;
        }

        localStorage.removeItem("accessToken");
        setUser(null);
        navigate("/");
        getErrorAndDisplay(logoutData.message);
    };

    return logout;
};

export default useLogout;