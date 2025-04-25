// Import React Stuff
import React, { useEffect, useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

// Import CSS
import '/src/styles/app.css';

// Import helpers
import productsService from './services/products-service.js';
import useUrlChange from './hooks/useUrlChange.jsx';
import authService from './services/auth-service.js';
import "./configs/i18n-config.js";
import { useTranslation } from 'react-i18next';

// Import Layouts
import MainLayout from './layouts/MainLayout.jsx';
import ProfileLayout from './layouts/ProfileLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Import Pages
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import DetailsPage from './pages/DetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import LogoutPage from './pages/auth/LogoutPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage.jsx';
import PanelPage from './pages/profile/PanelPage.jsx';
import OrderDetailsPage from './pages/profile/OrderDetailsPage.jsx';
import OrdersPage from './pages/profile/OrdersPage.jsx';
import UserDataPage from './pages/profile/UserDataPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CreateProductPage from './pages/admin/CreateProductPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminEditAll from './pages/admin/AdminEditAll.jsx';
import EditProductPage from './pages/admin/EditProductPage.jsx';
import ProjectRequestPage from './pages/ProjectRequestPage.jsx';
import HowToPage from './pages/HowToPage.jsx';
import AdminOrdersPage from './pages/admin/OrdersAdminPage.jsx';

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
            <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditionsPage />} />
            <Route path='/contact-us' element={<ContactPage />} />
            <Route path='/project-request' element={<ProjectRequestPage />} />
            <Route path='/how-to' element={<HowToPage />} />

            <Route path='/profile' element={<ProfileLayout />} >
                <Route path='/profile/panel' element={<PanelPage />} />
                <Route path='/profile/orders' element={<OrdersPage />} />
                <Route path='/profile/user-data' element={<UserDataPage />} />
                <Route path='/profile/create' element={<CreateProductPage />} />
                <Route path='/profile/order/:id/details' element={<OrderDetailsPage />} />
            </Route>

            <Route path='/admin' element={<AdminLayout />} >
                <Route path='/admin/create' element={<CreateProductPage />} />
                <Route path='/admin/products' element={<AdminProductsPage />} />
                <Route path='/admin/edit' element={<AdminEditAll />} />
                <Route path='/admin/:id/edit' element={<EditProductPage />} />
                <Route path='/admin/orders' element={<AdminOrdersPage />} />
            </Route>

            <Route path='/*' element={<NotFoundPage />} />
        </Route>
    )
);

export const appContext = React.createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(true); //! Needs to be false.
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
        i18n.changeLanguage(localStorage.getItem("language") || "bg");
        
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