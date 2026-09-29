import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { changeImage } from "../services/helpers.js";

import GoBackArrow from "../components/GoBackArrow.jsx";
import { useTranslation } from "react-i18next";

const DetailsPage = () => {
    const { id } = useParams();
    const [productData, setProductData] = useState({});
    const { products, user, likeProduct, unlikeProduct, addToCart } = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeUrl, setActiveUrl] = useState(null);
    const [isInStock, setIsInStock] = useState(true);

    async function loadProduct() {
        const product = products.find(p => p._id === id);

        if (!product) {
            navigate(-1);
        }

        setProductData(product);
        setActiveUrl(product.images[0]);
        setIsInStock(product.inStock > 0);
    }

    useEffect(() => {
        loadProduct();
    }, []);

    return (
        <div id="details">
            <GoBackArrow />

            <div className="details-wrapper">
                <div className="images">
                    <img onError={changeImage} src={activeUrl ? activeUrl : null} alt={productData.title} />

                    <div className="more-images">
                        {
                            productData.images?.length > 0 &&
                            productData?.images.map(img => (
                                <img key={img} onClick={() => setActiveUrl(img)} onError={changeImage} src={img} />
                            ))
                        }
                    </div>
                </div>

                <div className="content-wrapper">
                    <div>
                        <h3>{productData.title}</h3>

                        {
                            user?.favorites.includes(productData._id) ?
                                <i onClick={() => {
                                    unlikeProduct(productData._id)
                                }} className="fa-solid fa-heart fill"></i> :
                                <i onClick={() => {
                                    likeProduct(productData._id)
                                }} className="fa-regular fa-heart"></i>
                        }
                    </div>
                    <div>
                        <h4>€{Number(productData.price).toFixed(2)}</h4>
                        <p className={!isInStock ? "no-stock" : ""}>{isInStock ? t("details.inStock") : t("details.noStock")}</p>
                    </div>
                    <hr />
                    <p>{productData.description}</p>
                    <Link className="primary link" onClick={(e) => {
                        e.preventDefault();
                        addToCart(productData._id);
                    }}>{t(`products.buy`)}</Link>
                </div>
            </div>
        </div>
    )
}

export default DetailsPage;