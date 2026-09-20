import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { methodData } from '../data/irrigation-methods-data.js';
import { useEffect, useState } from 'react';

const RangeItem = ({ field, calcRanges, setCalcRanges }) => {
    const { t } = useTranslation();

    function onChange(e) {
        const newVal = Number(e.target.value);
        setCalcRanges(prev => {
            prev[field.id] = newVal;
            return { ...prev };
        });
    }

    return (
        <article>
            <div className='labels'>
                <h6>{t(field.labelKey)}</h6>
                <p>{calcRanges[field.id]} {t(field.unitKey)}</p>
            </div>

            <input onChange={onChange} id={field.id} type="range" min={field.min} max={field.max} step={field.step} defaultValue={field.defaultValue} />

            <div className='range-specs'>
                <p>{field.min} {t(field.unitKey)}</p>
                <p>{field.max} {t(field.unitKey)}</p>
            </div>
        </article>
    );
};

const FaqItem = ({ i, translationPath }) => {
    const { t } = useTranslation();
    const [isOpened, setIsOpened] = useState(false);

    return (
        <section onClick={() => setIsOpened(prev => prev = !prev)}>
            <div className={isOpened ? "opened" : undefined}>
                <h6>{t(`${translationPath}.faq${i}q`)}</h6>
                <i className="fa-solid fa-angle-up"></i>
            </div>

            {
                isOpened &&
                <>
                    <hr />
                    <p>{t(`${translationPath}.faq${i}a`)}</p>
                </>
            }
        </section>
    );
};

const IrrigationPageConfig = ({ methodName }) => {
    const navigate = useNavigate();

    if (!methodName) {
        navigate("/");
    }

    const { t } = useTranslation();
    const translationPath = `methods.${methodName}`;
    const data = methodData[methodName];
    const [calcRanges, setCalcRanges] = useState({});
    const [calcResults, setCalcResults] = useState([]);

    useEffect(() => {
        data.plannerFields.forEach(item => {
            setCalcRanges(prev => {
                prev[item.id] = item.defaultValue;
                return { ...prev };
            });
        });
    }, []);

    useEffect(() => {
        setCalcResults(data.computePlanner(calcRanges));
    }, [calcRanges]);

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

                <section id='how-it-works' className='page-section'>
                    <div className='titlebar'>
                        <h5>{t("method.howItWorks")}</h5>
                    </div>

                    <article style={{ ['--steps']: data.flowIcons?.length || 0 }}>
                        {
                            data.flowIcons.map((icon, i) => (
                                <div key={i}>
                                    <span>
                                        <i className={icon}></i>
                                    </span>

                                    <p>{t(`${translationPath}.flow${i}`)}</p>
                                </div>
                            ))
                        }
                    </article>
                </section>

                <section id="calc" className="page-section">
                    <div className='titlebar'>
                        <h5>{t("method.planner")}</h5>
                        <p>{t("common.approxNote")}</p>
                    </div>

                    <article>
                        <section className='fields'>
                            {
                                data.plannerFields.map((field, i) => (
                                    <RangeItem key={i} i={i} field={field} calcRanges={calcRanges} setCalcRanges={setCalcRanges} />
                                ))
                            }
                        </section>

                        <section className='results'>
                            <h4>{t("common.approxResult")}</h4>

                            {
                                calcResults.map((result, i) => (
                                    <article key={i}>
                                        <h6>{t(result.labelKey)}</h6>
                                        <p>{result.value.split(" ")[0]} {t(result.value.split(" ")[1])}</p>
                                    </article>
                                ))
                            }

                            <p>{t("common.expertNote")}</p>
                        </section>
                    </article>
                </section>

                <hr />

                <section id="components" className="page-section">
                    <div className='titlebar'>
                        <h5>{t("method.componentsSectionTitle")}</h5>
                        <p>{t("method.componentsSectionSub")}</p>
                    </div>

                    <article>
                        {
                            data.componentIcons.map((icon, i) => (
                                <div key={i}>
                                    <span>
                                        <i className={icon}></i>
                                    </span>

                                    <h6>{t(`${translationPath}.comp${i}Name`)}</h6>
                                    <p>{t(`${translationPath}.comp${i}Desc`)}</p>
                                </div>
                            ))
                        }
                    </article>

                    <Link className='primary link' to="/products">{t("common.viewProducts")}</Link>
                </section>

                <section id="steps" className="page-section">
                    <div className='titlebar'>
                        <h5>{t("method.installationTitle")}</h5>
                    </div>

                    <article>
                        {
                            Array(data.stepCount).fill(0).map((_, i) => (
                                <div key={i}>
                                    <h6>{i + 1}</h6>
                                    <p>{t(`${translationPath}.step${i}`)}</p>
                                </div>
                            ))
                        }
                    </article>
                </section>

                <section id="system" className="page-section">
                    <div className='titlebar'>
                        <h5>{t("method.systemsTitle")}</h5>
                        <p>{t("method.systemsSub")}</p>
                    </div>

                    <article>
                        {
                            data.systemFeatureCounts.map((_, i) => (
                                <div key={i} className={i === 1 ? "popular" : ""}>
                                    {i === 1 && <span>{t("common.mostPopular")}</span>}
                                    <h5>{t(`${translationPath}.sys${i}Size`)}</h5>
                                    <p className='area'>{t(`${translationPath}.sys${i}Area`)}</p>
                                    <p className='desc'>{t(`${translationPath}.sys${i}Desc`)}</p>

                                    <ul>
                                        {
                                            Array(data.systemFeatureCounts[i]).fill(0).map((_, j) => (
                                                <li key={j}>
                                                    <i className="fa-solid fa-check"></i>
                                                    {t(`${translationPath}.sys${i}f${j}`)}
                                                </li>
                                            ))
                                        }
                                    </ul>

                                    <Link className='primary link' to="#">{t("common.requestQuote")}</Link>
                                </div>
                            ))
                        }
                    </article>
                </section>

                <section id="faq" className="page-section">
                    <div className='titlebar'>
                        <h5>{t("method.faqTitle")}</h5>
                    </div>

                    <article>
                        {
                            Array(data.faqCount).fill(0).map((_, i) => (
                                <FaqItem key={i} i={i} translationPath={translationPath} />
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