import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CheckoutInput from "../../components/CheckoutInput";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import Spinner from "../../components/Spinner";
import CreateSelect from "../../components/CreateSelect";

const EditProductPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);

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
        const getData = async () => {
            setLoading(true);
            const product = await productsService.getOne(id);
            setProduct(product);
            setLoading(false);
        };

        getData();
    }, []);

    if (loading) {
        return <div id="profile-spinner">
            <Spinner />
        </div>;
    }

    return (
        <div id="edit">
            <h1>{t("admin.edit.title")}</h1>

            <div className="content">
                <form onSubmit={onSubmit}>
                    <CheckoutInput label={`${t("admin.create.name")}*`} name={"title"} value={product.title} />
                    <CheckoutInput label={`${t("admin.create.image")}*`} name={"images"} value={product.images?.join(", ")} />
                    <CheckoutInput label={`${t("admin.create.price")}*`} name={"price"} value={product.price} />
                    <CheckoutInput label={`${t("admin.create.inStock")}*`} name={"inStock"} type={"number"} min={0} value={product.inStock} />

                    <CreateSelect defaultValues={product} />

                    <div>
                        <label htmlFor="description">{t("admin.create.description")}*</label>
                        <textarea name="description" id="description" defaultValue={product.description}></textarea>
                    </div>

                    <button type="submit">{t("admin.edit.submit")}</button>
                </form>
            </div>
        </div>
    );
}

export default EditProductPage;