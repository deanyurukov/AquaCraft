import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculateTotalPrice } from "../services/helpers";

const ProfileOrder = ({ order }) => {
    const [price, setPrice] = useState(0);
    const createdAtDate = new Date(order.createdAt);
    const createdAtString = `${createdAtDate.getDate()}/${createdAtDate.getMonth()}/${createdAtDate.getFullYear()}`;

    useEffect(() => {
        let combined = calculateTotalPrice(order.orderData);
        setPrice(combined);
    }, []);

    return (
        <tr>
            <td>{order._id}</td>
            <td>{createdAtString}</td>
            <td>{order.orderData.length}</td>
            <td>{order.name}</td>
            <td>${price.toFixed(2)}</td>
            <td><Link to={`/profile/order/${order._id}/details`}><i className="fa-solid fa-circle-info"></i></Link></td>
        </tr>
    );
}

export default ProfileOrder;