import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import productsService from "../../services/products-service";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminEditProduct from "../../components/AdminEditProduct";

const AdminEditAll = () => {
    const [products, setProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    async function getProducts() {
        setLoading(true);

        const products = await productsService.getAll();
        setProducts(products);
        setDisplayProducts(products);

        setLoading(false);
    }

    function onSearch(e) {
        setSearch(e.target.value);
    }

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        setDisplayProducts(prev => prev = [...products].filter(product => product.title.toLowerCase().includes(search.toLowerCase())));
        navigate(`/admin/edit?search=${search}`);
    }, [search]);

    useEffect(() => {
        const filter = Object.fromEntries(searchParams);

        if (filter.search) {
            setSearch(filter.search);
            setDisplayProducts(prev => prev = [...products].filter(product => product.title.toLowerCase().includes(filter.search.toLowerCase())));
        }
    }, [searchParams, products]);

    if (loading) {
        return <div id="profile-spinner">
            <Spinner />
        </div>;
    }

    return (
        <div id="admin-products">
            <span>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input onChange={onSearch} type="text" name="search" id="search" value={search} placeholder={`${t("admin.editAll.search")}...`} />
            </span>

            {displayProducts.map(product => (
                <AdminEditProduct product={product} getProducts={getProducts} key={product._id} />
            ))}
        </div>
    );
}

export default AdminEditAll;