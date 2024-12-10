import CustomInput from "@/components/lib/widgets/custom_inputs";
import { Button } from "@/components/ui/button";
import { bankList, currencyOptions, beneficiaryStruct } from "@/utils";
import CustomSelectField from "../select_field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useMemo } from "react";
import {
  addBeneficiary,
  getContributorsProfile,
  resolveAccountInfo,
} from "@/services/contributor";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { Input } from "@/components/ui/input";
import { Loader, Trash2 } from "lucide-react";
import { useWithdrawStepper } from "@/stores/misc";

interface Beneficiary {
  id: number;
  bank_code: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

const schema = yup.object().shape({
  // currency: yup.string().required(),
  bankName: yup.string().required(),
  accountName: yup.string().required(),
  accountNumber: yup
    .string()
    .required()
    .min(10, "Account number must be exactly 10 digits")
    .max(10, "Account number must be exactly 10 digits"),
});
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Trash } from "iconsax-react";
import MasterCard from "@/public/assets/images/Mastercard.svg";
import Visa from "@/public/assets/images/Vector.svg";
import Image from "next/image";
import AddCard from "@/components/organization-comps/payment-comps/addcard";
import AddNewCard from "@/components/organization-comps/payment-comps/addcard";
import AddNewBeneficiary from "../add_new_beneficiary";

const Payment: React.FC<any> = () => {
  const [cards, setCards] = useState([
    { cardType: "mastercard", beneficiary: "Jamiu Mohammed" },
    { cardType: "visa", beneficiary: "Jamiu Mohammed" },
  ]);
  const { user, isAuthenticated } = useRemoteUserStore();
  const pathname = usePathname();
  const [selectedValue, setSelectedValue] = useState("");
  const {
    data: remoteUser,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get remote user"],
    queryFn: getContributorsProfile,
  });
  const { setStep, setTransaction, transaction } = useWithdrawStepper();
  const currencyOptions = useMemo(() => {
    if (!user?.country) return [];

    return [
      {
        label: user.country["currency-code"],
        value: user.country.label.toLowerCase(),
      },
    ];
  }, [user]);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const accountNumber = watch("accountNumber");
  const bankCode = watch("bankName");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getFieldOptions = (name: string) => {
    switch (name) {
      case "currency":
        return currencyOptions;
      case "bankName":
        return bankList;
      default:
        return [];
    }
  };
  const beneficiaries = useMemo(
    //@ts-ignore
    () => remoteUser?.data?.bank_accounts,
    [remoteUser?.data],
  );

  console.log(transaction, "transaction");

  // Handle selection change
  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    const selected = beneficiaries?.find(
      (item: Beneficiary) => item.id.toString() === value,
    );
    if (selected) {
      setTransaction((prev) => ({
        ...prev,
        beneficiary: selected.account_name,
        accountNumber: selected.account_number,
        bank: selected.bank_name,
      }));
      //   setAccountNumber(selected.account_number);
      //   setBankCode(String(selected.bank_code));
      // }
    }
  };
  useEffect(() => {
    if (accountNumber?.length === 10 && bankCode) {
      setLoading(true);
      const fetchAccountName = async () => {
        try {
          const response = await resolveAccountInfo(accountNumber, bankCode);
          if (response) {
            //@ts-ignore
            const accountName = response?.data?.account_name;
            setValue("accountName", accountName);

            console.log(response, "hfhfh");
            setLoading(false);
            toast.success("Account Resolved Successfully");
          }
        } catch (error) {
          console.error("Error resolving account info", error);
        }
      };

      fetchAccountName();
    }
  }, [accountNumber, bankCode, setValue]);

  const onAddBeneficiary = async (data: any) => {
    const { accountNumber, bankName } = data;
    try {
      console.log(data, "New Beneficiary");
      const res = await addBeneficiary(accountNumber, bankName);
      refetch();
      toast.success("Beneficiary added successfully!");
      console.log(res, "Account Added Successfully");
      // setShow(false);
      reset();
    } catch (error) {
      toast.error("Failed to add beneficiary. Please try again.");
      //@ts-ignore
      console.error(error?.response?.data?.message);
      // setShow(true);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onAddBeneficiary)}
        className="block max-w-4xl"
        id="payment"
      >
        <div className="w-full rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                {pathname.startsWith("/organization")
                  ? "Saved cards"
                  : "Beneficiary accounts"}
              </h3>
              <p className="text-sm text-[#475467]">
                {pathname.startsWith("/organization")
                  ? "Add or remove card"
                  : "Add or remove beneficiary account"}
              </p>
            </div>
            {transaction?.accountNumber && (
              <div>
                <Button
                  className="h-auto w-full rounded-full py-3 text-white"
                  variant={"destructive"}
                >
                  {" Delete beneficiary"}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8">
            {pathname.startsWith("/organization") ? (
              <>
                {/* SAVED CARDS */}
                <div className="no-scrollbar h-[180px] space-y-5 overflow-y-auto">
                  {cards.map((card: any, i: number) => {
                    return (
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
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* BENEFICIARIES */}
                <div className="no-scrollbar h-[180px] overflow-y-auto">
                  <div className="p-1">
                    <RadioGroup
                      defaultValue={selectedValue}
                      onValueChange={setSelectedValue}
                      className="gap-5"
                    >
                      {beneficiaries.map((item: any, i: number) => {
                        if (i > 1) return;
                        return (
                          <div className="flex w-full items-center" key={i}>
                            <RadioGroupItem
                              value={item.value}
                              id={item.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={item.value}
                              className={cn(
                                "grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3.5",
                                selectedValue === item?.value &&
                                  "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                              )}
                            >
                              <h4
                                className={cn(
                                  "text-sm font-medium text-[#4F4F4F]",
                                  selectedValue === item?.value &&
                                    "text-main-100",
                                )}
                              >
                                {item?.name}
                              </h4>
                              <p
                                className={cn(
                                  "justify-self-end text-right text-sm font-semibold text-[#333]",
                                  selectedValue === item?.value &&
                                    "text-main-100",
                                )}
                              >
                                {item.accountNumber}
                              </p>
                              <p
                                className={cn(
                                  "text-xs text-[#4F4F4F]",
                                  selectedValue === item?.value &&
                                    "text-main-100",
                                )}
                              >
                                {item.bank}
                              </p>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </>
            )}

            {pathname.startsWith("/organization") ? (
              <AddNewCard />
            ) : (
              <AddNewBeneficiary />
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default Payment;
const BeneficiarySkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-gray-200 bg-gray-100 p-3">
            <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 justify-self-end rounded bg-gray-300"></div>
            <div className="h-3 w-1/2 rounded bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
