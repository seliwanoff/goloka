import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { Loader, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { useWithdrawStepper } from "@/stores/misc";
import AddNewBeneficiary from "../add_new_beneficiary";
import {
  getContributorsProfile,
  removeBeneficiary,
} from "@/services/contributor";
import Image from "next/image";
import MasterCard from "@/public/assets/images/Mastercard.svg";
import Visa from "@/public/assets/images/Vector.svg";
import { Trash } from "iconsax-react";
import AddNewCard from "@/components/organization-comps/payment-comps/addcard";

const BeneficiarySkeletonLoader = ({ count = 2 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 justify-self-end rounded bg-gray-200"></div>
            <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex h-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
    <div className="mb-2 text-gray-400">
      <Trash2 className="mx-auto h-8 w-8" />
    </div>
    <h3 className="mb-1 text-sm font-medium text-gray-900">
      No beneficiaries yet
    </h3>
    <p className="text-xs text-gray-500">
      Add your first beneficiary account to get started
    </p>
  </div>
);

const Payment = () => {
  const [cards, setCards] = useState([
    { cardType: "mastercard", beneficiary: "Jamiu Mohammed" },
    { cardType: "visa", beneficiary: "Jamiu Mohammed" },
  ]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null);

  const pathname = usePathname();
  const { user } = useRemoteUserStore();
  const { setTransaction, transaction } = useWithdrawStepper();

  const {
    data: remoteUser,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get remote user"],
    queryFn: getContributorsProfile,
  });
  const beneficiaries = useMemo(
    //@ts-ignore
    () => remoteUser?.data?.bank_accounts,
    [remoteUser?.data],
  );

  const handleSelectionChange = (value: React.SetStateAction<string>) => {
    setSelectedValue(value);
    const selected = beneficiaries?.find(
      (item: { id: { toString: () => any } }) => item.id.toString() === value,
    );
    if (selected) {
      setTransaction((prev) => ({
        ...prev,
        beneficiary: selected.account_name,
        accountNumber: selected.account_number,
        bank: selected.bank_name,
      }));
    }
  };

  const handleDeleteConfirmation = (
    beneficiary: React.SetStateAction<null>,
  ) => {
    setBeneficiaryToDelete(beneficiary);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!beneficiaryToDelete) return;
    setIsDeleting(true);
    try {
      //@ts-ignore
      const res = await removeBeneficiary(beneficiaryToDelete.id);
      await refetch();
      if (res) {
        toast.success("Beneficiary deleted successfully!");
        setDeleteModalOpen(false);
        setSelectedValue("");
      }
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data);
    } finally {
      setIsDeleting(false);
      setBeneficiaryToDelete(null);
    }
  };

  return (
    <>
      <div className="block max-w-4xl" id="payment">
        <div className="w-full rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                {pathname.startsWith("/organization")
                  ? "Saved cards"
                  : "Beneficiary accounts"}
              </h3>
              {!pathname.startsWith("/organization") &&
                beneficiaries?.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {beneficiaries.length}{" "}
                    {beneficiaries.length === 1
                      ? "beneficiary"
                      : "beneficiaries"}
                  </span>
                )}
            </div>
            {transaction?.accountNumber && (
              <Button
                className="h-auto w-auto rounded-full py-3 text-white"
                variant="destructive"
              >
                Delete beneficiary
              </Button>
            )}
          </div>

          <div className="mt-8">
            {pathname.startsWith("/organization") ? (
              <div className="no-scrollbar h-[180px] space-y-5 overflow-y-auto">
                {cards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-full border border-[#F2F2F2] bg-[#F8F8F8] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        {card?.cardType === "mastercard" ? (
                          <Image src={MasterCard} alt="mastercard" />
                        ) : (
                          <Image src={Visa} alt="visa" />
                        )}
                      </div>
                      <div>
                        <h3>{card?.beneficiary}</h3>
                        <p>**** **** **** 1121</p>
                      </div>
                    </div>
                    <span className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FF36001F] text-[#FF3600]">
                      <Trash />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-scrollbar h-[180px] overflow-y-auto">
                {isLoading ? (
                  <BeneficiarySkeletonLoader />
                ) : beneficiaries?.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="p-1">
                    <RadioGroup
                      value={selectedValue}
                      onValueChange={handleSelectionChange}
                      className="gap-5"
                    >
                      {beneficiaries?.map(
                        (item: {
                          id: React.Key | null | undefined;
                          account_name:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          bank_name:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          account_number:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                        }) => (
                          <div
                            key={item.id}
                            className="group relative rounded-lg border border-[#4f4f4f4a] bg-white p-3 shadow-sm"
                          >
                            <div className="space-y-1">
                              <h3 className="text-base font-medium text-[#4F4F4F]">
                                {item.account_name}
                              </h3>
                              <div className="flex text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-[#4F4F4F]">
                                    {item.bank_name}
                                  </span>
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4F4F4F]" />
                                </div>
                                <div className="ml-3 text-sm text-[#4F4F4F]">
                                  {item.account_number}
                                </div>
                              </div>
                            </div>
                            <button
                              //@ts-ignore
                              onClick={() => handleDeleteConfirmation(item)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                              aria-label="Delete account"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ),
                      )}
                    </RadioGroup>
                  </div>
                )}
              </div>
            )}

            {pathname.startsWith("/organization") ? (
              <AddNewCard />
            ) : (
                //@ts-ignore
              <AddNewBeneficiary refetch={refetch} />
            )}
          </div>
        </div>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Beneficiary</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this beneficiary account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader className="animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Payment;
