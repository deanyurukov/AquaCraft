import { Link } from "react-router-dom";
import HomeCards from "../components/HomeCards";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

const HomePage = () => {
    const { t } = useTranslation();
    const cards = [
        {
            imageUrl: "../../../images/products.png",
            title: "products",
            href: "products"
        },
        {
            imageUrl: "../../../images/services.png",
            title: "projectRequest",
            href: "project-request"
        },
        {
            imageUrl: "../../../images/how-to.png",
            title: "howTo",
            href: "how-to"
        },
        {
            imageUrl: "../../../images/request-project.png",
            title: "contactUs",
            href: "contact-us"
        }
    ];
    const heroSlides = [
        {
            imageUrl: "/images/hero.jpg",
            title: t("home.title"),
            buttons: [
                {
                    text: t("home.products"),
                    href: "/products"
                },
                {
                    text: t("home.contact"),
                    href: "/contact-us"
                }
            ]
        },
        {
            imageUrl: "/images/hero.jpg",
            title: t("home.title"),
            buttons: [
                {
                    text: t("home.productstygf"),
                    href: "/products"
                },
                {
                    text: t("home.contact"),
                    href: "/contact-us"
                }
            ]
        }
    ];
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
                                <div className="buttons">
                                    {slide.buttons.map((button, btnIdx) => (
                                        <Link to={button.href} key={btnIdx}>{button.text}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div id="cards">
                {
                    cards.map((card, index) => (
                        <HomeCards card={card} key={index} />
                    ))
                }
            </div>
        </div>
    )
}

export default HomePage;