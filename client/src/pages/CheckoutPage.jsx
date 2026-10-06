import { useContext, useEffect, useState } from "react";
import { appContext } from "../App";
import { useNavigate, useOutletContext } from "react-router-dom";
import productsService from "../services/products-service.js";
import Input from "../components/Input";
import CheckoutProduct from "../components/CheckoutProduct";
import Spinner from "../components/Spinner.jsx";
import ordersService from "../services/orders-service.js";
import { calculateTotalPrice } from "../services/helpers.js";
import { useTranslation } from "react-i18next";
import emailConfig from "../configs/email-config.js";
import SelectInput from "../components/SelectInput.jsx";

const CheckoutPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { getErrorAndDisplay } = useContext(appContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, setUser } = useOutletContext();

    async function fetchProducts() {
        setLoading(true);
        const products = await productsService.getAllByUserId();
        setProducts(products);
        setLoading(false);
    }

    async function getUserEmail() {
        setUserEmail(user.email);
    }

    useEffect(() => {
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
        if (submitLoading) return;
        setSubmitLoading(true);

        const { name, town, phone, email, deliveryWay } = Object.fromEntries(new FormData(e.target.closest(".content").querySelector("form")));

        const [data, error] = await ordersService.addOrder(name, town, phone, email, deliveryWay);

        if (error) {
            getErrorAndDisplay(error);
            setSubmitLoading(false);
            return;
        }

        getErrorAndDisplay(data.message);
        setUser(prev => {
            prev.productsInCart = [];
            return {...prev};
        });
        navigate(`/profile/order/${data.data._id}/details`);

        try {
            // emailjs.send(emailConfig.supportService, emailConfig.orderTemplate, data.data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setSubmitLoading(false);
        }
    }

    return (
        <div id="checkout">
            <h1>{t("checkout.title")}</h1>

            <div className="content">
                <div className="left">
                    <h2>{t("checkout.details")}</h2>
                    <form>
                        <Input label={`${t("checkout.name")}*`} name={"name"} />
                        <Input label={`${t("checkout.city")}*`} name={"town"} />
                        <Input label={`${t("checkout.phone")}*`} name={"phone"} type={"phone"} placeholder={"+359 123 456 789"} />
                        <Input label={`${t("checkout.email")}*`} name={"email"} type={"email"} value={userEmail} />

                        <div>
                            <label>{t("checkout.courier")}*</label>
                            <SelectInput name={"deliveryWay"} options={[{ text: "-----------------", val: "" }, { text: "Speedy", val: "Speedy" }, { text: "Econt", val: "Econt" }, { text: "DHL", val: "DHL" }]} />
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

                    <button onClick={onSubmit} disabled={submitLoading} className="link primary" type="submit">{submitLoading ? t("common.loading") : t("checkout.finish")}</button>
                </div>

            </div>
        </div>
    )
}

export default CheckoutPage;