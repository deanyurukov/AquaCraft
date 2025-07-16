import { Link } from "react-router-dom";

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let index = 1; index <= Math.ceil(totalProducts / productsPerPage); index++) {
        pageNumbers.push(index);
    }

    return (
        <div className="pagination-wrapper">
                <button onClick={() => paginate(currentPage - 1)} type="button" disabled={currentPage === 1}>
                    <i class="fa-solid fa-arrow-left"></i> Prev
                </button>

                <p>Page {currentPage} of {pageNumbers.length}</p>

                <button onClick={() => paginate(currentPage + 1)} type="button" disabled={currentPage === pageNumbers.length}>
                    Next <i class="fa-solid fa-arrow-right"></i>
                </button>
        </div>
    );
};

export default Pagination;