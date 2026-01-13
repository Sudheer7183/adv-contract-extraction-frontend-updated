import React from 'react';


interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}


const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisiblePages = 5; // Adjust this number based on your preference
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);


    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);


    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }


    return (
        <nav aria-label='Page navigation'>
            <ul className='pagination'>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className='page-link' onClick={() => onPageChange(currentPage - 1)}>
                        Previous
                    </a>
                </li>
                {pages.slice(startPage - 1, endPage).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <a className='page-link' onClick={() => onPageChange(page)}>
                            {page}
                        </a>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className='page-link' onClick={() => onPageChange(currentPage + 1)}>
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
};


export default Pagination;
