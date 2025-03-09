const CheckoutInput = ({ label, type = "text", name, value = "", min = null }) => {
    return (
        <div>
            <label>{label}</label>
            <input type={type} required name={name} defaultValue={value} min={min} />
        </div>
    );
}

export default CheckoutInput;