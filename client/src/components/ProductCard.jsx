import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { changeImage } from "../services/helpers.js";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }) => {
    const { t } = useTranslation();
    const { user, likeProduct, unlikeProduct, addToCart } = useOutletContext();

    return (
        <div className="product">
            <img onError={changeImage} src={product.images[0]} alt={product.title} />

            {
                user.favorites.includes(product._id) ?
                    <i onClick={() => {
                        unlikeProduct(product._id)
                    }} className="fa-solid fa-heart fill"></i> :
                    <i onClick={() => {
                        likeProduct(product._id)
                    }} className="fa-regular fa-heart"></i>
            }
            <span>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <p>€{Number(product.price).toFixed(2)}</p>
                <div>
                    <Link to={`/products/${product._id}/details`}>{t("products.details")}</Link>
                    <Link onClick={() => addToCart(product._id)}>{t("products.buy")}</Link>
                </div>
            </span>
        </div>
    )
}

export default ProductCard;