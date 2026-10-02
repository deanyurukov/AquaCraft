import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { appContext } from "../../App";
import productsService from "../../services/products-service";
import AdminProductForm from "../../components/AdminProductForm";

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getErrorAndDisplay } = useContext(appContext);
    const [product, setProduct] = useState([]);
    const { products, setProducts } = useOutletContext();

    async function onSubmit(e) {
        e.preventDefault();

        const productToEdit = Object.fromEntries(new FormData(e.currentTarget));

        const [data, error] = await productsService.changeOne(productToEdit, product._id);

        if (error) {
            getErrorAndDisplay(error);
            return;
        }

        const index = products.findIndex(p => p._id === product._id);
        if (index === -1) return;

        setProducts(prev => {
            prev.splice(index, 1, data.data);
            return [...prev];
        });

        navigate("/admin/edit");
    }

    useEffect(() => {
        setProduct(products.find(p => p._id === id));
    }, []);

    return (
        <AdminProductForm method={"edit"} product={product} onSubmit={onSubmit} />
    );
}

export default EditProductPage;