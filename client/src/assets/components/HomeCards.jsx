import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const HomeCards = ({ card }) => {
    const { t } = useTranslation();

    return (
        <div className="card">
            <img src={card.imageUrl} />
            <div className="overlay">
                <h3>{t(`home.cards.${card.title}`)}</h3>
                <Link to={card.href}>{t("home.cards.learnMore")} ▸</Link>
            </div>
        </div>
    );
}

export default HomeCards;