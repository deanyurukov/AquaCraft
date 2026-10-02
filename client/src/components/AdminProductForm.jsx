import { useTranslation } from "react-i18next";
import CheckoutInput from "./CheckoutInput";
import CreateImage from "./CreateImage";
import CreateSelect from "./CreateSelect";

const AdminProductForm = ({ method, onSubmit, product = {} }) => {
    const { t } = useTranslation();

    return (
        <div className="admin-forms">
            <h1>{t(`admin.${method}.title`)}</h1>

            <div className="content">
                <form onSubmit={onSubmit}>
                    <CheckoutInput label={`${t("admin.create.name")}*`} name={"title"} value={product.title} />
                    <CreateImage defaultValues={product.images} />
                    <CheckoutInput label={`${t("admin.create.price")}*`} name={"price"} value={product.price} />
                    <CheckoutInput label={`${t("admin.create.inStock")}*`} name={"inStock"} type={"number"} min={0} value={product.inStock} />

                    <CreateSelect defaultValues={product} />

                    <div>
                        <label htmlFor="description">{t("admin.create.description")}*</label>
                        <textarea name="description" id="description" defaultValue={product.description}></textarea>
                    </div>

                    <button className="primary link" type="submit">{t(`admin.${method}.submit`)}</button>
                </form>
            </div>
        </div>
    );
}

export default AdminProductForm;