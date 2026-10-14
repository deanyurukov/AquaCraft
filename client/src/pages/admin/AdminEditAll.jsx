import { useContext, useEffect, useState } from "react";
import productsService from "../../services/products-service";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import AdminEditProduct from "../../components/AdminEditProduct";
import { appContext } from "../../App";

const AdminEditAll = () => {
    const { products, setProducts } = useOutletContext();
    const [displayProducts, setDisplayProducts] = useState([]);
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { getErrorAndDisplay } = useContext(appContext);

    function onSearch(e) {
        setSearch(e.target.value);
    }

    useEffect(() => {
        setDisplayProducts(products);
    }, []);

    useEffect(() => {
        let tempProducts = [...products];

        tempProducts = tempProducts.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));

        setDisplayProducts(tempProducts);
        updateURL();
    }, [search, products]);

    useEffect(() => {
        const filter = Object.fromEntries(searchParams);

        if (filter.search) {
            setSearch(filter.search);
        }
    }, [searchParams, products]);

    const updateURL = () => {
        const params = new URLSearchParams();

        if (search !== "") params.set('search', search);

        navigate(`/admin/edit?${params.toString()}`);
    };

    const deleteProduct = async (productId) => {
        if (confirm(t("admin.editAll.deleteMsg"))) {
            if (loading) return;
            setLoading(true);

            const [data, error] = await productsService.delete(productId);

            if (error) {
                getErrorAndDisplay(error);
                setLoading(false);
                return;
            }

            const index = products.findIndex(p => p._id === productId);

            setProducts(prev => {
                if (index !== -1) {
                    prev.splice(index, 1);
                }

                return [...prev];
            });

            setLoading(false);
        }
    }

    return (
        <div id="admin-products">
            <span>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input className="item" onChange={onSearch} type="text" name="search" id="search" value={search} placeholder={`${t("admin.editAll.search")}...`} />
            </span>

            {
                displayProducts.length === 0 ?
                    <p>{t("products.empty")}</p> :
                    displayProducts.map(product => (
                        <AdminEditProduct key={product._id} product={product} deleteProduct={deleteProduct} />
                    ))
            }
        </div>
    );
}

export default AdminEditAll;