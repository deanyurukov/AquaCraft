import { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CheckoutInput from "../../components/CheckoutInput";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import CreateSelect from "../../components/CreateSelect";
import CreateImage from "../../components/CreateImage";

const CreateProductPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getErrorAndDisplay } = useContext(appContext);
    const { setProducts } = useOutletContext();

    async function onSubmit(e) {
        e.preventDefault();

        const productToAdd = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.addOne(productToAdd);

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        setProducts(prev => {
            prev.push(data.data);
            return [...prev];
        });

        getErrorAndDisplay(data.message);
        navigate("/products");
    }

    return (
        <div id="create">
            <h1>{t("admin.create.title")}</h1>

            <div className="content">
                <form onSubmit={onSubmit}>
                    <CheckoutInput label={`${t("admin.create.name")}*`} name={"title"} />
                    <CreateImage />
                    <CheckoutInput label={`${t("admin.create.price")}*`} name={"price"} />
                    <CheckoutInput label={`${t("admin.create.inStock")}*`} name={"inStock"} type={"number"} min={0} />

                    <CreateSelect />

                    <div>
                        <label htmlFor="description">{t("admin.create.description")}*</label>
                        <textarea name="description" id="description"></textarea>
                    </div>

                    <button className="primary link" type="submit">{t("admin.create.submit")}</button>
                </form>
            </div>
        </div>
    );
}

export default CreateProductPage;