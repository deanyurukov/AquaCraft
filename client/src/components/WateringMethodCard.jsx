import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WateringMethodCard = ({ info }) => {
    const { t } = useTranslation();
    
    return (
        <article>
            <div className="card">
                <h4>{info.title}</h4>
                <p><span>{info.stars}</span> <br /> {info.level}</p>
            </div>
            <div className="overlay">
                <h5>{t("home.watering.advantages")}</h5>
                <p>{info.description}</p>
                <Link to={"#"}>{t("home.watering.learnMore")}</Link>
            </div>
        </article>
    );
}

export default WateringMethodCard;