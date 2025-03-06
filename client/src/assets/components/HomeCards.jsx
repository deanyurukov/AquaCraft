import { Link } from "react-router-dom";

const HomeCards = ({ card }) => {
    return (
        <div className="card">
            <img src={card.imageUrl} />
            <div className="overlay">
                <h3>{card.title}</h3>
                <Link to={card.href}>Научи повече ▸</Link>
            </div>
        </div>
    );
}

export default HomeCards;