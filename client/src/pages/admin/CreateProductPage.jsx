import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import AdminProductForm from "../../components/AdminProductForm";

const CreateProductPage = () => {
    const navigate = useNavigate();
    const { getErrorAndDisplay } = useContext(appContext);
    const { setProducts } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const productToAdd = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.addOne(productToAdd);

        if (error) {
            getErrorAndDisplay(error);
            setLoading(false);
            return;
        }

        setProducts(prev => {
            prev.push(data.data);
            return [...prev];
        });

        getErrorAndDisplay(data.message);
        navigate("/products");
        setLoading(false);
    }

    return (
        <AdminProductForm method={"create"} onSubmit={onSubmit} loading={loading} />
    );
}

export default CreateProductPage;