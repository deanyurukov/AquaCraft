import { useContext, useEffect, useState } from "react";
import authService from "../../services/auth-service";
import Spinner from "../../components/Spinner";
import CheckoutInput from "../../components/CheckoutInput";
import PasswordInput from "../../components/PasswordInput";
import { appContext } from "../../App";
import { useTranslation } from "react-i18next";

const UserDataPage = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const getErrorAndDisplay = useContext(appContext)[6];
    const { t } = useTranslation();

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
        userData.email = email;
        userData.username = username;
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
            <h1>{t("profile.data.title")}</h1>
            
            <div className="content">
                <div className="data">
                    <h2>{t("profile.data.info")}</h2>

                    <form action={onDataChange}>
                        <CheckoutInput type="text" value={userData.username} label={`${t("profile.data.username")}*`} name={"username"} />
                        <CheckoutInput type="email" value={userData.email} label={`${t("profile.data.email")}*`} name={"email"} />
                        <PasswordInput placeholder={`${t("profile.data.password")}*`} name={"password"} />

                        <button type="submit">{t("profile.data.save")}</button>
                    </form>
                </div>

                <div className="change-password">
                    <h2>{t("profile.data.password")}</h2>

                    <form action={onPasswordChange}>
                        <PasswordInput placeholder={`${t("profile.data.currentPass")}*`} name={"password"} />
                        <PasswordInput placeholder={`${t("profile.data.newPass")}*`} name={"new_password"} />

                        <button type="submit">{t("profile.data.save")}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserDataPage;