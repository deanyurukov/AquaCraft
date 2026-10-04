import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectInput from "./SelectInput";
import Spinner from "./Spinner";

const CreateSelect = ({ defaultValues = {} }) => {
    const { t } = useTranslation();
    const [type, setType] = useState("timers");

    const companyOptions = [
        { val: "hunter", text: "Hunter" },
        { val: "rainBird", text: "Rain Bird" },
        { val: "rainSpa", text: "Rain S.P.A" },
        { val: "irritec", text: "Irritec" }
    ];

    const typeOptions = [
        { val: "timers", text: t("products.products-nav.titlebar.nav-items.1.label") },
        { val: "sprinklers", text: t("products.products-nav.titlebar.nav-items.2.label") },
        { val: "valves", text: t("products.products-nav.titlebar.nav-items.3.label") },
        { val: "drip", text: t("products.products-nav.titlebar.nav-items.4.label") },
        { val: "bundles", text: t("products.products-nav.titlebar.nav-items.5.label") },
        { val: "exclusive", text: t("products.products-nav.titlebar.nav-items.6.label") },
        { val: "parts", text: t("products.products-nav.titlebar.nav-items.7.label") }
    ];

    const typeDetailsOptions = {
        timers: [
            { val: "modular", text: t("products.products-nav.titlebar.nav-items.1.dropdown.0") },
            { val: "wifi", text: t("products.products-nav.titlebar.nav-items.1.dropdown.1") },
            { val: "wire", text: t("products.products-nav.titlebar.nav-items.1.dropdown.2") },
            { val: "battery", text: t("products.products-nav.titlebar.nav-items.1.dropdown.3") },
            { val: "rain", text: t("products.products-nav.titlebar.nav-items.1.dropdown.4") },
            { val: "timers_parts", text: t("products.products-nav.titlebar.nav-items.1.dropdown.5") }
        ],

        sprinklers: [
            { val: "spray", text: t("products.products-nav.titlebar.nav-items.2.dropdown.0") },
            { val: "nozzles", text: t("products.products-nav.titlebar.nav-items.2.dropdown.1") },
            { val: "rotary", text: t("products.products-nav.titlebar.nav-items.2.dropdown.2") },
            { val: "rotors", text: t("products.products-nav.titlebar.nav-items.2.dropdown.3") },
            { val: "impact", text: t("products.products-nav.titlebar.nav-items.2.dropdown.4") },
            { val: "hose", text: t("products.products-nav.titlebar.nav-items.2.dropdown.5") },
            { val: "sprinklers_parts", text: t("products.products-nav.titlebar.nav-items.2.dropdown.6") }
        ],

        valves: [
            { val: "sprinkler", text: t("products.products-nav.titlebar.nav-items.3.dropdown.0") },
            { val: "boxes", text: t("products.products-nav.titlebar.nav-items.3.dropdown.1") },
            { val: "valves_parts", text: t("products.products-nav.titlebar.nav-items.3.dropdown.2") }
        ],

        drip: [
            { val: "root", text: t("products.products-nav.titlebar.nav-items.4.dropdown.0") },
            { val: "zone", text: t("products.products-nav.titlebar.nav-items.4.dropdown.1") },
            { val: "filters", text: t("products.products-nav.titlebar.nav-items.4.dropdown.2") },
            { val: "drippers", text: t("products.products-nav.titlebar.nav-items.4.dropdown.3") },
            { val: "transmissions", text: t("products.products-nav.titlebar.nav-items.4.dropdown.4") },
            { val: "fittings", text: t("products.products-nav.titlebar.nav-items.4.dropdown.5") },
            { val: "drip_parts", text: t("products.products-nav.titlebar.nav-items.4.dropdown.6") }
        ],

        bundles: [
            { val: "application", text: t("products.products-nav.titlebar.nav-items.5.dropdown.0") }
        ],

        exclusive: [
            { val: "manifolds", text: t("products.products-nav.titlebar.nav-items.6.dropdown.0") }
        ],

        parts: [
            { val: "sprinkler_parts", text: t("products.products-nav.titlebar.nav-items.7.dropdown.0") },
            { val: "timer_parts", text: t("products.products-nav.titlebar.nav-items.7.dropdown.1") },
            { val: "valve_parts", text: t("products.products-nav.titlebar.nav-items.7.dropdown.2") },
            { val: "drip_parts", text: t("products.products-nav.titlebar.nav-items.7.dropdown.3") }
        ]
    };

    function changeType(e) {
        const newType = e.target.value;
        setType(newType);
    }

    useEffect(() => {
        defaultValues.type && setType(defaultValues.type);
    }, []);

    if (!defaultValues) {
        return <Spinner />;
    }


    return (
        <>
            <div className="form-item">
                <label htmlFor="company">
                    {t("products.products-nav.titlebar.nav-items.0.label")}*
                </label>

                <SelectInput
                    key={defaultValues.company || "company"}
                    name="company"
                    defaultValue={defaultValues.company}
                    options={companyOptions}
                />
            </div>

            <div className="form-item">
                <label htmlFor="type">
                    {t("products.products-nav.titlebar.type")}*
                </label>

                <SelectInput
                    key={type || "type"}
                    name="type"
                    defaultValue={type}
                    onChange={changeType}
                    options={typeOptions}
                />
            </div>

            {typeDetailsOptions[type] && (
                <div className="form-item">
                    <SelectInput
                        key={defaultValues.typeDetails || "typeDetails"}
                        name="typeDetails"
                        defaultValue={defaultValues.typeDetails}
                        options={typeDetailsOptions[type]}
                    />
                </div>
            )}
        </>
    );
}

export default CreateSelect;