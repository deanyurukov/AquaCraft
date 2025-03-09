import { Link, useNavigate } from "react-router-dom";
import { changeImage } from "../services/helpers.js";
import productsService from "../services/products-service.js";
import { appContext } from "../../App.jsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, getProducts }) => {
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];
    const { t } = useTranslation();
    
    return (
        <div className="product">
            <img onError={changeImage} src={product.imageUrl} alt={product.title} />

            {
                product.isFav ?
                    <i onClick={async () => {
                        const [data, error] = await productsService.removeFromFavorites(product._id);

                        if (!data) {
                            getErrorAndDisplay(error);
                            return;
                        }

                        getProducts();
                    }} className="fa-solid fa-heart fill"></i> :
                    <i onClick={async () => {
                        const [data, error] = await productsService.addToFavorites(product._id);

                        if (!data) {
                            getErrorAndDisplay(error);
                            return;
                        }
                        
                        getProducts();
                    }} className="fa-regular fa-heart"></i>
            }
            <span>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <p>${Number(product.price).toFixed(2)}</p>
                <div>
                    <Link to={`/products/${product._id}/details`}>{t("products.details")}</Link>
                    <Link onClick={async () => {
                        const [data, error] = await productsService.addToCart(product._id);

                        if (!data) {
                            getErrorAndDisplay(error);
                            return;
                        }
                        else {
                            navigate("/cart");
                        }
                    }}>{t("products.buy")}</Link>
                </div>
            </span>
        </div>
    )
}

export default ProductCard;