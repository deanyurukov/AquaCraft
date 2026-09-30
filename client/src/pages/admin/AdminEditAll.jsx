import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import productsService from "../../services/products-service";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import AdminEditProduct from "../../components/AdminEditProduct";

const AdminEditAll = () => {
    const { products, setProducts } = useOutletContext();
    const [displayProducts, setDisplayProducts] = useState([]);
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    function onSearch(e) {
        setSearch(e.target.value);
    }

    useEffect(() => {
        setDisplayProducts(products);
    }, []);

    useEffect(() => {
        setDisplayProducts(prev => prev = [...products].filter(product => product.title.toLowerCase().includes(search.toLowerCase())));
        navigate(`/admin/edit?search=${search}`);
    }, [search]);

    useEffect(() => {
        const filter = Object.fromEntries(searchParams);
        let temp = [...products];

        if (filter.search) {
            setSearch(filter.search);
            temp.filter(product => product.title.toLowerCase().includes(filter.search.toLowerCase()));
        }

        setDisplayProducts(temp);
    }, [searchParams, products]);

    const deleteProduct = async (productId) => {
        if (confirm(t("admin.editAll.deleteMsg"))) {
            const [data, error] = await productsService.delete(productId);

            if (error) {
                getErrorAndDisplay(error);
            }

            const index = products.findIndex(p => p._id === productId);

            setProducts(prev => {
                if (index !== -1) {
                    prev.splice(index, 1);
                }

                return [...prev];
            });
        }
    }

    return (
        <div id="admin-products">
            <span>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input onChange={onSearch} type="text" name="search" id="search" value={search} placeholder={`${t("admin.editAll.search")}...`} />
            </span>

            {displayProducts.map(product => (
                <AdminEditProduct key={product._id} product={product} deleteProduct={deleteProduct} />
            ))}
        </div>
    );
}

export default AdminEditAll;