import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProjectRequestItem = ({ name, pathToDoc }) => {
    const [isClicked, setIsClicked] = useState(false);
    const { t } = useTranslation();

    return (
        <section>
            <div className="item">
                <p>{t(`project-request.${name}`)}</p>

                {
                    isClicked ?
                        <button onClick={() => setIsClicked(false)}>{t("project-request.hide")}</button> :
                        <button onClick={() => setIsClicked(true)}>{t("project-request.show")}</button>
                }
            </div>

            {
                isClicked &&
                <div className="embeded">
                    <embed src={pathToDoc} type="application/pdf" />
                </div>
            }
        </section>
    );
}

export default ProjectRequestItem;