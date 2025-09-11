import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import productsService from "../../services/products-service";
import AdminProduct from "../../components/AdminProduct";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
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

    function onFilter(e) {
        setFilter(e.target.value);
    }

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        let tempProducts = [...products];

        tempProducts = tempProducts.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));

        if (filter === "1_2") {
            tempProducts = tempProducts.filter(product => product.inStock === 1 || product.inStock === 2);
        }

        if (filter === "0") {
            tempProducts = tempProducts.filter(product => product.inStock === 0);
        }
        if (filter === "lt_0") {
            tempProducts = tempProducts.filter(product => product.inStock < 0);
        }

        setDisplayProducts(tempProducts);
        updateURL();
    }, [search, filter, products]);

    useEffect(() => {
        const filter = Object.fromEntries(searchParams);

        if (filter.search) {
            setSearch(filter.search);
        }

        if (filter.filter) {
            setFilter(filter.filter);
        }
    }, [searchParams, products]);

    const updateURL = () => {
        const params = new URLSearchParams();

        if (search !== "") params.set('search', search);
        if (filter !== "all") params.set('filter', filter);

        navigate(`/admin/products?${params.toString()}`);
    };

    const changeStock = (productId, newStock) => {
        const index = displayProducts.indexOf(displayProducts.find(product => product._id === productId));
        
        setDisplayProducts(prev => {
            prev[index].inStock += Number(newStock);
            return [...prev];
        });
    }

    const exportData = async () => {
        await productsService.export();
    }

    if (loading) {
        return <div id="profile-spinner">
            <Spinner />
        </div>;
    }

    return (
        <div id="admin-products">
            <div id="filter">
               <span>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input onChange={onSearch} type="text" name="search" id="search" value={search} placeholder={`${t("admin.products.search")}...`} />
                </span>

                <select name="filter" id="filter" value={filter} onChange={onFilter}>
                    <option value="all">{t("admin.products.all")}</option>
                    <option value="1_2">1 / 2</option>
                    <option value="0">0</option>
                    <option value="lt_0">&lt; 0</option>
                </select>
            </div>

            <button onClick={exportData}>Export to excel</button>

            {
                displayProducts.length === 0 ? <p>{t("products.empty")}</p> :
                displayProducts.map(product => (
                    <AdminProduct product={product} changeStock={changeStock} key={product._id} />
                ))}
        </div>
    );
}

export default AdminProductsPage;