const Input = ({ label, type = "text", name, value = "", min = null, placeholder = "" }) => {
    return (
        <div className="form-item">
            <label htmlFor={name}>{label}</label>
            <input className="item" type={type} required name={name} id={name} defaultValue={value} min={min} placeholder={placeholder} />
        </div>
    );
}

export default Input;