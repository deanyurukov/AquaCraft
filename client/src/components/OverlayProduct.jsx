import { useNavigate } from "react-router-dom";
import { changeImage } from "../services/helpers.js";
import productsService from "../services/products-service.js";

const OverlayProduct = ({ product, unlikeProduct, addToCart }) => {
    const navigate = useNavigate();

    return (
        <div>
            <img src={product.images[0]} onError={changeImage} alt={product.title} />
            <p>{product.title}</p>
            <a onClick={(e) => {
                e.preventDefault();
                addToCart(product._id);
                }}><i className="fa-solid fa-cart-plus"></i></a>
            <a><i onClick={(e) => {
                e.preventDefault();
                unlikeProduct(product._id);
                }} className="fa-solid fa-heart fill"></i></a>
        </div>
    );
}

export default OverlayProduct;