import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CreateSelect = ({ defaultValues = {} }) => {
    const { t } = useTranslation();
    const [type, setType] = useState("timers");

    function changeType(e) {
        const newType = e.target.value;
        setType(newType);
    }

    useEffect(() => {
        defaultValues.type && setType(defaultValues.type);
    }, []);

    return (
        <>
            <div>
                <label htmlFor="company">{t("products.products-nav.titlebar.nav-items.0.label")}*</label>
                <select defaultValue={defaultValues.company} name="company">
                    <option value="hunter">Hunter</option>
                    <option value="rainBird">Rain Bird</option>
                    <option value="rainSpa">Rain S.P.A</option>
                    <option value="irritec">Irritec</option>
                </select>
            </div>

            <div>
                <label htmlFor="type">{t("products.products-nav.titlebar.type")}*</label>
                <select onChange={changeType} defaultValue={defaultValues.type} value={type} name="type">
                    <option value="timers">{t("products.products-nav.titlebar.nav-items.1.label")}</option>
                    <option value="sprinklers">{t("products.products-nav.titlebar.nav-items.2.label")}</option>
                    <option value="valves">{t("products.products-nav.titlebar.nav-items.3.label")}</option>
                    <option value="drip">{t("products.products-nav.titlebar.nav-items.4.label")}</option>
                    <option value="bundles">{t("products.products-nav.titlebar.nav-items.5.label")}</option>
                    <option value="exclusive">{t("products.products-nav.titlebar.nav-items.6.label")}</option>
                    <option value="parts">{t("products.products-nav.titlebar.nav-items.7.label")}</option>
                </select>
            </div>

            {
                type === "timers" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="modular">{t("products.products-nav.titlebar.nav-items.1.dropdown.0")}</option>
                        <option value="wifi">{t("products.products-nav.titlebar.nav-items.1.dropdown.1")}</option>
                        <option value="wire">{t("products.products-nav.titlebar.nav-items.1.dropdown.2")}</option>
                        <option value="battery">{t("products.products-nav.titlebar.nav-items.1.dropdown.3")}</option>
                        <option value="rain">{t("products.products-nav.titlebar.nav-items.1.dropdown.4")}</option>
                        <option value="timers_parts">{t("products.products-nav.titlebar.nav-items.1.dropdown.5")}</option>
                    </select>
                </div>
            }

            {
                type === "sprinklers" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="spray">{t("products.products-nav.titlebar.nav-items.2.dropdown.0")}</option>
                        <option value="nozzles">{t("products.products-nav.titlebar.nav-items.2.dropdown.1")}</option>
                        <option value="rotary">{t("products.products-nav.titlebar.nav-items.2.dropdown.2")}</option>
                        <option value="impact">{t("products.products-nav.titlebar.nav-items.2.dropdown.3")}</option>
                        <option value="hose">{t("products.products-nav.titlebar.nav-items.2.dropdown.4")}</option>
                        <option value="sprinklers_parts">{t("products.products-nav.titlebar.nav-items.2.dropdown.5")}</option>
                    </select>
                </div>
            }

            {
                type === "valves" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="sprinkler">{t("products.products-nav.titlebar.nav-items.3.dropdown.0")}</option>
                        <option value="boxes">{t("products.products-nav.titlebar.nav-items.3.dropdown.1")}</option>
                        <option value="valves_parts">{t("products.products-nav.titlebar.nav-items.3.dropdown.2")}</option>
                    </select>
                </div>
            }

            {
                type === "drip" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="root">{t("products.products-nav.titlebar.nav-items.4.dropdown.0")}</option>
                        <option value="zone">{t("products.products-nav.titlebar.nav-items.4.dropdown.1")}</option>
                        <option value="filters">{t("products.products-nav.titlebar.nav-items.4.dropdown.2")}</option>
                        <option value="drippers">{t("products.products-nav.titlebar.nav-items.4.dropdown.3")}</option>
                        <option value="transmissions">{t("products.products-nav.titlebar.nav-items.4.dropdown.4")}</option>
                        <option value="fittings">{t("products.products-nav.titlebar.nav-items.4.dropdown.5")}</option>
                        <option value="drip_parts">{t("products.products-nav.titlebar.nav-items.4.dropdown.6")}</option>
                    </select>
                </div>
            }

            {
                type === "bundles" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="application">{t("products.products-nav.titlebar.nav-items.5.dropdown.0")}</option>
                    </select>
                </div>
            }

            {
                type === "exclusive" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="manifolds">{t("products.products-nav.titlebar.nav-items.6.dropdown.0")}</option>
                    </select>
                </div>
            }

            {
                type === "parts" &&
                <div>
                    <select defaultValue={defaultValues.typeDetails} name="typeDetails">
                        <option value="sprinkler_parts">{t("products.products-nav.titlebar.nav-items.7.dropdown.0")}</option>
                        <option value="timer_parts">{t("products.products-nav.titlebar.nav-items.7.dropdown.1")}</option>
                        <option value="valve_parts">{t("products.products-nav.titlebar.nav-items.7.dropdown.2")}</option>
                        <option value="drip_parts">{t("products.products-nav.titlebar.nav-items.7.dropdown.3")}</option>
                    </select>
                </div>
            }
        </>
    );
}

export default CreateSelect;