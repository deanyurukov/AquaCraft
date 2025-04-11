import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { appContext } from "../App";
import { useTranslation } from "react-i18next";
import authService from "../services/auth-service";

const ProfileLayout = () => {
    const { t, i18n } = useTranslation();
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(t("profile.panel.title"));
    const [isLoggedIn] = useContext(appContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [ isAdmin, setIsAdmin] = useState(false);

    const paths = {
        "Панел": "panel",
        "Panel": "panel",
        "Моите данни": "data",
        "My data": "data",
        "История на поръчките": "orders",
        "Orders history": "orders",
        "Админ панел": "admin",
        "Admin panel": "admin"
    };

    useEffect(() => {
        setCurrentPage(prev => prev = t(`profile.${paths[prev]}.title`));
    }, [i18n.language]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        const getAdminInfo = async () => {
            const isAdmin = (await authService.getUserData())[0].isAdmin;
            setIsAdmin(isAdmin);
        }

        getAdminInfo();
    }, []);

    const profileNavigation = (
        <nav>
            <NavLink onClick={() => setCurrentPage(t("profile.panel.title"))} to="/profile/panel" end>{t("profile.panel.title")}</NavLink>
            <NavLink onClick={() => setCurrentPage(t("profile.data.title"))} to="/profile/user-data">{t("profile.data.title")}</NavLink>
            <NavLink onClick={() => setCurrentPage(t("profile.orders.title"))} to="/profile/orders">{t("profile.orders.title")}</NavLink>
            {
                isAdmin &&
                <NavLink onClick={() => setCurrentPage(t("profile.admin.title"))} to="/admin/create">{t("profile.admin.title")}</NavLink>
            }
            <NavLink to='/logout' state={{ from: location }}>{t("profile.logout")}</NavLink>
        </nav>
    );

    if (isLoggedIn) {
        return (
            <>
                <div id="profile" onClick={() => setIsDropdownClicked(false)}>
                    <aside>
                        <h4>{t("profile.title")}</h4>

                        {profileNavigation}
                    </aside>

                    <div onClick={(e) => {
                            e.stopPropagation()
                            setIsDropdownClicked(prev => prev = !prev)
                            }} className="dropdown">
                        <h3>{currentPage}</h3>

                        {isDropdownClicked ? <i className="fa-solid fa-arrow-up"></i> : <i className="fa-solid fa-arrow-down"></i>}

                        {
                            isDropdownClicked &&
                            profileNavigation
                        }
                    </div>

                    <Outlet />
                </div>
            </>
        )
    }
}

export default ProfileLayout;