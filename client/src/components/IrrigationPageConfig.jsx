import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const IrrigationPageConfig = ({ methodName }) => {
    const { t } = useTranslation();
    const translationPath = `methods.${methodName}`;

    return (
        <>
            <div id='irrigation-method'>

                <section id='cta'>
                    <h3>{t(`${translationPath}.ctaHeadline`)}</h3>
                    <p>{t(`${translationPath}.ctaText`)}</p>

                    <div>
                        <Link className='tertiary' to={"#calc"}>{t("common.planSystem")}</Link>
                        <Link className='secondary' to={"/contact-us"}>{t("common.contactUs")}</Link>
                    </div>
                </section>
            </div>
        </>
    );
};

export default IrrigationPageConfig;