import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import productsService from "../services/products-service.js";
import { changeImage } from "../services/helpers.js";
import Spinner from "../components/Spinner.jsx";
import { appContext } from "../../App.jsx";
import GoBackArrow from "../components/GoBackArrow.jsx";

const DetailsPage = () => {
    const { id } = useParams();
    const [productData, setProductData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const update = useContext(appContext)[4];
    const getErrorAndDisplay = useContext(appContext)[6];

    async function fetchProductData() {
        setLoading(true);
        const product = await productsService.getOne(id);

        if (!product) {
            navigate(-1);
        }

        setProductData(product);
        setLoading(false);
    }

    useEffect(() => {
        fetchProductData();
    }, [update]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div id="details">
            <GoBackArrow />
            <div className="details-wrapper">
                <img onError={changeImage} src={productData.imageUrl} alt={productData.title} />

                <div className="content-wrapper">
                    <div>
                        <h3>{productData.title}</h3>

                        {
                            productData.isFav ?
                                <i onClick={async () => {
                                    const [data, error] = await productsService.removeFromFavorites(productData._id);

                                    if (!data) {
                                        getErrorAndDisplay(error);
                                        return;
                                    }

                                    fetchProductData();
                                }} className="fa-solid fa-heart fill"></i> :
                                <i onClick={async () => {
                                    const [data, error] = await productsService.addToFavorites(productData._id);

                                    if (!data) {
                                        getErrorAndDisplay(error);
                                        return;
                                    }

                                    fetchProductData();
                                }} className="fa-regular fa-heart"></i>
                        }
                    </div>
                    <h4>${Number(productData.price).toFixed(2)}</h4>
                    <hr />
                    <p>{productData.description}</p>
                    <Link onClick={async () => {
                        const [data, error] = await productsService.addToCart(productData._id);

                        if (!data) {
                            getErrorAndDisplay(error);
                            return;
                        }
                        else {
                            navigate("/cart");
                        }
                    }}>Купи</Link>

                </div>
            </div>
        </div>
    )
}

export default DetailsPage;