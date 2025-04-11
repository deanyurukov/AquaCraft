import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CheckoutInput from "../../components/CheckoutInput";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import CreateSelect from "../../components/CreateSelect";

const CreateProductPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];

    async function onSubmit(e) {
        e.preventDefault();

        const { title, images, price, description, inStock, company, type, typeDetails } = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.addOne(title, images, price, description, inStock, company, type, typeDetails);

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        getErrorAndDisplay(data.message);
        navigate("/products");
    }

    return (
        <div id="create">
            <h1>{t("admin.create.title")}</h1>

            <div className="content">
                <form onSubmit={onSubmit}>
                    <CheckoutInput label={`${t("admin.create.name")}*`} name={"title"} />
                    <CheckoutInput label={`${t("admin.create.image")}*`} name={"images"} />
                    <CheckoutInput label={`${t("admin.create.price")}*`} name={"price"} />
                    <CheckoutInput label={`${t("admin.create.inStock")}*`} name={"inStock"} type={"number"} min={0} />

                    <CreateSelect />

                    <div>
                        <label htmlFor="description">{t("admin.create.description")}*</label>
                        <textarea name="description" id="description"></textarea>
                    </div>

                    <button type="submit">{t("admin.create.submit")}</button>
                </form>
            </div>
        </div>
    );
}

export default CreateProductPage;