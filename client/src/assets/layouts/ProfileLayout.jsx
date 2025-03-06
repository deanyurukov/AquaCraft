import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { appContext } from "../../App";

const ProfileLayout = () => {
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState("Панел");
    const [isLoggedIn] = useContext(appContext);
    const navigate = useNavigate();
    const location = useLocation();

    const profileNavigation = (
        <nav>
            <NavLink onClick={() => setCurrentPage("Панел")} to="/profile/panel" end>Панел</NavLink>
            <NavLink onClick={() => setCurrentPage("Моите данни")} to="/profile/user-data">Моите данни</NavLink>
            <NavLink onClick={() => setCurrentPage("Поръчки")} to="/profile/orders">Поръчки</NavLink>
            <NavLink to='/logout' state={{ from: location }}>Изход</NavLink>
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
                        <h4>Моят профил</h4>

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