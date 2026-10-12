const SelectInput = ({ name, options, value = undefined, defaultValue = undefined, onChange = undefined }) => {
    return (
        <select
            className="form-select item"
            name={name}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
        >
            {options.map(({ val, text }) => (
                <option key={val} value={val}>{text}</option>
            ))}
        </select>
    );
};

export default SelectInput;