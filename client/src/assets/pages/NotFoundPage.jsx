import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <section id="not-found">
            <i className="fa-solid fa-triangle-exclamation not-found-icon"></i>
            <h1 className="not-found-heading">404 Не е намерено</h1>
            <p className="not-found-text">Тази страница не съществува</p>
            <Link onClick={goBack} className="not-found-button">Върни се назад</Link>
        </section>
    )
}

export default NotFoundPage;