import { useContext, useState } from "react";
import { appContext } from "../../App";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import authService from "../../services/auth-service.js";
import PasswordInput from "../../components/PasswordInput.jsx";
import emailConfig from "../../configs/email-config.js";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
    const [hasUserAgreed, setHasUserAgreed] = useState(false);
    const { getErrorAndDisplay } = useContext(appContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setUser } = useOutletContext();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();

        if (!hasUserAgreed || loading) return;
        setLoading(true);

        const { username, email, password, re_password } = Object.fromEntries(new FormData(e.currentTarget));

        try {
            const [registerData, error] = await authService.register(username, email, password, re_password);

            if (error) {
                getErrorAndDisplay(error);
                return;
            }

            localStorage.setItem("accessToken", JSON.stringify(registerData.accessToken));
            setUser(registerData.data);

            navigate("/");
            getErrorAndDisplay(registerData.message)
            // await emailjs.send(emailConfig.supportService, emailConfig.registerTemplate, { username, email });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    function changeUserAgreed(e) {
        setHasUserAgreed(e.target.checked);
    }

    return (
        <div id="register">
            <h1>{t("register.title")}</h1>
            <div className="form-wrapper">
                <form onSubmit={onSubmit} id="register-form" className="form">
                    <span>
                        <input className="item" type="text" name="username" placeholder={`${t("register.username")}*`} />
                    </span>
                    <span>
                        <input className="item" type="email" name="email" placeholder={`${t("register.email")}*`} />
                    </span>
                    <PasswordInput name={"password"} placeholder={`${t("register.password")}*`} />
                    <PasswordInput name={"re_password"} placeholder={`${t("register.rePass")}*`} />

                    <div>
                        <input onChange={changeUserAgreed} type="checkbox" name="agreement" id="agreement" />
                        <label htmlFor="agreement">{t("register.agreement.message")} <Link to={"/terms-and-conditions"}>{t("register.agreement.terms")}</Link> {t("register.agreement.and")} <Link to={"/privacy-policy"}>{t("register.agreement.privacy")}</Link>.</label>
                    </div>

                    <button disabled={!hasUserAgreed || loading} className="form-submit" type="submit">{loading ? t("common.loading") : t("register.title")}</button>
                </form>
            </div>
        </div >
    );
}

export default RegisterPage;