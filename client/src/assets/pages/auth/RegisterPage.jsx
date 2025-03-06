import { useContext, useEffect, useState } from "react";
import { appContext } from "../../../App";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth-service.js";
import PasswordInput from "../../components/PasswordInput.jsx";
import emailConfig from "../../configs/email-config.js";

const RegisterPage = () => {
    const [hasUserAgreed, setHasUserAgreed] = useState(false);
    const [isLoggedIn] = useContext(appContext);
    const getErrorAndDisplay = useContext(appContext)[6];
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, []);

    async function onSubmit(e) {
        e.preventDefault();

        const { username, email, password, re_password } = Object.fromEntries(new FormData(e.currentTarget));

        const [registerData, error] = await authService.register(username, email, password, re_password);

        if (registerData) {
            localStorage.setItem("accessToken", JSON.stringify(registerData.accessToken));

            try {
                await emailjs.send(emailConfig.emailService, emailConfig.registerTemplate, { username, email });
            }
            catch (error) {
                console.error(error);
            }

            navigate("/");
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
            <h1>Регистрация</h1>
            <div className="form-wrapper">
                <form onSubmit={onSubmit} id="register-form" className="form">
                    <span>
                        <input type="text" name="username" placeholder="Потребителско име*" />
                    </span>
                    <span>
                        <input type="email" name="email" placeholder="Имейл*" />
                    </span>
                    <PasswordInput name={"password"} placeholder={"Парола*"} />
                    <PasswordInput name={"re_password"} placeholder={"Повтори парола*"} />

                    <div>
                        <input onChange={changeUserAgreed} type="checkbox" name="agreement" id="agreement" />
                        <label htmlFor="agreement">С регистрирането си Вие приемате нашите <Link to={"/terms-and-conditions"}>Условия за ползване</Link> и <Link to={"/privacy-policy"}>Политика за поверителност</Link>.</label>
                    </div>

                    <button disabled={!hasUserAgreed} type="submit">Регистрация</button>
                </form>
            </div>
        </div >
    );
}

export default RegisterPage;