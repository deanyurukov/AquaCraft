import { useContext, useEffect, useState } from "react";
import { appContext } from "../../App";
import { useNavigate } from "react-router-dom";
import productsService from "../services/products-service.js";
import CheckoutInput from "../components/CheckoutInput";
import CheckoutProduct from "../components/CheckoutProduct";
import Spinner from "../components/Spinner.jsx";
import ordersService from "../services/orders-service.js";
import authService from "../services/auth-service.js";
import { calculateTotalPrice } from "../services/helpers.js";
import { useTranslation } from "react-i18next";
import emailConfig from "../configs/email-config.js";

const CheckoutPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn] = useContext(appContext);
    const getErrorAndDisplay = useContext(appContext)[6];
    const [totalPrice, setTotalPrice] = useState(0);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    async function fetchProducts() {
        setLoading(true);
        const products = await productsService.getAllByUserId();
        setProducts(products);
        setLoading(false);
    }

    async function getUserEmail() {
        const email = (await authService.getUserData())[0].email;
        setUserEmail(email);
    }
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        getUserEmail();
        fetchProducts();
    }, []);

    useEffect(() => {
        const combined = calculateTotalPrice(products);
        setTotalPrice(combined);
    }, [products]);

    if (loading) {
        return <Spinner />;
    }

    async function onSubmit(e) {
        e.preventDefault();
        
        const { name, town, phone, email, deliveryWay } = Object.fromEntries(new FormData(e.target.closest(".content").querySelector("form")));

        const [data, errorMessage] = await ordersService.addOrder(name, town, phone, email, deliveryWay);

        if (!data) {
            getErrorAndDisplay(errorMessage);
            return undefined;
        }

        getErrorAndDisplay(data.message);

        try {
            emailjs.send(emailConfig.gmailService, emailConfig.orderTemplate, data.data);
        }
        catch (error) {
            console.error(error);
        }

        return data;
    }

    return (
        <div id="checkout">
            <h1>{t("checkout.title")}</h1>

            <div className="content">
                <div className="left">
                    <h2>{t("checkout.details")}</h2>
                    <form>
                        <CheckoutInput label={`${t("checkout.name")}*`} name={"name"} />
                        <CheckoutInput label={`${t("checkout.city")}*`} name={"town"} />
                        <CheckoutInput label={`${t("checkout.phone")}*`} name={"phone"} type={"phone"} placeholder={"+359 123 456 789"} />
                        <CheckoutInput label={`${t("checkout.email")}*`} name={"email"} type={"email"} value={userEmail} />

                        <div>
                            <label>{t("checkout.courier")}*</label>
                            <select name="deliveryWay">
                                <option value="">-----------------</option>
                                <option value="Speedy">Speedy</option>
                                <option value="Econt">Econt</option>
                                <option value="DHL">DHL</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="right">
                    <div className="titlebar">
                        <h4>{t("checkout.product")}</h4>
                        <h4>{t("checkout.price")}</h4>
                    </div>
                    <div className="products">
                        {
                            products.length > 0 &&
                            products.map(product => (
                                <CheckoutProduct product={product} key={product.product._id} />
                            ))
                        }
                    </div>
                    <div>
                        <h5>{t("checkout.total")}</h5>
                        <h5>€{totalPrice.toFixed(2)}</h5>
                    </div>

                    <hr />

                    <button onClick={async (e) => {
                        const data = await onSubmit(e);
                            
                        if (data) {
                            navigate("/"); /* to be changed later.. */
                        }
                    }}>{t("checkout.finish")}</button>
                </div>

            </div>
        </div>
    )
}

export default CheckoutPage;