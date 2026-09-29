import { useContext, useState } from "react";
import { changeImage } from "../services/helpers.js";
import productsService from "../services/products-service.js";
import { appContext } from "../App.jsx";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

const CartCard = ({ product, setInCart }) => {
    const [quantity, setQuantity] = useState(product.quantity);
    const { getErrorAndDisplay } = useContext(appContext);
    const { t } = useTranslation();
    const { setUser } = useOutletContext();

    const handleChange = (e) => {
        setQuantity(e.target.value);
    };

    async function handleQuantityChange(e, productId) {
        if (quantity <= 0) {
            e.target.value = 1;
        }
        else if (quantity > 999) {
            e.target.value = 999;
        }

        if (quantity !== Number(product.quantity)) {
            const [data, error] = await productsService.updateOne(productId, quantity);

            if (!data) {
                getErrorAndDisplay(error);
                return;
            }

            setInCart(prev => {
                const index = prev.findIndex(currProduct => currProduct.product._id === productId);

                if (index === -1) return prev;

                prev[index].quantity = Number(quantity);
                return [...prev];
            });

            setUser(prev => {
                const index = prev.productsInCart.findIndex(currProduct => currProduct.product === productId);

                if (index === -1) return prev;

                prev.productsInCart[index].quantity = Number(quantity);
                return { ...prev };
            });
        }
    }

    async function deleteProduct(productId) {
        const [data, error] = await productsService.deleteOne(productId, t("cart.deleteMessage"));

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        setInCart(prev => {
            const index = prev.findIndex(currProduct => currProduct.product._id === productId);

            if (index === -1) return prev;

            prev.splice(index, 1);
            return [...prev];
        });

        setUser(prev => {
            const index = prev.productsInCart.findIndex(currProduct => currProduct.product === productId);

            if (index === -1) return prev;

            prev.productsInCart.splice(index, 1);
            return { ...prev };
        });
    }

    return (
        <div>
            <img onError={changeImage} src={product.product.images[0]} alt={product.product.title} />
            <p>{product.product.title}</p>
            <span>
                <input onBlur={(e) => handleQuantityChange(e, product.product._id)} onChange={handleChange} type="number" min="1" max="999" value={quantity} />
            </span>
            <p>€{(product.product.price * product.quantity).toFixed(2)}</p>
            <button onClick={() => deleteProduct(product.product._id)}><i className="fa-solid fa-trash"></i></button>
        </div>
    )
}

export default CartCard;