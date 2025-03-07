import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ordersService from "../../services/orders-service";
import Spinner from "../../components/Spinner";
import authService from "../../services/auth-service";
import ProfileTable from "../../components/ProfileTable";
import { useTranslation } from "react-i18next";

const PanelPage = () => {
    const [userData, setUserData] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        async function getUser() {
            setLoading(true);
            const user = (await authService.getUserData())[0];
            setUserData(user);
            setLoading(false);
        }

        async function getUserOrders() {
            setLoading(true);
            const userOrders = (await ordersService.getOrdersByUser()).slice(0, 3);
            setOrders(userOrders);
            setLoading(false);
        }

        getUser();
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
            <h5>{t("profile.panel.message")}, <span>{userData.username}</span>!</h5>

            <div>
                <h6>{t("profile.panel.data")}</h6>

                <div>
                    <i className="fa-solid fa-address-card"></i>
                    <p>{userData.username}</p>
                </div>

                <div>
                    <i className="fa-solid fa-envelope"></i>
                    <p>{userData.email}</p>
                </div>

                <Link to="/profile/user-data">{t("profile.panel.change")}</Link>
            </div>

            <div>
                <h6>{t("profile.panel.orders")}</h6>

                <ProfileTable orders={orders} />
            </div>
        </div>
    );
}

export default PanelPage;