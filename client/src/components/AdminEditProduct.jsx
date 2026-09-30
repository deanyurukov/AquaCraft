import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const AdminEditProduct = ({ product, deleteProduct }) => {
    const { t } = useTranslation();

    return (
        <div>
            <h4>{product.title}</h4>

            <Link to={`/admin/${product._id}/edit`} className="edit">{t("admin.editAll.title")}</Link>
            <button onClick={() => deleteProduct(product._id)} className="delete">{t("admin.editAll.delete")}</button>
        </div>
    );
}

export default AdminEditProduct;