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
    const [productsPerPage, setProductsPerPage] = useState(6);
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
            <div id="products-nav">
                <div className="titlebar">
                    <div className="nav-item">
                        <p>Company</p>
                        <div className="dropdown">
                            <p>Hunter</p>
                            <p>Rain Bird</p>
                            <p>Rain S.P.A.</p>
                            <p>Irritec</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Timers</p>
                        <div className="dropdown">
                            <p>Modular timers</p>
                            <p>WIFI Timers</p>
                            <p>2-Wire Controllers</p>
                            <p>Battery Operated</p>
                            <p>Rain & Moisture Sensors</p>
                            <p>Parts & Accessories</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Sprinklers</p>
                        <div className="dropdown">
                            <p>Spray heads</p>
                            <p>Nozzles</p>
                            <p>Rotary nozzles</p>
                            <p>Rotors</p>
                            <p>Impact sprinklers</p>
                            <p>Hose and Sprinklers</p>
                            <p>Parts & Accessories</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Valves</p>
                        <div className="dropdown">
                            <p>Sprinkler Valves</p>
                            <p>Valve Boxes</p>
                            <p>Parts & Accessories</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Drip</p>
                        <div className="dropdown">
                            <p>Root Watering Systems</p>
                            <p>Zone Control</p>
                            <p>Filters, Valves & Pressure Regulators</p>
                            <p>Drippers, Emitters & Microsprays</p>
                            <p>Transmission & Blank Tubing</p>
                            <p>Fittings, Stakes & Connectors</p>
                            <p>Tools, Parts & Accessories</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Bundles & Kits</p>
                        <div className="dropdown">
                            <p>Bundles by Application</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Exclusive</p>
                        <div className="dropdown">
                            <p>Valve Manifolds</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p>Parts & Tools</p>
                        <div className="dropdown">
                            <p>Sprinkler Parts</p>
                            <p>Timer Parts</p>
                            <p>Valve Parts</p>
                            <p>Drip Irrigation Accessories</p>
                        </div>
                    </div>
                </div>
            </div>

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