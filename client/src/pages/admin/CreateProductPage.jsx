import { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import AdminProductForm from "../../components/AdminProductForm";

const CreateProductPage = () => {
    const navigate = useNavigate();
    const { getErrorAndDisplay } = useContext(appContext);
    const { setProducts } = useOutletContext();

    async function onSubmit(e) {
        e.preventDefault();

        const productToAdd = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.addOne(productToAdd);

        if (error) {
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
        <AdminProductForm method={"create"} onSubmit={onSubmit} />
    );
}

export default CreateProductPage;