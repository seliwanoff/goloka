import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import PDF from "@/public/assets/images/svg/pdf-file-icon.svg";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { DocumentDownload } from "iconsax-react";
import { cn, walletStatus } from "@/lib/utils";
import { useInvoiceOverlay } from "@/stores/overlay";
import moment from "moment";
import WalletTableOptions from "./WalletTableOptions";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/services/transactions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRemoteUserStore } from "@/stores/remoteUser";

interface Transaction {
  invoiceid: string;
  reference: string;
  amount: string;
  meta?: {
    beneficiary?: {
      account_name: string;
      bank_name: string;
    };
  };
  created_at: string;
  status: "pending" | "successful" | "failed";
}

const WalletTable = () => {
  const searchParams = useSearchParams();
  const { open, setOpen, setId } = useInvoiceOverlay();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { user, isAuthenticated } = useRemoteUserStore();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const {
    data: trnsactions,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["Get transactions list", currentPage, searchParams.toString()],
    queryFn: () =>
      getAllTransactions({
        page: currentPage,
        per_page: 9,
        search: searchParams.get("search") || undefined,
        start_date: searchParams.get("startDate") || undefined,
        end_date: searchParams.get("endDate") || undefined,
        type: searchParams.get("type") || undefined,
      }),
  });
  const handleDownload = (id: string) => {
    setOpen(true);
    setId && setId(id);
  };
  //@ts-ignore
  const totalPages = trnsactions?.pagination?.total_pages || 1;
  //@ts-ignore
  const currentPageFromResponse = trnsactions?.pagination?.current_page || 1;
  const data = trnsactions?.data;
  console.log("object", trnsactions);
  console.log("totalPages", totalPages);
  console.log("currentPage", currentPage);

  // Event handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render ellipsis if necessary
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageSelect(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return pageNumbers;
  };

  return (
    <>
      {/* OPTIONS */}
      <WalletTableOptions />
      <Table>
        <TableHeader>
          <TableRow className="bg-[#FBFBFB]">
            <TableHead>Invoice ID</TableHead>
            <TableHead className="">Amount</TableHead>
            <TableHead className="hidden xl:table-cell">Beneficiary</TableHead>
            <TableHead className="hidden lg:table-cell">Bank</TableHead>
            <TableHead className="hidden xl:table-cell">
              Date submitted
            </TableHead>
            <TableHead className="hidden lg:table-cell">Status </TableHead>
            <TableHead className="hidden md:table-cell">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {pages[currentPage - 1].map((res: any, index: number) => ( */}
          {data?.map((res: any, index: number) => (
            <TableRow key={index}>
              {/* INCVOICE ID */}
              <TableCell>
                <div
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-3"
                >
                  <span>
                    <Image src={PDF} alt="Pdf icon" />
                  </span>{" "}
                  <div>
                    <h3 className="text-sm font-medium text-[#101828]">
                      {res.reference}
                    </h3>{" "}
                    <p className="xl:hidden">
                      {moment(res?.created_at).format("DD MMMM YYYY")}
                    </p>
                  </div>
                </div>
              </TableCell>
              {/* AMOUNT */}
              <TableCell className="table-cell">
                <div className="inline-flex flex-col items-start gap-2">
                  {/* <span className="text-sm font-medium text-[#101828]">
                    {USER_CURRENCY_SYMBOL} {res.amount}
                  </span> */}
                  <span className="text-sm font-medium text-[#101828]">
                    {USER_CURRENCY_SYMBOL}{" "}
                    {Math.abs(parseFloat(res.amount || "0")).toLocaleString()}
                  </span>
                  <span className="text-sm xl:hidden">
                    {res?.meta?.beneficiary?.account_name}
                  </span>
                </div>{" "}
              </TableCell>
              {/* BENEFICIARY */}
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm font-medium text-[#101828]">
                  {res?.meta?.beneficiary?.account_name}
                </span>
              </TableCell>
              {/* BANK */}
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm font-medium text-[#101828]">
                  {res?.meta?.beneficiary?.bank_name}
                </span>
              </TableCell>
              {/* DATE */}
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm font-medium text-[#101828]">
                  {moment(res?.created_at).format("DD MMMM YYYY")}
                </span>
              </TableCell>
              {/* STATUS */}
              <TableCell className={cn("hidden lg:table-cell")}>
                <span
                  className={cn(
                    "flex w-[84px] items-center justify-center rounded-full px-2 py-1.5 text-xs font-medium capitalize",
                    walletStatus(res?.status),
                  )}
                >
                  {res.status}
                </span>
              </TableCell>
              {/* ACTION */}
              <TableCell className="hidden md:table-cell">
                <Button
                  className="items-center gap-3 rounded-full bg-[#3365E30F] text-main-100 hover:bg-[#3365E30F] hover:text-main-100"
                  onClick={() => handleDownload(res.reference)}
                >
                  <span>
                    <DocumentDownload size={20} />
                  </span>{" "}
                  Download file
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="self-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
                }}
                isActive={currentPage === 1 || isLoading || isFetching}
              />
            </PaginationItem>

            {renderPageNumbers()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
                isActive={currentPage === totalPages || isLoading || isFetching}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default WalletTable;
