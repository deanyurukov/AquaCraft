import { Link, useNavigate } from "react-router-dom";

const GoBackArrow = () => {
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <Link onClick={goBack} id="go-back">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Върни се</span>
        </Link>
    );
}

export default GoBackArrow;