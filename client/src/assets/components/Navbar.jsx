import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../App";
import OverlayProduct from "./OverlayProduct";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    let [isLoggedIn, favorites, getFavs] = useContext(appContext);
    const [isClicked, setIsClicked] = useState(false);
    const [isClickedNav, setIsClickedNav] = useState(false);
    const location = useLocation();
    const { t, i18n } = useTranslation();

    async function showFavorites() {
        favorites = await getFavs();
        setIsClicked(true);
    }

    function hideFavorites() {
        setIsClicked(false);
    }

    function handleFavoritesClicks(e) {
        e.stopPropagation();
    }

    function hideNavOverlay(e) {
        if (e.target.id === 'nav-overlay') {
            setIsClickedNav(false);
        }
    }

    const userNav = (
        <>
            <NavLink onClick={() => setIsClickedNav(false)} to={"contact-us"}><i className="fa-regular fa-comment"></i></NavLink>
            <NavLink onClick={() => setIsClickedNav(false)} to="/cart"><i className="fa-solid fa-cart-shopping"></i></NavLink>
            <i id="favorites-icon" onClick={() => { showFavorites(); setIsClickedNav(false) }} className="fa-regular fa-heart"></i>
            <NavLink onClick={() => setIsClickedNav(false)} to='/logout' state={{ from: location }}><i className="fa-solid fa-right-from-bracket"></i></NavLink>
            <NavLink onClick={() => setIsClickedNav(false)} to='/profile/panel'><i className="fa-solid fa-user"></i></NavLink>
        </>
    );

    const guestNav = (
        <>
            <NavLink onClick={() => setIsClickedNav(false)} to="/login">{t("navbar.login")}</NavLink>
            <NavLink onClick={() => setIsClickedNav(false)} to="/register">{t("navbar.register")}</NavLink>
        </>
    );

    const translationWidget = (
        i18n.language === "en" ?
            <img onClick={() => {
                i18n.changeLanguage("bg");
                localStorage.setItem("language", "bg");
            }} src="../../../images/usa.svg" alt="usa" /> :
            <img onClick={() => {
                i18n.changeLanguage("en");
                localStorage.setItem("language", "en");
            }} src="../../../images/bulgaria.svg" alt="bulgaria" />
    );

    return (
        <>
            <div id="nav-overlay" className={isClickedNav ? "show" : " "} onClick={hideNavOverlay}>
                <button onClick={() => setIsClickedNav(false)}><i className="fa-solid fa-xmark"></i></button>

                <div>
                    <NavLink onClick={() => setIsClickedNav(false)} to="/">{t("navbar.home")}</NavLink>
                    <NavLink onClick={() => setIsClickedNav(false)} to="/products">{t("navbar.products")}</NavLink>
                    {isLoggedIn ? userNav : guestNav}
                </div>
            </div>

            <header id="site-header">
                <div className={`favorites-overlay-container  ${isClicked ? "active-overlay-container" : ""}`} onClick={hideFavorites}>
                    <div className={`favorites-overlay ${isClicked ? "active-overlay-content" : ""}`} onClick={handleFavoritesClicks}>
                        <div className="overlay-text-container">
                            <div className="overlay-top">
                                <div className="overlay-header">
                                    <h2>{t("favorites.title")}</h2>

                                    <i onClick={hideFavorites} className="fa-solid fa-heart-circle-xmark"></i>
                                </div>

                                <hr />

                                <div className="overlay-products">
                                    {
                                        favorites.length === 0 ?
                                            <p>{t("favorites.empty")}</p> :
                                            favorites.map(product => (
                                                <OverlayProduct product={product} key={product._id} />
                                            ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NavLink to="/" ><img src="/images/logo.png" alt="logo" /></NavLink>

                <nav>
                    <NavLink to="/">{t("navbar.home")}</NavLink>
                    <NavLink to="/products">{t("navbar.products")}</NavLink>

                    {isLoggedIn ? userNav : guestNav}
                    { translationWidget }
                </nav>
                
                <div id="responsive-nav">
                    <button onClick={() => setIsClickedNav(true)}><i className="fa-solid fa-bars"></i></button>
                    { translationWidget }
                </div>
            </header>
        </>
    );
};

export default Navbar;