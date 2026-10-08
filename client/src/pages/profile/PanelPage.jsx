import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import ordersService from "../../services/orders-service";
import Spinner from "../../components/Spinner";
import ProfileTable from "../../components/ProfileTable";
import { useTranslation } from "react-i18next";

const PanelPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { user } = useOutletContext();

    async function getUserOrders() {
        setLoading(true);
        const userOrders = (await ordersService.getOrdersByUser()).slice(0, 3);
        setOrders(userOrders);
        setLoading(false);
    }

    useEffect(() => {
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
        <div id="profile-panel">
            <h5>{t("profile.panel.message")}, <span>{user.username}</span>!</h5>

            <div>
                <h6>{t("profile.panel.data")}</h6>

                <div>
                    <i className="fa-solid fa-address-card"></i>
                    <p>{user.username}</p>
                </div>

                <div>
                    <i className="fa-solid fa-envelope"></i>
                    <p>{user.email}</p>
                </div>

                <Link className="primary link" to="/profile/user-data">{t("profile.panel.change")}</Link>
            </div>

            <div>
                <h6>{t("profile.panel.orders")}</h6>

                <ProfileTable orders={orders} />
            </div>
        </div>
    );
}

export default PanelPage;