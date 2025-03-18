import { useState, useEffect, useContext } from "react";
import productsService from "../services/products-service.js";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { appContext } from "../../App.jsx";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductsFilter from "../components/ProductsFilter.jsx";

const ProductsPage = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const update = useContext(appContext)[4];
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [productsPerPage, setProductsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState([]);

    async function getProducts() {
        setLoading(true);

        const products = await productsService.getAll();
        setProducts(products);
        setDisplayProducts(products);

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
                }
                else {
                    setCurrentPage(Number(filter.page));
                }
            }
        }

        if (filter.filters) {
            const filtersFromURL = filter.filters.split('-');
            setFilters(filtersFromURL);
        }
    }, [searchParams, products, productsPerPage]);

    const updateURL = () => {
        const params = new URLSearchParams();

        params.set('filters', filters.join('-'));

        const maximumPages = Math.ceil(displayProducts.length / productsPerPage);

        if (Number(currentPage) > maximumPages || Number(currentPage) <= 0) {
            setCurrentPage(1);
        }

        params.set('page', currentPage);

        navigate(`/products?${params.toString()}`);
    };

    const indexLastProduct = currentPage * productsPerPage;
    const indexFirstProduct = indexLastProduct - productsPerPage;
    const currentProducts = displayProducts.slice(indexFirstProduct, indexLastProduct);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        updateURL();
    };

    function addFilter(filterName) {
        setFilters(prev => {
            if (!prev.includes(filterName)) {
                prev.push(filterName);
            }

            return [...prev];
        });
    };

    function removeFilter(filterName) {
        setFilters(prev => {
            if (prev.includes(filterName)) {
                const filterIndex = prev.indexOf(filterName);
                prev.splice(filterIndex, 1);
            }

            return [...prev];
        });
    }

    useEffect(() => {
        setDisplayProducts(() => {
            if (filters.length === 0) {
                return [...products];
            }

            const selectedCompanies = filters.filter(filter =>
                products.some(product => product.company === filter)
            );

            const selectedTypes = filters.filter(filter =>
                products.some(product => product.type === filter)
            );

            const selectedTypeDetails = filters.filter(filter =>
                products.some(product => product.typeDetails === filter)
            );

            const filteredProducts = products.filter(product => {
                const matchesCompany = selectedCompanies.includes(product.company);
                const matchesType = selectedTypes.includes(product.type);
                const matchesTypeDetails = selectedTypeDetails.includes(product.typeDetails);

                if (selectedCompanies.length > 0 && selectedTypes.length > 0 && selectedTypeDetails.length > 0) {
                    return matchesCompany && matchesType && matchesTypeDetails;
                }

                if (selectedCompanies.length > 0 && selectedTypes.length > 0) {
                    return matchesCompany && matchesType;
                }

                if (selectedCompanies.length > 0 && selectedTypeDetails.length > 0) {
                    return matchesCompany && matchesTypeDetails;
                }

                if (selectedTypes.length > 0 && selectedTypeDetails.length > 0) {
                    return matchesType && matchesTypeDetails;
                }

                if (selectedCompanies.length > 0) {
                    return matchesCompany;
                }

                if (selectedTypes.length > 0) {
                    return matchesType;
                }

                if (selectedTypeDetails.length > 0) {
                    return matchesTypeDetails;
                }

                return false;
            });

            return filteredProducts.length > 0 ? filteredProducts : [];
        });

        updateURL();
    }, [filters, products, currentPage]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div id="products">
            <div id="products-nav">
                <div className="titlebar">
                    <div className="nav-item">
                        <p>{t("products.products-nav.titlebar.nav-items.0.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("hunter")}>Hunter</p>
                            <p onClick={() => addFilter("rainBird")}>Rain Bird</p>
                            <p onClick={() => addFilter("rainSpa")}>Rain S.P.A.</p>
                            <p onClick={() => addFilter("irritec")}>Irritec</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("timers")}>{t("products.products-nav.titlebar.nav-items.1.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("modular")}>{t("products.products-nav.titlebar.nav-items.1.dropdown.0")}</p>
                            <p onClick={() => addFilter("wifi")}>{t("products.products-nav.titlebar.nav-items.1.dropdown.1")}</p>
                            <p onClick={() => addFilter("wire")}>{t("products.products-nav.titlebar.nav-items.1.dropdown.2")}</p>
                            <p onClick={() => addFilter("battery")}>{t("products.products-nav.titlebar.nav-items.1.dropdown.3")}</p>
                            <p onClick={() => addFilter("rain")}>{t("products.products-nav.titlebar.nav-items.1.dropdown.4")}</p>
                            <p onClick={() => addFilter("timers_parts")}>{t("products.products-nav.titlebar.nav-items.1.dropdown.5")}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("sprinklers")}>{t("products.products-nav.titlebar.nav-items.2.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("spray")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.0")}</p>
                            <p onClick={() => addFilter("nozzles")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.1")}</p>
                            <p onClick={() => addFilter("rotary")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.2")}</p>
                            <p onClick={() => addFilter("rotors")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.3")}</p>
                            <p onClick={() => addFilter("impact")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.5")}</p>
                            <p onClick={() => addFilter("hose")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.4")}</p>
                            <p onClick={() => addFilter("sprinklers_parts")}>{t("products.products-nav.titlebar.nav-items.2.dropdown.6")}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("valves")}>{t("products.products-nav.titlebar.nav-items.3.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("sprinkler")}>{t("products.products-nav.titlebar.nav-items.3.dropdown.0")}</p>
                            <p onClick={() => addFilter("boxes")}>{t("products.products-nav.titlebar.nav-items.3.dropdown.1")}</p>
                            <p onClick={() => addFilter("valves_parts")}>{t("products.products-nav.titlebar.nav-items.3.dropdown.2")}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("drip")}>{t("products.products-nav.titlebar.nav-items.4.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("root")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.0")}</p>
                            <p onClick={() => addFilter("zone")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.1")}</p>
                            <p onClick={() => addFilter("filters")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.2")}</p>
                            <p onClick={() => addFilter("drippers")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.3")}</p>
                            <p onClick={() => addFilter("transmissions")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.4")}</p>
                            <p onClick={() => addFilter("fittings")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.5")}</p>
                            <p onClick={() => addFilter("drip_parts")}>{t("products.products-nav.titlebar.nav-items.4.dropdown.6")}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("bundles")}>{t("products.products-nav.titlebar.nav-items.5.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("application")}>{t("products.products-nav.titlebar.nav-items.5.dropdown.0")}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("exclusive")}>{t("products.products-nav.titlebar.nav-items.6.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("manifolds")}>{t("products.products-nav.titlebar.nav-items.6.dropdown.0")}</p>
                        </div>
                    </div>
                    <div className="nav-item">
                        <p onClick={() => addFilter("parts")}>{t("products.products-nav.titlebar.nav-items.7.label")}</p>
                        <div className="dropdown">
                            <p onClick={() => addFilter("sprinkler_parts")}>{t("products.products-nav.titlebar.nav-items.7.dropdown.0")}</p>
                            <p onClick={() => addFilter("timers_parts")}>{t("products.products-nav.titlebar.nav-items.7.dropdown.1")}</p>
                            <p onClick={() => addFilter("valve_parts")}>{t("products.products-nav.titlebar.nav-items.7.dropdown.2")}</p>
                            <p onClick={() => addFilter("drip_parts")}>{t("products.products-nav.titlebar.nav-items.7.dropdown.3")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="products-filter">
                {
                    filters.length > 0 &&
                    filters.map(filter => (
                        <ProductsFilter key={filter} filter={filter} removeFilter={removeFilter} />
                    ))
                }
            </div>

            <h1>{t("products.title")}</h1>

            {
                displayProducts.length === 0 ? <p>{t("products.empty")}</p> :
                    <>
                        <div className="products-wrapper">
                            {
                                currentProducts.map(product => (
                                    <ProductCard product={product} getProducts={getProducts} key={product._id} />
                                ))
                            }
                        </div>

                        <Pagination totalProducts={displayProducts.length} productsPerPage={productsPerPage} paginate={paginate} currentPage={currentPage} />
                    </>
            }
        </div>
    );
}

export default ProductsPage;