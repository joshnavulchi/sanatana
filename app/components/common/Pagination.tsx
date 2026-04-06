import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <nav className="flex items-center gap-2">
      <button
        className="rounded-xl border border-[#d8a25a] bg-[#fffaf0] px-3 py-1 text-lg sm:text-base font-semibold text-[#7a2e1f] disabled:opacity-50 cursor-pointer"
        onClick={handlePrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        &larr;
      </button>
      <span className="px-2 text-[#5b2d12] text-lg sm:text-base leading-relaxed font-normal">
        {page} / {totalPages}
      </span>
      <button
        className="rounded-xl border border-[#d8a25a] bg-[#fffaf0] px-3 py-1 text-lg sm:text-base font-semibold text-[#7a2e1f] disabled:opacity-50 cursor-pointer"
        onClick={handleNext}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </nav>
  );
};

export default Pagination;

