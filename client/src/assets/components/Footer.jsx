import { Link } from "react-router-dom";

const Footer = () => {
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
                    <h3>Support</h3>
                    <li><Link to="/contact-us">Контакти</Link></li>
                    <li><Link to="/privacy-policy">Политика за поверителност</Link></li>
                    <li><Link to="/terms-and-conditions">Условия за ползване</Link></li>
                </ul>
                <ul>
                    <h3>Corporate</h3>
                    <li><Link to="#">About Aqua Craft</Link></li>
                    <li><Link to="#">Aqua Craft Logo</Link></li>
                    <li><Link to="#">Careers</Link></li>
                </ul>
            </div>

            <p>&copy; {new Date().getFullYear()} Aqua Craft Corporation. Всички права запазени.</p>
        </footer>
    );
}

export default Footer;