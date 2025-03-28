import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { appContext } from "../../App";
import { useTranslation } from "react-i18next";
import authService from "../services/auth-service";

const AdminLayout = () => {
    const { t, i18n } = useTranslation();
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(t("admin.create.title"));
    const [isLoggedIn] = useContext(appContext);
    const navigate = useNavigate();
    const [ isAdmin, setIsAdmin] = useState(false);

    const paths = {
        "Създай продукт": "create",
        "Create product": "create",
        "Stock": "Stock",
        "Стоки": "Stock",
        "Промени": "edit",
        "Edit": "edit",
    };

    useEffect(() => {
        setCurrentPage(prev => prev = t(`admin.${paths[prev]}.title`));
    }, [i18n.language]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        const getAdminInfo = async () => {
            const isAdmin = (await authService.getUserData())[0].isAdmin;

            if (!isAdmin) {
                navigate("/");
                return;
            }

            setIsAdmin(isAdmin);
        }

        getAdminInfo();
    }, []);

    const profileNavigation = (
        <nav>
            <NavLink onClick={() => setCurrentPage(t("admin.create.title"))} to="/admin/create" end>{t("admin.create.title")}</NavLink>
            <NavLink onClick={() => setCurrentPage(t("admin.products.title"))} to="/admin/products" end>{t("admin.products.title")}</NavLink>
            <NavLink onClick={() => setCurrentPage(t("admin.editAll.title"))} to="/admin/edit" end>{t("admin.editAll.title")}</NavLink>
        </nav>
    );

    if (isLoggedIn) {
        return (
            <>
                <div id="admin" onClick={() => setIsDropdownClicked(false)}>
                    <aside>
                        <h4>{t("admin.title")}</h4>

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

export default AdminLayout;