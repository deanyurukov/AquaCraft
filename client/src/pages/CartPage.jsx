import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import CartCard from "../components/CartCard.jsx";
import { calculateTotalPrice } from "../services/helpers.js";
import { useTranslation } from "react-i18next";

const CartPage = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const { t } = useTranslation();
    const { products, user } = useOutletContext();
    const [inCart, setInCart] = useState([]);

    function loadInCart() {
        setInCart(prev => {
            products.forEach(p => {
                const productInCart = user.productsInCart.find(c => p._id === c.product);

                if (productInCart) {
                    prev.push({ quantity: productInCart.quantity, product: p });
                }
            });

            return [...prev];
        });
    }

    function getTotalPrice() {
        const combined = calculateTotalPrice(inCart);
        setTotalPrice(combined);
    }

    useEffect(() => {
        setInCart([]);
        loadInCart();
    }, [user]);

    useEffect(() => {
        if (inCart.length > 0) {
            getTotalPrice();
        }
    }, [inCart]);

    return (
        <div id="cart">
            <h1>{t("cart.title")}</h1>
            {
                inCart.length === 0 ?
                    <p>{t("cart.empty")} :)</p> :
                    <div className="cart-wrapper">
                        <div className="left">
                            <div>
                                <p>{t("cart.image")}</p>
                                <p>{t("cart.product")}</p>
                                <p>{t("cart.quantity")}</p>
                                <p>{t("cart.price")}</p>
                            </div>

                            <div>
                                {
                                    inCart.map(product => (
                                        <CartCard key={product.product._id} product={product} setInCart={setInCart} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="right">
                            <div>
                                <h3>{t("cart.total")}:</h3>
                                <p>€{totalPrice.toFixed(2)}</p>
                            </div>
                            <Link to="/checkout">{t("cart.checkout")}</Link>
                        </div>
                    </div>
            }
        </div>
    );
}

export default CartPage;