import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import productsService from "../../services/products-service";
import AdminProduct from "../../components/AdminProduct";

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getProducts() {
        setLoading(true);

        const products = await productsService.getAll();
        setProducts(products);

        setLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, []);

    if (loading) {
        return <div id="profile-spinner">
            <Spinner />
        </div>;
    }

    return (
        <div id="admin-products">
            {products.map(product => (
                <AdminProduct product={product} getProducts={getProducts} key={product._id} />
            ))}
        </div>
    );
}

export default AdminProductsPage;