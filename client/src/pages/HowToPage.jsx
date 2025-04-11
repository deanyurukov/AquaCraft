import { useTranslation } from "react-i18next";
import ProjectRequestItem from "../components/ProjectRequestItem";

const HowToPage = () => {
    const { t } = useTranslation();

    return (
        <div id="how-to">
            <h1>{t("how-to.title")}</h1>

            <div className="content">
                <ProjectRequestItem name={"hunter-design-guide"} pathToDoc={"../../../documents/hunter-design-guide.pdf"} />
            </div>
        </div>
    );
}

export default HowToPage;