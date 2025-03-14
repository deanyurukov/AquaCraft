import { useTranslation } from "react-i18next";
import productsService from "../services/products-service";
import { useContext } from "react";
import { appContext } from "../../App";
import { Link } from "react-router-dom";

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

            <Link to={`/admin/${product._id}/edit`} className="edit">{t("admin.editAll.title")}</Link>
            <button onClick={onDelete} className="delete">{t("admin.editAll.delete")}</button>
        </div>
    );
}

export default AdminEditProduct;