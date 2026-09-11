import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { methodData } from '../data/irrigation-methods-data.js';

const IrrigationPageConfig = ({ methodName }) => {
    const navigate = useNavigate();

    if (!methodName) {
        navigate("/");
    }

    const { t } = useTranslation();
    const translationPath = `methods.${methodName}`;
    const data = methodData[methodName];
    console.log(data);

    return (
        <>
            <div id='irrigation-method'>
                <section id='irrigation-hero'>
                    <img src={data.heroImage} alt="irrigation hero image" />

                    <span>{t(`${translationPath}.category`)}</span>
                    <h1>{t(`${translationPath}.headline`)}</h1>
                    <p>{t(`${translationPath}.description`)}</p>

                    <div>
                        <Link className='primary' to={"#calc"}>{t("common.planSystem")}</Link>
                        <Link className='secondary' to={"#components"}>{t("common.viewComponents")}</Link>
                    </div>
                </section>

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