import { useEffect, useState } from "react";
import productsService from "../../services/products-service";
import AdminProduct from "../../components/AdminProduct";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import SelectInput from "../../components/SelectInput";

const AdminStockPage = () => {
    const [displayProducts, setDisplayProducts] = useState([]);
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { products, setProducts } = useOutletContext();

    function onSearch(e) {
        setSearch(e.target.value);
    }

    function onFilter(e) {
        setFilter(e.target.value);
    }

    useEffect(() => {
        setDisplayProducts(products);
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

        navigate(`/admin/stock?${params.toString()}`);
    };

    const changeStock = (productId, newStock) => {
        const index = products.findIndex(product => product._id === productId);

        setProducts(prev => {
            prev[index].inStock += Number(newStock);
            return [...prev];
        });
    }

    const exportData = async () => {
        await productsService.export();
    }

    return (
        <div id="admin-products">
            <div id="filter">
                <span>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input className="item" onChange={onSearch} type="text" name="search" id="search" value={search} placeholder={`${t("admin.products.search")}...`} />
                </span>

                <SelectInput
                    name="filter"
                    value={filter}
                    onChange={onFilter}
                    options={[
                        { val: "all", text: t("admin.products.all") },
                        { val: "1_2", text: "1 / 2" },
                        { val: "0", text: "0" },
                        { val: "lt_0", text: "< 0" }
                    ]}
                />

                <button onClick={exportData}>{t("admin.products.export")}</button>
            </div>

            {
                displayProducts.length === 0 ? 
                    <p>{t("products.empty")}</p> :
                    displayProducts.map(product => (
                        <AdminProduct product={product} changeStock={changeStock} key={product._id} />
                    ))
            }
        </div>
    );
}

export default AdminStockPage;