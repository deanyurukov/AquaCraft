import { useContext, useEffect, useState } from "react";
import authService from "../../services/auth-service";
import Spinner from "../../components/Spinner";
import CheckoutInput from "../../components/CheckoutInput";
import PasswordInput from "../../components/PasswordInput";
import { appContext } from "../../../App";

const UserDataPage = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const getErrorAndDisplay = useContext(appContext)[6];

    useEffect(() => {
        async function getUser() {
            setLoading(true);
            const user = (await authService.getUserData())[0];
            setUserData(user);
            setLoading(false);
        }

        getUser();
    }, []);

    async function onDataChange(formData) {
        const { username, email, password } = Object.fromEntries(formData);

        const [data, error] = await authService.changeUserData(username, email, password);
        
        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        getErrorAndDisplay(data.message);
    }

    async function onPasswordChange(formData) {
        const { password, new_password } = Object.fromEntries(formData);

        const [data, error] = await authService.changeUserPassword(password, new_password);
        
        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        getErrorAndDisplay(data.message);
    }

    if (loading) {
        return (
            <div id="profile-spinner">
                <Spinner />
            </div>
        )
    }

    return (
        <div id="profile-data">
            <h1>Моите данни</h1>
            
            <div className="content">
                <div className="data">
                    <h2>Инфорации за профила</h2>

                    <form action={onDataChange}>
                        <CheckoutInput type="text" value={userData.username} label={"Потребителско име*"} name={"username"} />
                        <CheckoutInput type="email" value={userData.email} label={"Имейл*"} name={"email"} />
                        <PasswordInput placeholder={"Парола*"} name={"password"} />

                        <button type="submit">Запази промените</button>
                    </form>
                </div>

                <div className="change-password">
                    <h2>Парола</h2>

                    <form action={onPasswordChange}>
                        <PasswordInput placeholder={"Акуална парола*"} name={"password"} />
                        <PasswordInput placeholder={"Нова парола*"} name={"new_password"} />

                        <button type="submit">Запази промените</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserDataPage;