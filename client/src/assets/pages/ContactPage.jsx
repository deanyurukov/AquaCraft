import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutInput from "../components/CheckoutInput.jsx";
import authService from "../services/auth-service.js";
import { useTranslation } from "react-i18next";
import emailConfig from "../configs/email-config.js";
import { appContext } from "../../App.jsx";

const ContactPage = () => {
    const getErrorAndDisplay = useContext(appContext)[6];
    const isLoggedIn = useContext(appContext)[0];
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    async function getUserEmail() {
        const email = (await authService.getUserData())[0].email;
        setUserEmail(email);
    }

    useEffect(() => {
        if (! isLoggedIn) {
            navigate("/");
            getErrorAndDisplay("authNeeded");
        }

        getUserEmail();
    }, []);

    async function onSubmit(e) {
        e.preventDefault();

        const { email, name, message } = Object.fromEntries(new FormData(e.currentTarget));

        try {
            if (email === "" || name === "" || message === "") {
                throw new Error("allFields");
            }

            if (name.length < 3) {
                throw new Error("name.short");
            }

            if (name.length > 99) {
                throw new Error("name.long");
            }

            if (! /^[a-zа-яА-ЯA-Z0-9\s]+$/.test(name)) {
                throw new Error("name.invalid");
            }

            if (email.length < 5) {
                throw new Error("email.short");
            }

            if (email.length > 99) {
                throw new Error("email.long");
            }

            if (! /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
                throw new Error("email.invalid");
            }

            if (message.length < 10) {
                throw new Error("message.short");
            }

            try {
                emailjs.send(emailConfig.gmailService, emailConfig.contactTemplate, { email, name, message });
            }
            catch (err) {
                console.error(err);
            }

            getErrorAndDisplay("contactSuccess");
            navigate("/");
        }
        catch (error) {
            console.error(error);
            getErrorAndDisplay(error.message);
        }
    }

    return (
        <div id="contact-us">
            <h1>{t("contact.title")}</h1>

            <div className="content">
                <form onSubmit={onSubmit}>
                    <CheckoutInput label={`${t("contact.name")}*`} name={"name"} />
                    <CheckoutInput label={`${t("contact.email")}*`} name={"email"} type={"email"} value={userEmail} />

                    <div>
                        <label htmlFor="message">{t("contact.message")}*</label>
                        <textarea name="message" id="message"></textarea>
                    </div>

                    <button type="submit">{t("contact.submit")}</button>
                </form>

                <div id="map">
                    <iframe 
                        src="https://www.google.com/maps?q=42°04'00.9,24°42'41.9&hl=es;z=14&output=embed"
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </div>
    )
}

export default ContactPage;