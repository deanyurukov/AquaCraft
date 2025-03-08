import { useTranslation } from "react-i18next";

const TermsAndConditionsPage = () => {
    const { t } = useTranslation();

    return (
        <div id="terms-and-conditions">
            <h1>{t("terms.title")}</h1>

            <div className="content">
                <p>{t("terms.text")}</p>
            </div>
        </div>
    );
}

export default TermsAndConditionsPage;