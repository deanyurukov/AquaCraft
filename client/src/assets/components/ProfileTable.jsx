import ProfileOrder from "./ProfileOrder";

const ProfileTable = ({ orders }) => {
    return (
        <span id="profile-table">
            {
                orders.length === 0 ?
                    <h4>Нямате направени поръчки.</h4> :
                    <table>
                        <thead>
                            <tr>
                                <th>Номер на поръчка</th>
                                <th>Дата</th>
                                <th>Брой продукти</th>
                                <th>Клиент</th>
                                <th>Цена</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map(order => (
                                    <ProfileOrder key={order._id} order={order} />
                                ))
                            }
                        </tbody>
                    </table>
            }
        </span>
    );
}

export default ProfileTable;