import authService from "../../services/auth-service";
import CheckoutInput from "../../components/CheckoutInput";
import PasswordInput from "../../components/PasswordInput";
import { appContext } from "../../App";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useContext } from "react";

const UserDataPage = () => {
    const { getErrorAndDisplay } = useContext(appContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, setUser } = useOutletContext();

    async function onDataChange(formData) {
        const { username, email, password } = Object.fromEntries(formData);

        const [data, error] = await authService.changeUserData(username, email, password);

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));

        setUser(prev => {
            prev.email = email;
            prev.username = username;
            return { ...prev };
        });

        getErrorAndDisplay(data.message);
        navigate("/profile/panel");
    }

    async function onPasswordChange(formData) {
        const { password, new_password } = Object.fromEntries(formData);

        if (password === new_password) return;

        const [data, error] = await authService.changeUserPassword(password, new_password);

        if (!data) {
            getErrorAndDisplay(error);
            return;
        }

        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        getErrorAndDisplay(data.message);
    }

    return (
        <div id="profile-data">
            <h1>{t("profile.data.title")}</h1>

            <div className="content">
                <div className="data">
                    <h2>{t("profile.data.info")}</h2>

                    <form action={onDataChange}>
                        <CheckoutInput type="text" value={user.username} label={`${t("profile.data.username")}*`} name={"username"} />
                        <CheckoutInput type="email" value={user.email} label={`${t("profile.data.email")}*`} name={"email"} />
                        <PasswordInput placeholder={`${t("profile.data.password")}*`} name={"password"} />

                        <button className="primary link" type="submit">{t("profile.data.save")}</button>
                    </form>
                </div>

                <div className="change-password">
                    <h2>{t("profile.data.password")}</h2>

                    <form action={onPasswordChange}>
                        <PasswordInput placeholder={`${t("profile.data.currentPass")}*`} name={"password"} />
                        <PasswordInput placeholder={`${t("profile.data.newPass")}*`} name={"new_password"} />

                        <button className="primary link" type="submit">{t("profile.data.save")}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserDataPage;