import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import ordersService from "../../services/orders-service";
import ProfileTable from "../../components/ProfileTable";
import { appContext } from "../../App";
import Spinner from "../../components/Spinner";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [filter, setFilter] = useState("all");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const getErrorAndDisplay = useContext(appContext)[6];

    async function getOrders() {
        setLoading(true);

        const orders = await ordersService.getAll();
        setOrders(orders);
        setDisplayOrders(orders);

        setLoading(false);
    }

    function onFilter(e) {
        setFilter(e.target.value);
    }

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        let tempOrders = [...orders];

        if (filter === "completed") {
            tempOrders = tempOrders.filter(order => order.isCompleted === true);
        }

        if (filter === "not_completed") {
            tempOrders = tempOrders.filter(order => order.isCompleted === false);
        }

        setDisplayOrders(tempOrders);
        updateURL();
    }, [filter, orders]);

    useEffect(() => {
        const filter = Object.fromEntries(searchParams);

        if (filter.filter) {
            setFilter(filter.filter);
        }
    }, [searchParams, orders]);

    const updateURL = () => {
        const params = new URLSearchParams();

        if (filter !== "all") params.set('filter', filter);

        navigate(`/admin/orders?${params.toString()}`);
    };

    async function completeOrder(order, orderId) {
        if (order.isCompleted) {
            return;
        }

        const [data, error] = await ordersService.completeOrder(orderId);

        if (error) {
            getErrorAndDisplay(error);
            return;
        }

        const indexOfOrder = orders.indexOf(order);
        setOrders(prev => {
            prev[indexOfOrder].isCompleted = true;
            return [...prev];
        });
    }

    if (loading) {
        return <div id="profile-spinner">
            <Spinner />
        </div>;
    }

    return (
        <div id="profile-orders">
            <h6>{t("admin.orders.title")}</h6>

            <select value={filter} onChange={onFilter} >
                <option value="all">{t("admin.orders.all")}</option>
                <option value="completed">{t("admin.orders.completed")}</option>
                <option value="not_completed">{t("admin.orders.notCompleted")}</option>
            </select>

            <ProfileTable orders={displayOrders} isAdmin={true} complete={completeOrder} />
        </div>
    )
}

export default AdminOrdersPage;