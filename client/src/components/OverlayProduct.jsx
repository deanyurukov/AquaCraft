import { useNavigate } from "react-router-dom";
import { changeImage } from "../services/helpers.js";
import { useContext } from "react";
import { appContext } from "../App.jsx";
import productsService from "../services/products-service.js";

const OverlayProduct = ({ product }) => {
    const navigate = useNavigate();
    const getFav = useContext(appContext)[2];
    const refreshFavorites = useContext(appContext)[3];

    return (
        <div>
            <img src={product.images[0]} onError={changeImage} alt={product.title} />
            <p>{product.title}</p>
            <a onClick={async () => {
                const data = await productsService.addToCart(product._id);

                if (data) {
                    navigate("/cart");
                }
            }}><i className="fa-solid fa-cart-plus"></i></a>
            <a><i onClick={async () => {
                await productsService.removeFromFavorites(product._id);
                await getFav();
                refreshFavorites();
            }} className="fa-solid fa-heart fill"></i></a>
        </div>
    );
}

export default OverlayProduct;