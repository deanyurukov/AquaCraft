import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CheckoutInput from "../../components/CheckoutInput";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import CreateSelect from "../../components/CreateSelect";
import CreateImage from "../../components/CreateImage";

const EditProductPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getErrorAndDisplay } = useContext(appContext);
    const [product, setProduct] = useState([]);
    const { products, setProducts } = useOutletContext();

    async function onSubmit(e) {
        e.preventDefault();

        const { title, images, price, description, inStock, company, type, typeDetails } = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.changeOne(product._id, title, images, price, description, inStock, company, type, typeDetails);

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        navigate("/admin/edit");
    }

    useEffect(() => {
        setProduct(products.find(p => p._id === id));
    }, []);

    return (
        <div className="admin-forms">
            <h1>{t("admin.edit.title")}</h1>

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

                    <button className="primary link" type="submit">{t("admin.edit.submit")}</button>
                </form>
            </div>
        </div>
    );
}

export default EditProductPage;