import { useNavigate } from "react-router-dom";
import { changeImage } from "../services/helpers";
import productsService from "../services/products-service";
import { useContext } from "react";
import { appContext } from "../../App";
import { useTranslation } from "react-i18next";

const OrderProduct = ({ quantity, product, getOrder }) => {
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];
    const { t } = useTranslation();

    return (
        <tr>
            <td><img onError={changeImage} src={product.imageUrl} alt={product.title} /></td>
            <td>{t(`productsList.${product._id}.title`)}</td>
            <td>{quantity}</td>
            <td>${(quantity * product.price).toFixed(2)}</td>
            <td>
                <span>
                    {
                        product.isFav ?
                            <i onClick={async () => {
                                const [data, error] = await productsService.removeFromFavorites(product._id);

                                if (!data) {
                                    getErrorAndDisplay(error);
                                    return;
                                }

                                getOrder();
                            }} className="fa-solid fa-heart fill"></i> :
                            <i onClick={async () => {
                                const [data, error] = await productsService.addToFavorites(product._id);

                                if (!data) {
                                    getErrorAndDisplay(error);
                                    return;
                                }

                                getOrder();
                            }} className="fa-regular fa-heart"></i>
                    }
                </span>
            </td>
            <td>
                <span>
                    <a onClick={async () => {
                        const [data, error] = await productsService.addToCart(product._id);

                        if (!data) {
                            getErrorAndDisplay(error);
                            return;
                        }
                        else {
                            navigate("/cart");
                        }
                    }}><i className="fa-solid fa-cart-plus"></i></a>
                </span>
            </td>
        </tr>
    );
}

export default OrderProduct;