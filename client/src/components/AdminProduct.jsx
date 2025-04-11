import { useTranslation } from "react-i18next";
import productsService from "../services/products-service";
import { useContext } from "react";
import { appContext } from "../App";

const AdminProduct = ({ product, getProducts }) => {
    const { t } = useTranslation();
    const getErrorAndDisplay = useContext(appContext)[6];

    const onSubmit = async (formData) => {
        const { changed_stock } = Object.fromEntries(formData);

        if (changed_stock === "") {
            getErrorAndDisplay("allFields");
            return;
        }
        
        if(confirm(t("admin.products.confirm"))) {
            const [data, error] = await productsService.changeInStock(product._id, changed_stock);
    
            if (data) {
                getProducts();
            }
        }
    }

    return (
        <div>
            <h4>{product.title}</h4>
            <p>{t("admin.products.stock")}: {product.inStock}</p>

            <form action={onSubmit}>
                <input type="number" name="changed_stock" id="addedStock" />
                <button>{t("admin.products.change")}</button>
            </form>
        </div>
    );
}

export default AdminProduct;