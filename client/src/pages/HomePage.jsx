import { Link } from "react-router-dom";
import HomeCards from "../components/HomeCards";
import { useTranslation } from "react-i18next";

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

    return (
        <div id="home">
            <div id="hero">
                <div id="hero-content">
                    <h1>{t("home.title")}</h1>

                    <div className="button-wrapper">
                        <Link to={"/products"}>{t("home.products")}</Link>
                        <Link to={"/contact-us"}>{t("home.contact")}</Link>
                    </div>
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