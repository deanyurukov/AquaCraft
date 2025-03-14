import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../../services/auth-service";
import CheckoutInput from "../../components/CheckoutInput";
import { appContext } from "../../../App";
import productsService from "../../services/products-service";

const CreateProductPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];

    async function onSubmit(e) {
        e.preventDefault();

        const { title, imageUrl, price, description, inStock } = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.addOne(title, imageUrl, price, description, inStock);

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
                    <CheckoutInput label={`${t("admin.create.image")}*`} name={"imageUrl"} />
                    <CheckoutInput label={`${t("admin.create.price")}*`} name={"price"} />
                    <CheckoutInput label={`${t("admin.create.inStock")}*`} name={"inStock"} type={"number"} min={0} />

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