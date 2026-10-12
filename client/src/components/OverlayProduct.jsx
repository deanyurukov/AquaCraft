import { changeImage } from "../services/helpers.js";

const OverlayProduct = ({ product, unlikeProduct, addToCart }) => {
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