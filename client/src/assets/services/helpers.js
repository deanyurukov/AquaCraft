export function changeImage(e) {
    e.target.src = "https://cdn.vectorstock.com/i/500p/11/64/404-error-page-not-found-with-drop-water-hand-vector-29971164.jpg";
}

export function calculateTotalPrice(data) {
    let combined = 0;
    data.forEach(({ quantity, product }) => combined += product.price * quantity);
    return combined;
}