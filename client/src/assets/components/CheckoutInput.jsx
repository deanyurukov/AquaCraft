const CheckoutInput = ({ label, type = "text", name, value = "" }) => {
    return (
        <div>
            <label>{label}</label>
            <input type={type} required name={name} defaultValue={value} />
        </div>
    );
}

export default CheckoutInput;