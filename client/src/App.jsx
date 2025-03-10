// Import React Stuff
import React, { useEffect, useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

// Import CSS
import '/src/assets/styles/app.css';

// Import helpers
import productsService from './assets/services/products-service.js';
import useUrlChange from './assets/hooks/useUrlChange.jsx';
import authService from './assets/services/auth-service.js';
import "./assets/configs/i18n-config.js";
import { useTranslation } from 'react-i18next';

// Import Layouts
import MainLayout from './assets/layouts/MainLayout.jsx';
import ProfileLayout from './assets/layouts/ProfileLayout.jsx';

// Import Pages
import HomePage from './assets/pages/HomePage.jsx';
import ProductsPage from './assets/pages/ProductsPage.jsx';
import DetailsPage from './assets/pages/DetailsPage.jsx';
import NotFoundPage from './assets/pages/NotFoundPage.jsx';
import RegisterPage from './assets/pages/auth/RegisterPage.jsx';
import LoginPage from './assets/pages/auth/LoginPage.jsx';
import LogoutPage from './assets/pages/auth/LogoutPage.jsx';
import CartPage from './assets/pages/CartPage.jsx';
import CheckoutPage from './assets/pages/CheckoutPage.jsx';
import PrivacyPolicy from './assets/pages/PrivacyPolicyPage.jsx';
import TermsAndConditions from './assets/pages/TermsAndConditionsPage.jsx';
import PanelPage from './assets/pages/profile/PanelPage.jsx';
import OrderDetailsPage from './assets/pages/profile/OrderDetailsPage.jsx';
import OrdersPage from './assets/pages/profile/OrdersPage.jsx';
import UserDataPage from './assets/pages/profile/UserDataPage.jsx';
import ContactPage from './assets/pages/ContactPage.jsx';
import CreateProductPage from './assets/pages/profile/CreateProductPage.jsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/products/:id/details' element={<DetailsPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/logout' element={<LogoutPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/contact-us' element={<ContactPage />} />

            <Route path='/profile' element={<ProfileLayout />} >
                <Route path='/profile/panel' element={<PanelPage />} />
                <Route path='/profile/orders' element={<OrdersPage />} />
                <Route path='/profile/user-data' element={<UserDataPage />} />
                <Route path='/profile/create' element={<CreateProductPage />} />
                <Route path='/profile/order/:id/details' element={<OrderDetailsPage />} />
            </Route>

            <Route path='/*' element={<NotFoundPage />} />
        </Route>
    )
);

export const appContext = React.createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); //! Needs to be false.
    const [favorites, setFavorites] = useState([]);
    const [update, setUpdate] = useState(0);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();

    const refreshFavorites = () => setUpdate((prev) => prev + 1);

    async function getAuthCtx() {
        const auth = await authService.getAuth();
        setIsLoggedIn(auth);
    }

    async function getFavs() {
        const favorites = await productsService.getFavorites();
        setFavorites([...favorites]);
    }

    function getErrorAndDisplay(error) {
        setError(t(`errorMessages.${error}`));

        setTimeout(() => {
            setError(null);
        }, 3000);
    }

    useEffect(() => {
        i18n.changeLanguage("bg");
        
        getFavs();
    }, []);

    useUrlChange(() => {
        getAuthCtx();
    });

    return <>
        <appContext.Provider value={[isLoggedIn, favorites, getFavs, refreshFavorites, update, error, getErrorAndDisplay]}>
            <RouterProvider router={router} />
        </appContext.Provider>
    </>
}

export default App;