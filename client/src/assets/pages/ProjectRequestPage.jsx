import { useTranslation } from "react-i18next";
import ProjectRequestItem from "../components/ProjectRequestItem";

const ProjectRequestPage = () => {
    const { t } = useTranslation();

    return (
        <div id="project-request">
            <h1>{t("project-request.title")}</h1>

            <div className="content">
                <ProjectRequestItem name={"rainbird-request-form"} pathToDoc={"../../../documents/rainbird-request-form.pdf"} />
            </div>
        </div>
    );
}

export default ProjectRequestPage;