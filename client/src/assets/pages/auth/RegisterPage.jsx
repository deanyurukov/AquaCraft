import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../App";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth-service.js";
import PasswordInput from "../../components/PasswordInput.jsx";
import emailConfig from "../../configs/email-config.js";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
    const [hasUserAgreed, setHasUserAgreed] = useState(false);
    const [isLoggedIn] = useContext(appContext);
    const getErrorAndDisplay = useContext(appContext)[6];
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);

    async function onSubmit(e) {
        e.preventDefault();

        const { username, email, password, re_password } = Object.fromEntries(new FormData(e.currentTarget));

        const [registerData, error] = await authService.register(username, email, password, re_password);

        if (registerData) {
            localStorage.setItem("accessToken", JSON.stringify(registerData.accessToken));

            navigate("/");
            getErrorAndDisplay(registerData.message)

            try {
                // await emailjs.send(emailConfig.supportService, emailConfig.registerTemplate, { username, email });
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            getErrorAndDisplay(error);
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
                        <input type="text" name="username" placeholder={`${t("register.username")}*`} />
                    </span>
                    <span>
                        <input type="email" name="email" placeholder={`${t("register.email")}*`} />
                    </span>
                    <PasswordInput name={"password"} placeholder={`${t("register.password")}*`} />
                    <PasswordInput name={"re_password"} placeholder={`${t("register.rePass")}*`} />

                    <div>
                        <input onChange={changeUserAgreed} type="checkbox" name="agreement" id="agreement" />
                        <label htmlFor="agreement">{t("register.agreement.message")} <Link to={"/terms-and-conditions"}>{t("register.agreement.terms")}</Link> {t("register.agreement.and")} <Link to={"/privacy-policy"}>{t("register.agreement.privacy")}</Link>.</label>
                    </div>

                    <button disabled={!hasUserAgreed} type="submit">{t("register.title")}</button>
                </form>
            </div>
        </div >
    );
}

export default RegisterPage;