import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer id="site-footer">
            <ul className="social-links-container">
                <li><Link to="#" target="_blank"><i className="fa-brands fa-facebook-f"></i></Link></li>
                <li><Link to="#" target="_blank"><i className="fa-brands fa-twitter"></i></Link></li>
                <li><Link to="#" target="_blank"><i className="fa-brands fa-linkedin-in"></i></Link></li>
                <li><Link to="#" target="_blank"><i className="fa-brands fa-instagram"></i></Link></li>
            </ul>

            <div>
                <ul>
                    <h3>{t("footer.support")}</h3>
                    <li><Link to="/contact-us">{t("footer.contact")}</Link></li>
                    <li><Link to="/privacy-policy">{t("footer.privacy")}</Link></li>
                    <li><Link to="/terms-and-conditions">{t("footer.terms")}</Link></li>
                </ul>
                <ul>
                    <h3>{t("footer.corporate")}</h3>
                    <li><Link to="#">{t("footer.about")}</Link></li>
                    <li><Link to="#">{t("footer.logo")}</Link></li>
                    <li><Link to="#">{t("footer.careers")}</Link></li>
                </ul>
            </div>

            <p>&copy; {new Date().getFullYear()} Aqua Craft {t("footer.rights")}</p>
        </footer>
    );
}

export default Footer;