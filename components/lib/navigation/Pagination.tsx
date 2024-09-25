import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  pageSize = 3,
  RowSize,
  onRowSizeChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number; // Default is 3
  RowSize: number;
  onRowSizeChange: any;
}) => {
  const getPageNumbers = () => {
    let startPage = Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
    let endPage = Math.min(startPage + pageSize - 1, totalPages);

    // Adjust the start page if there are less than set of 3 pages at the end
    if (totalPages - startPage < pageSize - 1) {
      startPage = Math.max(1, totalPages - pageSize + 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
    return pages;
  };

  const visiblePages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // console.log(RowSize, typeof RowSize, "ROw");

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="inline-flex items-center gap-5">
        <div className="hidden items-center gap-3 sm:inline-flex">
          <p>Rows per page</p>
          <Select defaultValue="10" onValueChange={onRowSizeChange}>
            <SelectTrigger className="h-7 w-auto gap-2 px-2 focus:border-main-100 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a row per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Row per page</SelectLabel>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span>
          {currentPage} of {totalPages}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-main-100"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span>
            <ArrowLeft2 size="20" />
          </span>
          Prev
        </Button>
        {visiblePages.map((page, index) => (
          <Button
            variant="outline"
            className={cn(
              "h-6 w-6 p-2 text-sm",
              page === currentPage
                ? "bg-main-100 text-white hover:bg-blue-700 hover:text-white"
                : "",
            )}
            key={page + index}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-main-100"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next{" "}
          <span>
            <ArrowRight2 size="20" />
          </span>
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
