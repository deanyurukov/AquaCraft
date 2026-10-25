import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../services/auth-service";
import useLogout from "../hooks/useLogout";

const ProfileLayout = () => {
    const { t } = useTranslation();
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const ctx = useOutletContext();
    const { setUser } = useOutletContext();
    const logout = useLogout(setUser);
    const location = useLocation();
    const profilePage = location.pathname.startsWith("/profile/order") ? "orders" : location.pathname === "/profile/user-data" ? "data" : "panel";
    const currentPage = t(`profile.${profilePage}.title`); 

    useEffect(() => {
        const getAdminInfo = async () => {
            const isAdmin = (await authService.getUserData())[0].data.isAdmin;
            setIsAdmin(isAdmin);
        }
        
        getAdminInfo();
    }, []);

    const profileNavigation = (
        <nav>
            <NavLink to="/profile/panel" end>{t("profile.panel.title")}</NavLink>
            <NavLink to="/profile/user-data">{t("profile.data.title")}</NavLink>
            <NavLink to="/profile/orders">{t("profile.orders.title")}</NavLink>
            {
                isAdmin &&
                <NavLink to="/admin/create">{t("profile.admin.title")}</NavLink>
            }
            <button onClick={logout}>{t("profile.logout")}</button>
        </nav>
    );

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

                <Outlet context={ctx} />
            </div>
        </>
    )
}

export default ProfileLayout;