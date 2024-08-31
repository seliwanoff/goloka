"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  DocumentDownload,
  ExportSquare,
  Login,
  LoginCurve,
  Setting4,
} from "iconsax-react";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
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
import WalletTable from "@/components/lib/widgets/wallet_table";
import WalletTableOptions from "@/components/lib/widgets/WalletTableOptions";
import { useShowFilter } from "@/stores/overlay";

const page = () => {
  const [date, setDate] = useState<Date | undefined>();
  const { openFilter, setOpenFilter } = useShowFilter();
  const router = useRouter();

  return (
    <>
      <section className="pb-10 pt-[34px]">
        {/* ####################################### */}
        {/* -- stats card section */}
        {/* ####################################### */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-between rounded-[8px] bg-main-100 p-6">
            <div>
              <h1 className="text-[2rem] font-bold text-white">$3,200</h1>
              <p className="text-sm font-medium text-white">Wallet balance</p>
            </div>
            <p className="text-sm font-medium text-white">
              Minimum withdrawal: <span className="font-semibold">$10</span>
            </p>{" "}
          </div>
          <div className="grid gap-4 rounded-[8px] border border-[#F2F2F2] bg-white p-4 lg:grid-cols-2 xl:gap-6 xl:p-6">
            <h2 className="font-medium text-[#333333] lg:col-span-2">
              Quick Actions
            </h2>

            <div className="grid grid-cols-[40px_1fr] items-center gap-4 rounded-[12px] bg-[#F8F8F8] p-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0E0E0]">
                <ExportSquare size={20} />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-[#000000D9]">
                  Withdraw cash
                </h3>
                <p className="text-xs text-[#828282]">
                  Withdraw cash to you local account
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[40px_1fr] items-center gap-4 rounded-[12px] bg-[#F8F8F8] p-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0E0E0]">
                <Login size={20} />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-[#000000D9]">
                  Transfer cash
                </h3>
                <p className="text-xs text-[#828282]">
                  Transfer cash to organisation account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-white p-[14px]">
          {/* OPTIONS */}
          <WalletTableOptions />

          {/* TABLE */}
          <div className="">
            <div>
              <WalletTable />
            </div>

            <div className="mt-6">
              {/*   
              <Pagination
                totalPages={pages?.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                RowSize={pageSize}
                onRowSizeChange={setPageSize}
              /> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
