import { Link } from "react-router-dom";

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let index = 1; index <= Math.ceil(totalProducts / productsPerPage); index++) {
        pageNumbers.push(index);
    }

    return (
        <div className="pagination-wrapper">
            {pageNumbers[currentPage - 2] && (
                <button onClick={() => paginate(currentPage - 1)} type="button">
                    <Link>{currentPage - 1}</Link>
                </button>
            )}

            <button
                onClick={() => paginate(currentPage)}
                type="button"
                className="active"
            >
                <Link to="#">{currentPage}</Link>
            </button>
            {pageNumbers[currentPage] && (
                <button onClick={() => paginate(currentPage + 1)} type="button">
                    <Link>{currentPage + 1}</Link>
                </button>
            )}
        </div>
    );
};

export default Pagination;