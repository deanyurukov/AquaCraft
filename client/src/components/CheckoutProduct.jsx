const CheckoutProduct = ({ product }) => {
    return (
        <div className="product">
            <p><span>{product.product.title}</span> <span>x</span> <span>{product.quantity}</span></p>
            <p>€{(product.product.price * product.quantity).toFixed(2)}</p>
        </div>
    );
}

export default CheckoutProduct;