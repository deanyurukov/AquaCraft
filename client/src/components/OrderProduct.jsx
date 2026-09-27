import { useNavigate, useOutletContext } from "react-router-dom";
import { changeImage } from "../services/helpers";
import productsService from "../services/products-service";
import { useContext } from "react";
import { appContext } from "../App";

const OrderProduct = ({ quantity, product }) => {
    const navigate = useNavigate();
    const { getErrorAndDisplay } = useContext(appContext);
    const { user, likeProduct, unlikeProduct, addToCart } = useOutletContext();

    return (
        <tr>
            <td><img onError={changeImage} src={product.images[0]} alt={product.title} /></td>
            <td>{product.title}</td>
            <td>{quantity}</td>
            <td>€{(quantity * product.price).toFixed(2)}</td>
            <td>
                <span>
                    {
                        user.favorites.includes(product._id) ?
                            <i onClick={() => {
                                unlikeProduct(product._id)
                            }} className="fa-solid fa-heart fill"></i> :
                            <i onClick={() => {
                                likeProduct(product._id)
                            }} className="fa-regular fa-heart"></i>
                    }
                </span>
            </td>
            <td>
                <span>
                    <a onClick={(e) => {
                        e.preventDefault();
                        addToCart(product._id);
                    }}><i className="fa-solid fa-cart-plus"></i></a>
                </span>
            </td>
        </tr>
    );
}

export default OrderProduct;