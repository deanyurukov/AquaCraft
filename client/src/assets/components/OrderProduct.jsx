import { useNavigate } from "react-router-dom";
import { changeImage } from "../services/helpers";
import productsService from "../services/products-service";
import { useContext } from "react";
import { appContext } from "../../App";

const OrderProduct = ({ quantity, product, getOrder }) => {
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];

    return (
        <tr>
            <td><img onError={changeImage} src={product.images[0]} alt={product.title} /></td>
            <td>{product.title}</td>
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