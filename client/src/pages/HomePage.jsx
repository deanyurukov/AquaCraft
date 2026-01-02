import { Link } from "react-router-dom";
import HomeCards from "../components/HomeCards";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import WateringMethodCard from "../components/WateringMethodCard";

const HomePage = () => {
    const { t } = useTranslation();
    const cards = [
        {
            imageUrl: "/images/products.png",
            title: "products",
            href: "products"
        },
        {
            imageUrl: "/images/services.png",
            title: "projectRequest",
            href: "project-request"
        },
        {
            imageUrl: "/images/how-to.png",
            title: "howTo",
            href: "how-to"
        },
        {
            imageUrl: "/images/request-project.png",
            title: "contactUs",
            href: "contact-us"
        }
    ];
    const heroSlides = [
        {
            imageUrl: "/images/hero.jpg",
            title: t("home.title"),
            // buttons: [
            //     {
            //         text: t("home.products"),
            //         href: "/products"
            //     },
            //     {
            //         text: t("home.contact"),
            //         href: "/contact-us"
            //     }
            // ]
        }
    ];
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
        },
        {
            title: t("home.watering.content.1.title"),
            level: t("home.watering.content.1.level"),
            description: t("home.watering.content.1.description"),
            stars: "⭐",
        },
        {
            title: t("home.watering.content.2.title"),
            level: t("home.watering.content.2.level"),
            description: t("home.watering.content.2.description"),
            stars: "⭐",
        },
        {
            title: t("home.watering.content.3.title"),
            level: t("home.watering.content.3.level"),
            description: t("home.watering.content.3.description"),
            stars: "⭐⭐",
        },
    ]

    const containerRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % cards.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                left: containerRef.current.clientWidth * index,
                behavior: "smooth",
            });
        }
    }, [index]);

    return (
        <div id="home">
            <div id="hero">
                <div ref={containerRef} className="slides">
                    {heroSlides.map((slide, idx) => (
                        <div key={idx} className="slide">
                            <img src={slide.imageUrl} alt={`hero section image ${idx}`} />
                            <div className="content">
                                <h1>{slide.title}</h1>
                                {/* <div className="buttons">
                                    {slide.buttons.map((button, btnIdx) => (
                                        <Link to={button.href} key={btnIdx}>{button.text}</Link>
                                    ))}
                                </div> */}
                            </div>
                        </div>
                    ))}
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

            {/* <div id="cards">
                {
                    cards.map((card, index) => (
                        <HomeCards card={card} key={index} />
                    ))
                }
            </div> */}
        </div>
    )
}

export default HomePage;