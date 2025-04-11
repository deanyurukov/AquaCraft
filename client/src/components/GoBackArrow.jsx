import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const GoBackArrow = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    function goBack() {
        navigate(-1);
    }

    return (
        <Link onClick={goBack} id="go-back">
            <i className="fa-solid fa-arrow-left"></i>
            <span>{t("goBack")}</span>
        </Link>
    );
}

export default GoBackArrow;