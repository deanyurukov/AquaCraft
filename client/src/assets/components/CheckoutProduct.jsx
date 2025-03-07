import { useTranslation } from "react-i18next";

const CheckoutProduct = ({ product }) => {
    const { t } = useTranslation();

    return (
        <div className="product">
            <p><span>{t(`productsList.${product.product._id}.title`)}</span> <span>x</span> <span>{product.quantity}</span></p>
            <p>${(product.product.price * product.quantity).toFixed(2)}</p>
        </div>
    );
}

export default CheckoutProduct;