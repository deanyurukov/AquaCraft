import { useContext, useEffect, useState } from "react";
import { appContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import productsService from "../services/products-service";
import CartCard from "../components/CartCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { calculateTotalPrice } from "../services/helpers.js";

const CartPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn] = useContext(appContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    async function fetchProducts() {
        setLoading(true);
        const products = await productsService.getAllByUserId();
        setProducts(products);
        setLoading(false);
    }

    function getTotalPrice() {
        const combined = calculateTotalPrice(products);
        setTotalPrice(combined);
    }
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }

        fetchProducts();
    }, []);
    
    useEffect(() => {
        if (products.length > 0) {
            getTotalPrice();
        }
    }, [products]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div id="cart">
            <h1>Количка</h1>
            {
                products.length === 0 ?
                    <p>Няма добавени продукти :)</p> :
                    <div className="cart-wrapper">
                        <div className="left">
                            <div>
                                <p>Снимка</p>
                                <p>Продукт</p>
                                <p>Брой</p>
                                <p>Цена</p>
                            </div>

                            <div>
                                {
                                    products.map(product => (
                                        <CartCard product={product} fetchProducts={fetchProducts} key={product.product._id} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="right">
                            <div>
                                <h3>Крайна Цена:</h3>
                                <p key={totalPrice}>${totalPrice.toFixed(2)}</p>
                            </div>
                            <Link to="/checkout">Към плащане</Link>
                        </div>
                    </div>
            }
        </div>
    );
}

export default CartPage;