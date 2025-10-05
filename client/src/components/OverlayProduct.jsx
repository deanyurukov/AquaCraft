import { useNavigate } from "react-router-dom";
import { changeImage } from "../services/helpers.js";
import { useContext } from "react";
import { appContext } from "../App.jsx";
import productsService from "../services/products-service.js";

const OverlayProduct = ({ product }) => {
    const navigate = useNavigate();
    const getFav = useContext(appContext)[2];
    const refreshFavorites = useContext(appContext)[3];
    const dislikeProduct = useContext(appContext)[9];

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
                const [data, error] = await productsService.removeFromFavorites(product._id);

                if (!data) {
                    getErrorAndDisplay(error);
                    return;
                }

                await getFav();
                dislikeProduct(product._id);
                refreshFavorites();
            }} className="fa-solid fa-heart fill"></i></a>
        </div>
    );
}

export default OverlayProduct;