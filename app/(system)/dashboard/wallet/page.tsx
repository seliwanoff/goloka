"use client";
import { chunkArray, cn } from "@/lib/utils";
import { Add, ArrowLeft, ExportSquare, Login } from "iconsax-react";
import React, { useEffect, useState } from "react";
import WalletTable from "@/components/lib/widgets/wallet_table";
import WalletTableOptions from "@/components/lib/widgets/WalletTableOptions";
import { useWalletFilter, useWithdrawStepper } from "@/stores/misc";
import { myBeneficiaries, transactions } from "@/utils";
import InvoiceModal from "@/components/lib/modals/invoice_modal";

import {
  useAddBeneficiaryOverlay,
  useTransferOverlay,
  useWithdrawOverlay,
} from "@/stores/overlay";
import WithdrawalStepper from "@/components/wallet_comps/withdrawal_stepper";
import Pagination from "@/components/lib/navigation/Pagination";
import { useMediaQuery } from "@react-hook/media-query";
import AddBeneficiary from "@/components/lib/widgets/add_beneficiary";
import CreateWithdrawal from "@/components/lib/modals/create_withdrawal";
import CreateBeneficiary from "@/components/lib/modals/create_beneficiary";
import CreateTransfer from "@/components/lib/modals/create_transfer";

const page = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const { filterType } = useWalletFilter();
  const { setOpen } = useWithdrawOverlay();
  const { setOpenTransfer } = useTransferOverlay();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(expenses, pageSize);

  // FILTERING TABLE DATA
  useEffect(() => {
    console.log(filterType);

    const filter = (status: string) =>
      transactions?.filter(
        (item) => item?.status?.toLowerCase() === status?.toLowerCase(),
      );
    switch (filterType) {
      case "pending":
        return setExpenses(filter("pending"));
      case "failed":
        return setExpenses(filter("failed"));
      case "successful":
        return setExpenses(filter("successful"));
      case "all":
      default:
        return setExpenses(transactions);
    }
  }, [filterType]);
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

            <div
              onClick={() => setOpen(true)}
              className="grid cursor-pointer grid-cols-[40px_1fr] items-center gap-4 rounded-[12px] bg-[#F8F8F8] p-3.5"
            >
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
            <div
              onClick={() => setOpenTransfer(true)}
              className="grid cursor-pointer grid-cols-[40px_1fr] items-center gap-4 rounded-[12px] bg-[#F8F8F8] p-3.5"
            >
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
              <WalletTable data={expenses} />
            </div>

            <div className="mt-6">
              <Pagination
                totalPages={pages?.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                RowSize={pageSize}
                onRowSizeChange={setPageSize}
              />
            </div>
          </div>
        </div>
      </section>

      {/* INVOICE SHEET */}
      <div className="col-span-2 md:col-span-1 md:place-self-end">
        <InvoiceModal />
      </div>

      {/*---------- WITHDRAW ----------*/}
      <CreateWithdrawal />

      {/*---------- ADD BENEFICIARY ----------*/}
      <CreateBeneficiary />

      {/*---------- TRANSFER ----------*/}
      <CreateTransfer />
    </>
  );
};

export default page;
