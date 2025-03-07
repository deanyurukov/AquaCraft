import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { appContext } from "../../App";
import { useTranslation } from "react-i18next";

const ProfileLayout = () => {
    const { t } = useTranslation();
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(t("profile.panel.title"));
    const [isLoggedIn] = useContext(appContext);
    const navigate = useNavigate();
    const location = useLocation();

    const profileNavigation = (
        <nav>
            <NavLink onClick={() => setCurrentPage(t("profile.panel.title"))} to="/profile/panel" end>{t("profile.panel.title")}</NavLink>
            <NavLink onClick={() => setCurrentPage(t("profile.data.title"))} to="/profile/user-data">{t("profile.data.title")}</NavLink>
            <NavLink onClick={() => setCurrentPage(t("profile.panel.orders"))} to="/profile/orders">{t("profile.orders.title")}</NavLink>
            <NavLink to='/logout' state={{ from: location }}>{t("profile.logout")}</NavLink>
        </nav>
    );

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }
    }, []);

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