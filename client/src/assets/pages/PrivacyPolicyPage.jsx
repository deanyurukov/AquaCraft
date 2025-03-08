import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
    const { t } = useTranslation();

    return (
        <div id="privacy-policy">
            <h1>{t("privacy.title")}</h1>

            <div className="content">
                <p>{t("privacy.lastUpdated")} 20.02.2025</p>
                <p>
                    1. {t("privacy.sections.introduction.title")}: {t("privacy.sections.introduction.content.fp")}
                    <span> AquaCraft</span> {t("privacy.sections.introduction.content.sp")}<span> aquacraft.ltd</span> {t("privacy.sections.introduction.content.tp")}
                </p>
                <p>2. {t("privacy.sections.informationCollected.title")}:</p>
                <p>
                    2.1. {t("privacy.sections.informationCollected.personal.title")}: {t("privacy.sections.informationCollected.personal.content")}
                </p>
                <p>
                    2.2. {t("privacy.sections.informationCollected.nonPersonal.title")}: {t("privacy.sections.informationCollected.nonPersonal.content")}
                </p>
                <p>
                    3. {t("privacy.sections.usage.title")}:
                </p>
                <p>3.1. {t("privacy.sections.usage.points.0")}</p>
                <p>3.2. {t("privacy.sections.usage.points.1")}</p>
                <p>3.3. {t("privacy.sections.usage.points.2")}</p>
                <p>3.4. {t("privacy.sections.usage.points.3")}</p>
                <p>
                    4. {t("privacy.sections.informationSharing.title")}: {t("privacy.sections.informationSharing.content")}
                </p>
                <p>
                    5. {t("privacy.sections.cookies.title")}: {t("privacy.sections.cookies.content")}
                </p>
                <p>
                    6. {t("privacy.sections.thirdPartyLinks.title")}: {t("privacy.sections.thirdPartyLinks.content")}
                </p>
                <p>
                    7. {t("privacy.sections.dataSecurity.title")}: {t("privacy.sections.dataSecurity.content")}
                </p>
                <p>
                    8. {t("privacy.sections.policyChanges.title")}: {t("privacy.sections.policyChanges.content")}
                </p>
                <p>
                    9. {t("privacy.sections.contactUs.title")}: {t("privacy.sections.contactUs.content")}
                    <Link className="edit-btn" to="/contact-us">
                        {t("privacy.sections.contactUs.title")}
                    </Link>.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;