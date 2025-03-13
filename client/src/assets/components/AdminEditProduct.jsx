import { useTranslation } from "react-i18next";
import productsService from "../services/products-service";
import { useContext } from "react";
import { appContext } from "../../App";

const AdminEditProduct = ({ product, getProducts }) => {
    const { t } = useTranslation();
    const getErrorAndDisplay = useContext(appContext)[6];

    const onDelete = async () => {
        if (confirm(t("admin.editAll.deleteMsg"))) {
            const [data, error] = await productsService.delete(product._id);
    
            if (! data) {
                getErrorAndDisplay(error);
            }
    
            getProducts();
        }

    }

    return (
        <div>
            <h4>{product.title}</h4>

            <button className="edit">{t("admin.editAll.title")}</button>
            <button onClick={onDelete} className="delete">{t("admin.editAll.delete")}</button>
        </div>
    );
}

export default AdminEditProduct;