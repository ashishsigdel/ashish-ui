import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  textColor?: string;
  bgColor?: string;
  activeBgColor?: string;
  activeTextColor?: string;
  hoverBgClass?: string; // includes 'hover:' prefix
  hoverTextClass?: string; // includes 'hover:' prefix
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,

  textColor = "text-gray-200 dark:text-gray-700",
  bgColor = "bg-gray-800 dark:bg-gray-200",
  activeBgColor = "bg-blue-500",
  activeTextColor = "text-white",
  hoverBgClass = "hover:bg-gray-700 dark:hover:bg-gray-300",
  hoverTextClass = "hover:text-white",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [1];

    if (totalPages <= 7) {
      for (let i = 2; i < totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, "...", totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push("...", totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pageNumbers.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "..."
        );
      }
    }

    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  return (
    <div className="mt-6 flex w-full items-center justify-between border-t border-gray-200 pt-4 max-sm:flex-col max-sm:space-y-3">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Showing page {currentPage} of {totalPages} pages
      </span>

      <ul className="flex items-center flex-wrap">
        {currentPage > 1 && (
          <li
            className="mr-1 cursor-pointer"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <p
              className={`flex h-8 items-center justify-center rounded px-3 text-base font-light ${textColor} ${bgColor} ${hoverBgClass} ${hoverTextClass}`}
            >
              <FaChevronLeft className="mr-1" /> Prev
            </p>
          </li>
        )}

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <li key={`ellipsis-${index}`} className="mx-1">
              <p className="flex h-8 w-8 items-center justify-center text-base font-light">
                ...
              </p>
            </li>
          ) : (
            <li key={`page-${page}`} className="mx-1 cursor-pointer">
              <p
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`flex h-8 w-8 items-center justify-center rounded text-base font-light ${
                  currentPage === page
                    ? `${activeBgColor} ${activeTextColor}`
                    : `${bgColor} ${textColor} ${hoverBgClass} ${hoverTextClass}`
                }`}
              >
                {page}
              </p>
            </li>
          )
        )}

        {currentPage < totalPages && (
          <li
            className="ml-1 cursor-pointer"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <p
              className={`flex h-8 items-center justify-center rounded px-3 text-base font-light ${textColor} ${bgColor} ${hoverBgClass} ${hoverTextClass}`}
            >
              Next <FaChevronRight className="ml-1" />
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}
