"use client";
import { chunkArray } from "@/lib/utils";
import { ExportSquare, Login } from "iconsax-react";
import React, { useCallback, useEffect, useState } from "react";
import WalletTable from "@/components/lib/widgets/wallet_table";
import WalletTableOptions from "@/components/lib/widgets/WalletTableOptions";
import { useWalletFilter, useWithdrawStepperOrganization } from "@/stores/misc";

import InvoiceModal from "@/components/lib/modals/invoice_modal";

import {
  useTransferOverlay,
  useWithdrawalfundsOverlay,
} from "@/stores/overlay";

import CreateWithdrawal from "@/components/lib/modals/create_withdrawal";
import CreateBeneficiary from "@/components/lib/modals/create_beneficiary";
import CreateTransfer from "@/components/lib/modals/create_transfer";
import { useQuery } from "@tanstack/react-query";

import { numberWithCommas } from "@/helper";
import { getAllTransactions } from "@/services/transactions";

import { useRemoteUserStore } from "@/stores/remoteUser";
import { useUserStore } from "@/stores/currentUserStore";

import { useWalletStore } from "@/stores/useWithdrawal";
import WalletFunding from "@/components/lib/widgets/walllet_funding_table";
import WalletFundungTable from "@/components/lib/widgets/walllet_funding_table";
import WithdrawFund from "@/components/lib/modals/withdraw-fund";
import WithdrawFunds from "@/components/lib/widgets/withdraw_fund";
import { useSearchParams } from "next/navigation";
import {
  getOrganizationByDomain,
  validateTopUp,
} from "@/services/organization";
import { toast } from "sonner";
import TransferSuccessful from "@/components/wallet_comps/transfer_successful";
import TopUpSuccessful from "@/components/wallet_comps/top_up_success";
import { useTopUpStores } from "@/stores/topUpstore";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import InvoiceModalOrganization from "@/components/lib/modals/invoice_modal_organization";

const WalletPage = () => {
  const { user, isAuthenticated } = useRemoteUserStore();
  const { user: currentUser, refetchUser } = useUserStore();
  const [trxId, setTrxId] = useState("");
  const { response, error } = useWalletStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const { filterType } = useWalletFilter();
  const { setOpen } = useWithdrawalfundsOverlay();

  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(expenses, pageSize);
  const searchParams = useSearchParams();
  const { amount, step, setStep } = useWithdrawStepperOrganization();
  const ref = searchParams.get("reference") || 0;
  const trxref = searchParams.get("trxref") || 0;
  const [validated, setValidated] = useState(false); // Tracks whether validation is successful
  const [isPolling, setIsPolling] = useState(false);
  const { setDate, setWallet_id, setAmount, setReference } = useTopUpStores();

  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );
  // console.log(step);
  const [data, setData] = useState<any>([]);
  // Tracks polling state

  // const fetchData = () => {
  //   return getAllTransactions({
  //     // search: debouncedSearchTerm,
  //     // type,
  //     // page,
  //     // per_page: perPage,
  //     // min_price: min_payment,
  //     // max_price: max_payment,
  //   });
  // };

  //@ts-ignore
  const USER_CURRENCY_SYMBOL =
    currentOrganization && currentOrganization["symbol"];

  // useEffect(() => {
  //   console.log(filterType);

  //   const filter = (status: string) =>
  //     transactions?.filter(
  //       (item) => item?.status?.toLowerCase() === status?.toLowerCase(),
  //     );
  //   switch (filterType) {
  //     case "pending":
  //       return setExpenses(filter("pending"));
  //     case "failed":
  //       return setExpenses(filter("failed"));
  //     case "successful":
  //       return setExpenses(filter("successful"));
  //     case "all":
  //     default:
  //       return setExpenses(transactions);
  //   }
  // }, [filterType]);

  useEffect(() => {
    if (response) {
      refetchUser();
    }
  }, [response, refetchUser]);
  // console.log(step);

  const validateTop = useCallback(async () => {
    try {
      const response = await validateTopUp(trxref, ref);

      if (response) {
        setValidated(true);
        setIsPolling(false);
        setOpen(true);
        setStep(2);
        setAmount(amount);
        setReference(ref || "");
        setDate(response.data.created_at);
        // refetchUser()
        const url = new URL(window.location.href);
        url.search = ""; // Clear the query string
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err: any) {
      console.error("Error during validation:", err);
      // toast.error(err.message || "An error occurred during validation.");
    } finally {
      await getOrgaization();
    }
  }, [trxref, ref]);

  useEffect(() => {
    if (trxref && ref && !validated) {
      setIsPolling(true);

      validateTop();
    }
  }, [trxref, ref, validateTop, validated]);

  const getOrgaization = async () => {
    try {
      const response = await getOrganizationByDomain();
      //  console.log(response);
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrgaization();
  }, []);
  return (
    <>
      <WithdrawFund />

      <section className="pb-10 pt-[34px]" suppressHydrationWarning>
        {/* ####################################### */}
        {/* -- stats card section */}
        {/* ####################################### */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-between rounded-[8px] bg-main-100 p-6">
            <div className="text-center">
              <h1 className="text-[2rem] font-bold text-white">
                {/* @ts-ignore */}
                {USER_CURRENCY_SYMBOL || ""}{" "}
                {numberWithCommas(data?.wallet_balance || 0)}
              </h1>
              <p className="text-sm font-medium text-white">Wallet balance</p>
            </div>
            <p className="text-sm font-medium text-white">
              Minimum withdrawal:{" "}
              <span className="font-semibold">
                {USER_CURRENCY_SYMBOL || ""} 500
              </span>
            </p>{" "}
          </div>
          <div className="grid gap-4 rounded-[8px] border border-[#F2F2F2] bg-white p-4 lg:grid-cols-1 xl:gap-6 xl:p-6">
            <h2 className="font-medium text-[#333333] lg:col-span-2">
              Quick Actions
            </h2>

            <div
              onClick={() => setOpen(true)}
              className="grid cursor-pointer grid-cols-[40px_1fr] items-center gap-4 rounded-[12px] bg-[#F8F8F8] p-3.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0E0E0]">
                <ExportSquare size={20} color="currentColor" />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-[#000000D9]">
                  Fund wallet
                </h3>
                <p className="text-xs text-[#828282]">
                  Add money to your wallet for campaign contributors
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-white p-[14px]">
          {/* OPTIONS
          <WalletTableOptions /> */}

          {/* TABLE */}
          <div className="">
            <div>
              <WalletFundungTable />
            </div>

            <div className="mt-6">
              {/* <Pagination
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

      <div className="col-span-2 md:col-span-1 md:place-self-end">
        <InvoiceModalOrganization />
      </div>
    </>
  );
};

export default WalletPage;
