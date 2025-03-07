import { useEffect, useState } from "react";
import ordersService from "../../services/orders-service";
import Spinner from "../../components/Spinner";
import ProfileTable from "../../components/ProfileTable";
import { useTranslation } from "react-i18next";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        async function getUserOrders() {
            setLoading(true);
            const userOrders = await ordersService.getOrdersByUser();
            setOrders(userOrders);
            setLoading(false);
        }

        getUserOrders();
    }, []);

    if (loading) {
        return (
            <div id="profile-spinner">
                <Spinner />
            </div>
        )
    }

    return (
        <div id="profile-orders">
            <h6>{t("profile.orders.title")}</h6>

            <ProfileTable orders={orders} />
        </div>
    );
}

export default OrdersPage;