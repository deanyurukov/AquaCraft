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

const CheckoutPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn] = useContext(appContext);
    const getErrorAndDisplay = useContext(appContext)[6];
    const [totalPrice, setTotalPrice] = useState(0);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();

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

        return data;
    }

    return (
        <div id="checkout">
            <h1>Плащане</h1>

            <div className="content">
                <div className="left">
                    <h2>Детайли на плащането</h2>
                    <form>
                        <CheckoutInput label={"Име*"} name={"name"} />
                        <CheckoutInput label={"Град*"} name={"town"} />
                        <CheckoutInput label={"Телефонен номер*"} name={"phone"} type={"phone"} />
                        <CheckoutInput label={"Имейл*"} name={"email"} type={"email"} value={userEmail} />

                        <div>
                            <label>Куриер*</label>
                            <select name="deliveryWay">
                                <option value="">-----------------</option>
                                <option value="speedy">Speedy</option>
                                <option value="econt">Econt</option>
                                <option value="dhl">DHL</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="right">
                    <div className="titlebar">
                        <h4>Продукт</h4>
                        <h4>Цена</h4>
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
                        <h5>Крайна цена</h5>
                        <h5 key={totalPrice}>${totalPrice.toFixed(2)}</h5>
                    </div>

                    <hr />

                    <button onClick={async (e) => {
                        const data = await onSubmit(e);
                            
                        if (data) {
                            navigate("/"); /* to be changed later.. */
                        }
                    }}>Завърши поръчка</button>
                </div>

            </div>
        </div>
    )
}

export default CheckoutPage;