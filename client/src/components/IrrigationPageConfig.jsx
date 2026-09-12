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

    return (
        <>
            <div id='irrigation-method'>
                <section className='hero'>
                    <img src={data.heroImage} alt="irrigation hero image" />

                    <span>{t(`${translationPath}.category`)}</span>
                    <h1>{t(`${translationPath}.headline`)}</h1>
                    <p>{t(`${translationPath}.description`)}</p>

                    <div>
                        <a className='primary link' href={"#calc"}>{t("common.planSystem")}</a>
                        <a className='secondary link' href={"#components"}>{t("common.viewComponents")}</a>
                    </div>
                </section>

                <section id="facts" className="page-section">
                    {
                        data.factIcons.map((icon, i) => (
                            <article key={i}>
                                <i className={icon}></i>
                                <h3>{t(`facts.label${i}`)}</h3>
                                <p>{t(`${translationPath}.fact${i}`)}</p>
                            </article>
                        ))
                    }
                </section>

                <hr />

                <section id='suitable' className='page-section'>
                    <div className='titlebar'>
                        <h5>{t("method.suitableFor")}</h5>
                    </div>

                    <article>
                        {
                            data.suitableImages.map(({ src, key }, i) => (
                                <div key={i}>
                                    <span>
                                        <img src={src} alt="suitable image" />
                                    </span>

                                    <p>{t(`${translationPath}.${key}`)}</p>
                                </div>
                            ))
                        }
                    </article>
                </section>

                

                <section id='cta'>
                    <h3>{t(`${translationPath}.ctaHeadline`)}</h3>
                    <p>{t(`${translationPath}.ctaText`)}</p>

                    <div>
                        <a className='tertiary link' href={"#calc"}>{t("common.planSystem")}</a>
                        <Link className='secondary link' to={"/contact-us"}>{t("common.contactUs")}</Link>
                    </div>
                </section>
            </div>
        </>
    );
};

export default IrrigationPageConfig;