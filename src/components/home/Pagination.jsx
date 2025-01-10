import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevClick = () => {
    onPageChange(currentPage - 1);
    window.scrollTo({
      top: 300,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleNextClick = () => {
    onPageChange(currentPage + 1);
    window.scrollTo({
      top: 300,
      left: 0,
      behavior: "smooth",
    });
  };

  // Don't render pagination if there's only 1 page
  if (totalPages <= 1) return null;
  return (
    <div className="pagination-container">
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className="pagination-arrow"
        aria-label="Previous page"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="pagination-counter">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
        aria-label="Next page"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
