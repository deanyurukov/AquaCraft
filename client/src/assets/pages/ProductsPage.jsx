import { useState, useEffect, useContext } from "react";
import productsService from "../services/products-service.js";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { appContext } from "../../App.jsx";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProductsPage = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const update = useContext(appContext)[4];
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [productsPerPage, setProductsPerPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();

    async function getProducts() {
        setLoading(true);

        const products = await productsService.getAll();
        setProducts(products);

        setLoading(false);
    }

    useEffect(() => {
        getProducts();
    }, [update]);

    useEffect(() => {
        const filter = Object.fromEntries(searchParams);

        if (filter.page) {
            const maximumPages = Math.ceil(products.length / productsPerPage);

            if (products.length > 0) {
                if (Number(filter.page) > maximumPages || Number(filter.page) <= 0) {
                    setCurrentPage(1);
                    navigate(`/products?page=${1}`);
                }
                else {
                    setCurrentPage(Number(filter.page));
                }
            }
        }
    }, [searchParams, products]);

    if (loading) {
        return <Spinner />;
    }

    const indexLastProduct = currentPage * productsPerPage;
    const indexFirstProduct = indexLastProduct - productsPerPage;
    const currentProducts = products.slice(indexFirstProduct, indexLastProduct);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`/products?page=${pageNumber}`);
    };

    return (
        <div id="products">
            <h1>{t("products.title")}</h1>

            <div className="products-wrapper">
                {
                    currentProducts.map(product => (
                        <ProductCard product={product} getProducts={getProducts} key={product._id} />
                    ))
                }
            </div>

            <Pagination totalProducts={products.length} productsPerPage={productsPerPage} paginate={paginate} currentPage={currentPage} />
        </div>
    );
}

export default ProductsPage;