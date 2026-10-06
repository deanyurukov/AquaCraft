import { useTranslation } from "react-i18next";
import Input from "./Input";
import CreateImage from "./CreateImage";
import CreateSelect from "./CreateSelect";

const AdminProductForm = ({ method, onSubmit, loading, product = {} }) => {
    const { t } = useTranslation();

    return (
        <div className="admin-forms">
            <h1>{t(`admin.${method}.title`)}</h1>

            <div className="content">
                <form onSubmit={onSubmit}>
                    <Input label={`${t("admin.create.name")}*`} name={"title"} value={product.title} />
                    <CreateImage defaultValues={product.images || []} />
                    <Input label={`${t("admin.create.price")}*`} name={"price"} value={product.price} />
                    <Input label={`${t("admin.create.inStock")}*`} name={"inStock"} type={"number"} min={0} value={product.inStock} />

                    <CreateSelect defaultValues={product} />

                    <div className="form-item">
                        <label htmlFor="description">{t("admin.create.description")}*</label>
                        <textarea className="item" name="description" id="description" defaultValue={product.description}></textarea>
                    </div>

                    <button disabled={loading} className="link primary" type="submit">{loading ? t("common.loading") : t(`admin.${method}.submit`)}</button>
                </form>
            </div>
        </div>
    );
}

export default AdminProductForm;