const ProductsFilter = ({ filter, removeFilter }) => {
    return (
        <div>
            <p>{filter}</p>
            <button onClick={() => removeFilter(filter)}><i className="fa-solid fa-xmark"></i></button>
        </div>
    );
}

export default ProductsFilter;