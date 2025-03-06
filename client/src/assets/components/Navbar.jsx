import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../../App";
import OverlayProduct from "./OverlayProduct";

const Navbar = () => {
    let [isLoggedIn, favorites, getFavs] = useContext(appContext);
    const [isClicked, setIsClicked] = useState(false);
    const [isClickedNav, setIsClickedNav] = useState(false);
    const location = useLocation();

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

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const unwantedAs = Array.from(document.querySelectorAll('.fepRsP a'));

            if (unwantedAs) {
                unwantedAs.forEach(unwantedA => {
                    unwantedA.style.display = 'none';
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    const userNav = (
        <>
            <NavLink to="/cart"><i className="fa-solid fa-cart-shopping"></i></NavLink>
            <i id="favorites-icon" onClick={showFavorites} className="fa-regular fa-heart"></i>
            <NavLink to='/logout' state={{ from: location }}><i className="fa-solid fa-right-from-bracket"></i></NavLink>
            <NavLink to='/profile/panel'><i className="fa-solid fa-user"></i></NavLink>
        </>
    );

    const guestNav = (
        <>
            <NavLink to="/login" key={isLoggedIn}>Вход</NavLink>
            <NavLink to="/register">Регистриране</NavLink>
        </>
    );

    return (
        <>
            <div id="nav-overlay" className={isClickedNav ? "show" : " "} onClick={hideNavOverlay}>
                <button onClick={() => setIsClickedNav(false)}><i className="fa-solid fa-xmark"></i></button>

                <div>
                    <NavLink to="/">Начало</NavLink>
                    <NavLink to="/products">Продукти</NavLink>
                    {isLoggedIn ? userNav : guestNav}
                </div>
            </div>

            <header id="site-header">
                <div className={`favorites-overlay-container  ${isClicked ? "active-overlay-container" : ""}`} onClick={hideFavorites}>
                    <div className={`favorites-overlay ${isClicked ? "active-overlay-content" : ""}`} onClick={handleFavoritesClicks}>
                        <div className="overlay-text-container">
                            <div className="overlay-top">
                                <div className="overlay-header">
                                    <h2>Любими продукти</h2>

                                    <i onClick={hideFavorites} className="fa-solid fa-heart-circle-xmark"></i>
                                </div>

                                <hr />

                                <div className="overlay-products">
                                    {
                                        favorites.length === 0 ?
                                            <p>Нямате харесани продукти!</p> :
                                            favorites.map(product => (
                                                <OverlayProduct product={product} key={product._id} />
                                            ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NavLink to="/" ><img src="/public/images/logo.png" alt="logo" /></NavLink>

                <nav>
                    <NavLink to="/">Начало</NavLink>
                    <NavLink to="/products">Продукти</NavLink>
                    <div className="elfsight-app-7b2f1a1b-4abc-446c-a0f1-763a074e773f" data-elfsight-app-lazy></div>
                    {isLoggedIn ? userNav : guestNav}
                </nav>
                
                <div id="responsive-nav">
                <div className="elfsight-app-7b2f1a1b-4abc-446c-a0f1-763a074e773f" data-elfsight-app-lazy></div>
                    <button onClick={() => setIsClickedNav(true)}><i className="fa-solid fa-bars"></i></button>
                </div>
            </header>
        </>
    );
};

export default Navbar;