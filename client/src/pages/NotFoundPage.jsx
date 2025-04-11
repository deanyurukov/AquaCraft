import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    function goBack() {
        navigate(-1);
    }

    return (
        <section id="not-found">
            <i className="fa-solid fa-triangle-exclamation not-found-icon"></i>
            <h1 className="not-found-heading">{t("notFound.title")}</h1>
            <p className="not-found-text">{t("notFound.message")}</p>
            <Link onClick={goBack} className="not-found-button">{t("goBack")}</Link>
        </section>
    )
}

export default NotFoundPage;