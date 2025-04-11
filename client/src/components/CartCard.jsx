import { useContext, useState } from "react";
import { changeImage } from "../services/helpers.js";
import productsService from "../services/products-service.js";
import { appContext } from "../App.jsx";
import { useTranslation } from "react-i18next";

const CartCard = ({ product, setProducts }) => {
    const [quantity, setQuantity] = useState(product.quantity);
    const getErrorAndDisplay = useContext(appContext)[6];
    const { t } = useTranslation();

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

            setProducts(prev => {
                const index = prev.indexOf(prev.find(currProduct => currProduct.product._id === product.product._id));
                prev[index].quantity = quantity;
                return [...prev];
            });
        }
    }
    
    async function deleteProduct(productId) {
        const [data, error] = await productsService.deleteOne(productId, t("cart.deleteMessage"));

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        setProducts(prev => {
            const index = prev.indexOf(prev.find(currProduct => currProduct.product._id === product.product._id));

            if (index !== -1) {
                prev.splice(index, 1);
            }

            return [...prev];
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