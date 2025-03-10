import { Link } from "react-router-dom";
import HomeCards from "../components/HomeCards";
import { useTranslation } from "react-i18next";
import { appContext } from "../../App";
import { useContext } from "react";

const HomePage = () => {
    const { t } = useTranslation();
    const isLoggedIn = useContext(appContext)[0];

    const cards = [
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-02/resources-support.jpg",
            title: "products",
            href: "products"
        },
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-02/resources-design.jpg",
            title: "services",
            href: "services"
        },
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-02/resources-success.jpg",
            title: "projectRequest",
            href: "project-request"
        },
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-04/rainbird_web_professionalspage_images_500x280_digitalcatalog_0.jpg",
            title: "howTo",
            href: "how-to"
        }
    ];

    return (
        <div id="home">
            <div id="hero">
                <div id="hero-content">
                    <h1>{t("home.title")}</h1>

                    <div className="button-wrapper">
                        <Link to={"/products"}>{t("home.products")}</Link>
                        <Link to={"/services"}>{t("home.services")}</Link>
                        {isLoggedIn && <Link to={"/contact-us"}>{t("home.contact")}</Link>}
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