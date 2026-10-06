import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { appContext } from "../../App";
import authService from "../../services/auth-service.js";
import PasswordInput from "../../components/PasswordInput.jsx";

const LoginPage = () => {
    const { getErrorAndDisplay } = useContext(appContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setUser } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const { email, password } = Object.fromEntries(new FormData(e.currentTarget));

        try {
            if (email.length < 5) {
                throw new Error("email.short");
            }

            if (email.length > 99) {
                throw new Error("email.long");
            }

            if (! /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
                throw new Error("email.invalid");
            }

            const [loginData, error] = await authService.login(email, password);

            if (error) {
                getErrorAndDisplay(error);
                return;
            }

            localStorage.setItem("accessToken", JSON.stringify(loginData.accessToken));
            setUser(loginData.data);
            navigate("/");
            getErrorAndDisplay(loginData.message);
        }
        catch (error) {
            console.error(error);
            getErrorAndDisplay(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div id="login">
            <h1>{t("login.title")}</h1>
            <div className="form-wrapper">
                <form onSubmit={onSubmit} id="login-form" className="form">
                    <span>
                        <input className="item" type="email" name="email" placeholder={`${t("login.email")}*`} />
                    </span>
                    <PasswordInput name={"password"} placeholder={`${t("login.password")}*`} />

                    <button disabled={loading} className="form-submit" type="submit">{loading ? t("common.loading") : t("login.title")}</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;