import { useState, useEffect, useContext } from "react";
import productsService from "../services/products-service.js";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { appContext } from "../../App.jsx";

const ProductsPage = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const update = useContext(appContext)[4];

    async function getProducts() {
        setLoading(true);

        const products = await productsService.getAll();
        setProducts(products);
        
        setLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, [update]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div id="products">
            <h1>Продукти</h1>

            <div className="products-wrapper">
                {
                    products.map(product => (
                        <ProductCard product={product} getProducts={getProducts} key={product._id} />
                    ))
                }
            </div>
        </div>
    );
}

export default ProductsPage;