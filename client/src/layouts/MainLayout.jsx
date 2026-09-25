import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorMessage from "../components/ErrorMessage";
import { useContext, useEffect, useState } from "react";
import { appContext } from "../App";
import UnderConstruction from "../components/UnderConstruction";
import Chatbot from "../components/Chatbot";
import authService from "../services/auth-service";
import productsService from "../services/products-service";

const MainLayout = () => {
    const { error, getErrorAndDisplay } = useContext(appContext);
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState(null);

    async function getUser() {
        try {
            const data = (await authService.getUserData())[0];

            if (data.isValid) {
                setUser(data.data);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    async function getProducts() {
        try {
            const data = await productsService.getAll();
            setProducts(data);
        }
        catch (e) {
            console.error(e);
        }
    }

    async function unlikeProduct(id) {
        if (!user) return;

        const [data, error] = await productsService.removeFromFavorites(id);

        if (error) {
            getErrorAndDisplay(error);
            return;
        }

        const index = user.favorites.indexOf(id);

        if (index === -1) return;

        setUser(prev => prev.favorites.splice(index, 1));
    }
    
    async function likeProduct(id) {
        if (!user) return;

        const [data, error] = await productsService.addToFavorites(id);

        if (error) {
            getErrorAndDisplay(error);
            return;
        }

        const index = user.favorites.indexOf(id);
        if (index !== -1) return;

        setUser(prev => prev.favorites.push(id));
    }

    useEffect(() => {
        getUser();
        getProducts();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    //! Testing purposes
    useEffect(() => {
        console.log(user);
        console.log(products);
    }, [user, products]);

    if (!user || !products) return;

    return (
        <>
            {error && <ErrorMessage key={error} error={error} />}
            <UnderConstruction />
            <Navbar user={user} products={products} unlikeProduct={unlikeProduct} />
            <Outlet context={{ user, setUser, products, unlikeProduct, likeProduct }} />
            <Chatbot />
            <Footer />
        </>
    );
}

export default MainLayout;