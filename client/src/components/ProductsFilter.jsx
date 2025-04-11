import { useTranslation } from "react-i18next";

const ProductsFilter = ({ filter, removeFilter }) => {
    const { t } = useTranslation();

    return (
        <div>
            <p>{t(`products.products-nav.filters.${filter}`)}</p>
            <button onClick={() => removeFilter(filter)}><i className="fa-solid fa-xmark"></i></button>
        </div>
    );
}

export default ProductsFilter;