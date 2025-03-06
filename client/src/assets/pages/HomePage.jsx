import { Link } from "react-router-dom";
import HomeCards from "../components/HomeCards";

const HomePage = () => {
    const cards = [
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-02/resources-support.jpg",
            title: "Продукти",
            href: "products"
        },
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-02/resources-design.jpg",
            title: "Услуги",
            href: "services"
        },
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-02/resources-success.jpg",
            title: "Поискай проект",
            href: "project-request"
        },
        {
            imageUrl: "https://www.rainbird.com/sites/default/files/media/images/2022-04/rainbird_web_professionalspage_images_500x280_digitalcatalog_0.jpg",
            title: "Как да...",
            href: "how-to"
        }
    ];

    return (
        <div id="home">
            <div id="hero">
                <div id="hero-content">
                    <h1>Направи своята напоителна система</h1>

                    <div className="button-wrapper">
                        <Link to={"/products"}>Продукти</Link>
                        <Link to={"/services"}>Услуги</Link>
                        <Link to={"/contact-us"}>Контакти</Link>
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