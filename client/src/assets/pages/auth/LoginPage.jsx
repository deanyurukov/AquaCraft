import { useContext, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import { appContext } from "../../../App";
import authService from "../../services/auth-service.js";
import PasswordInput from "../../components/PasswordInput.jsx";

const LoginPage = () => {
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

        const { email, password } = Object.fromEntries(new FormData(e.currentTarget));
    
        const [loginData, error] = await authService.login(email, password);
            
        if (loginData) {
            localStorage.setItem("accessToken", JSON.stringify(loginData.accessToken));
            navigate("/");
            getErrorAndDisplay(loginData.message)
        }
        else {
            getErrorAndDisplay(error);
        }
    }

    return (
        <div id="login">
            <h1>Вход</h1>
            <div className="form-wrapper">
                <form onSubmit={onSubmit} id="login-form" className="form">
                    <span>
                        <input type="email" name="email" placeholder="Имейл*" />
                    </span>
                    <PasswordInput name={"password"} placeholder={"Парола*"} />

                    <button type="submit">Вход</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;