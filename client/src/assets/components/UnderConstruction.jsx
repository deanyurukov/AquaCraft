import { useState } from "react";
import { useTranslation } from "react-i18next";

const UnderConstruction = () => {
    const { t } = useTranslation();
    const [isShowing, setIsShowing] = useState(true);

    return (
        <>
           {
                isShowing &&
                <div id="under-construction">
                    <p>{t("underConstruction.title")}</p>
                    <i onClick={() => setIsShowing(false)} className="fa-solid fa-circle-xmark"></i>
                </div>
            }     
        </>
    );
}

export default UnderConstruction;