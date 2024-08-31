import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import PDF from "@/public/assets/images/svg/pdf-file-icon.svg";
import Image from "next/image";
import { transactions } from "@/utils";
import { Button } from "@/components/ui/button";
import { DocumentDownload } from "iconsax-react";
import { cn } from "@/lib/utils";

type ComponentProps = {};

const WalletTable: React.FC<ComponentProps> = () => {
  const router = useRouter();
  return (
    <>
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
          {transactions.map((res: any, index: number) => (
            <TableRow key={index}>
              {/* INCVOICE ID */}
              <TableCell>
                <div
                  onClick={() => router.push("/dashboard/wallet/1")}
                  className="flex items-center gap-3"
                >
                  <span>
                    <Image src={PDF} alt="Pdf icon" />
                  </span>{" "}
                  <div>
                    <h3 className="text-sm font-medium text-[#101828]">
                      {res.invoiceid}
                    </h3>{" "}
                    <p className="xl:hidden">{res?.date}</p>
                  </div>
                </div>
              </TableCell>
              {/* AMOUNT */}
              <TableCell className="table-cell">
                <div className="inline-flex flex-col items-start gap-2">
                  <span className="text-sm font-medium text-[#101828]">
                    {res.amount}
                  </span>
                  <span className="text-sm xl:hidden">{res?.beneficiary}</span>
                </div>{" "}
              </TableCell>
              {/* BENEFICIARY */}
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm font-medium text-[#101828]">
                  {res.beneficiary}
                </span>
              </TableCell>
              {/* BANK */}
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm font-medium text-[#101828]">
                  {res.bank}
                </span>
              </TableCell>
              {/* DATE */}
              <TableCell className="hidden xl:table-cell">
                <span className="text-sm font-medium text-[#101828]">
                  {res.date}
                </span>
              </TableCell>
              {/* STATUS */}
              <TableCell className={cn("hidden lg:table-cell")}>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    // responseStatus(res?.status),
                  )}
                >
                  {res.status}
                </span>
              </TableCell>
              {/* ACTION */}
              <TableCell className="hidden md:table-cell">
                <Button
                  className="items-center gap-3 rounded-full bg-[#3365E30F] text-main-100 hover:bg-[#3365E30F] hover:text-main-100"
                  onClick={() => router.push("/dashboard/wallet/1")}
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
    </>
  );
};

export default WalletTable;
