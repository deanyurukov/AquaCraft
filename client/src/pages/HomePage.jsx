import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import WateringMethodCard from "../components/WateringMethodCard";
import { Link } from "react-router-dom";

const HomePage = () => {
    const { t } = useTranslation();

    const benefits = [
        {
            imageUrl: "/images/benefits/benefit-1.png"
        },
        {
            imageUrl: "/images/benefits/benefit-2.png"
        },
        {
            imageUrl: "/images/benefits/benefit-3.png"
        },
        {
            imageUrl: "/images/benefits/benefit-4.png"
        },
        {
            imageUrl: "/images/benefits/benefit-5.png"
        },
        {
            imageUrl: "/images/benefits/benefit-6.png"
        }
    ];
    const wateringMethods = [
        {
            title: t("home.watering.content.0.title"),
            level: t("home.watering.content.0.level"),
            description: t("home.watering.content.0.description"),
            stars: "⭐",
            link: "/methods/drip"
        },
        {
            title: t("home.watering.content.1.title"),
            level: t("home.watering.content.1.level"),
            description: t("home.watering.content.1.description"),
            stars: "⭐",
            link: "/methods/micro"
        },
        {
            title: t("home.watering.content.2.title"),
            level: t("home.watering.content.2.level"),
            description: t("home.watering.content.2.description"),
            stars: "⭐",
            link: "/methods/subsurface"
        },
        {
            title: t("home.watering.content.3.title"),
            level: t("home.watering.content.3.level"),
            description: t("home.watering.content.3.description"),
            stars: "⭐⭐",
            link: "/methods/sprinkler"
        },
    ]

    return (
        <div id="home">
            <div className="hero">
                <img src="/images/hero.jpg" alt="home hero image" />

                <h1>{t("home.title")}</h1>
                <p>{t("home.heroText")}</p>

                <div>
                    <Link className='primary link' to={"/products"}>{t("home.products")}</Link>
                    <a className='secondary link' href={"#watering"}>{t("home.methods")}</a>
                </div>
            </div>

            <div id="benefits">
                <h2>{t("home.benefits.title")}</h2>

                <section>
                    {[...benefits, ...benefits].map((benefit, index) => (
                        <div key={index} className={index >= benefits.length ? "doubled" : ""}>
                            <img src={benefit.imageUrl} alt={t(`home.benefits.content.${index % benefits.length}`)} />
                            <p>{t(`home.benefits.content.${index % benefits.length}`)}</p>
                        </div>
                    ))}
                </section>
            </div>

            <div id="watering">
                <h2>{t("home.watering.title")}</h2>

                <section>
                    {wateringMethods.map((method, index) => (
                        <WateringMethodCard info={method} key={index} />
                    ))}
                </section>
            </div>

            <div id="mission">
                <h2>{t("home.mission.title")}</h2>
                <p>{t("home.mission.description")}</p>
            </div>
        </div>
    )
}

export default HomePage;