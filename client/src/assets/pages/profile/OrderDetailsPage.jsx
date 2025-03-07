import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ordersService from "../../services/orders-service";
import Spinner from "../../components/Spinner";
import { calculateTotalPrice } from "../../services/helpers";
import OrderProduct from "../../components/OrderProduct";
import { appContext } from "../../../App";
import GoBackArrow from "../../components/GoBackArrow";
import { useTranslation } from "react-i18next";

const OrderDetailsPage = () => {
    const [order, setOrder] = useState({
        orderData: []
    });
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    const update = useContext(appContext)[4];
    const { t } = useTranslation();

    async function getOrder() {
        setLoading(true);
        const order = await ordersService.getOrderById(id);

        if (!order) {
            navigate(-1);
        }

        setOrder(order);
        getPrice();
        setLoading(false);

        function getPrice() {
            let combined = calculateTotalPrice(order.orderData);
            setPrice(combined);
        }
    }

    useEffect(() => {
        getOrder();
    }, [update]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div id="profile-order">
            <GoBackArrow />

            <div className="order-summary">
                <div>
                    <h3>{t("profile.orderDetails.id")}</h3>
                    <h4>{order._id}</h4>
                </div>

                <div>
                    <h2>${price.toFixed(2)}</h2>
                </div>
            </div>

            <div className="order-data">
                <table>
                    <thead>
                        <tr>
                            <th>{t("profile.orderDetails.userDetails.name")}</th>
                            <th>{t("profile.orderDetails.userDetails.email")}</th>
                            <th>{t("profile.orderDetails.userDetails.phone")}</th>
                            <th>{t("profile.orderDetails.userDetails.city")}</th>
                            <th>{t("profile.orderDetails.userDetails.courier")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>{String(order.town)[0].toUpperCase() + String(order.town).slice(1)}</td>
                            <td>{order.deliveryWay}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="order-products">
                <table>
                    <thead>
                        <tr>
                            <th>{t("profile.orderDetails.productDetails.image")}</th>
                            <th>{t("profile.orderDetails.productDetails.name")}</th>
                            <th>{t("profile.orderDetails.productDetails.quantity")}</th>
                            <th>{t("profile.orderDetails.productDetails.price")}</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order.orderData.map(({ product, quantity }) => (
                                <OrderProduct product={product} quantity={quantity} getOrder={getOrder} key={product._id} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderDetailsPage;