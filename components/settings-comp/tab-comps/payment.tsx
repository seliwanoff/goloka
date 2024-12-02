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
import { useEffect, useMemo, useState } from "react";
import {
  addBeneficiary,
  getContributorsProfile,
  resolveAccountInfo,
} from "@/services/contributor";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
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

const Payment: React.FC<any> = () => {
  const { user, isAuthenticated } = useRemoteUserStore();
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
                Beneficiary accounts
              </h3>
              <p className="text-sm text-[#475467]">
                Add or remove beneficiary account
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
            {/* BENEFICIARIES */}
            <div className="mt-12 h-[245px] overflow-y-auto">
              <div className="p-1">
                {isLoading ? (
                  <BeneficiarySkeletonLoader count={3} />
                ) : (
                  <RadioGroup
                    value={selectedValue}
                    onValueChange={handleSelectionChange}
                    className="gap-6"
                  >
                    {beneficiaries?.map((item: Beneficiary) => (
                      <div className="flex w-full items-center" key={item.id}>
                        <RadioGroupItem
                          value={item.id.toString()}
                          id={item.id.toString()}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={item.id.toString()}
                          className={cn(
                            "grid w-full cursor-pointer grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3 transition-all duration-200 hover:bg-gray-50",
                            selectedValue === item.id.toString() &&
                              "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                          )}
                        >
                          <h4
                            className={cn(
                              "text-sm font-medium text-[#4F4F4F]",
                              selectedValue === item.id.toString() &&
                                "text-main-100",
                            )}
                          >
                            {item.account_name}
                          </h4>
                          <p
                            className={cn(
                              "justify-self-end text-right text-sm font-semibold text-[#333]",
                              selectedValue === item.id.toString() &&
                                "text-main-100",
                            )}
                          >
                            {item.account_number}
                          </p>
                          <p
                            className={cn(
                              "text-xs text-[#4F4F4F]",
                              selectedValue === item.id.toString() &&
                                "text-main-100",
                            )}
                          >
                            {item.bank_name}
                          </p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>

            {/* ADD NEW BENEFICIARY */}
            <div className="mt-11">
              <h3 className="mb-4 text-base font-medium leading-7 text-[#333333]">
                Add new beneficiary
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {beneficiaryStruct.map((data, index) => {
                  // Check if the input name is "accountName"
                  if (data.name === "accountName") {
                    return (
                      <div key={data.name} className="relative">
                        {/* ACCOUNT NAME */}
                        <Label
                          htmlFor="accountName"
                          className="mb-2 inline-block text-base text-[#4F4F4F]"
                        >
                          Account name
                        </Label>
                        <Input
                          {...register("accountName")}
                          id="accountName"
                          name="accountName"
                          placeholder="Resolved account name"
                          className={cn(
                            "form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]",
                            errors.accountName &&
                              "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                          )}
                          disabled
                        />
                        {loading && (
                          <Loader className="absolute right-0 top-12 animate-spin text-blue-700" />
                        )}
                      </div>
                    );
                  } else if (data.type === "select") {
                    // Render CustomSelectField if data.type is "select"
                    return (
                      <CustomSelectField
                        key={data.name}
                        data={data}
                        errors={errors}
                        register={register}
                        control={control}
                        options={getFieldOptions(data.name)}
                      />
                    );
                  } else {
                    // Render CustomInput for other cases
                    return (
                      <div key={data.name} className="relative">
                        <CustomInput
                          key={data.name}
                          data={data}
                          errors={errors}
                          register={register}
                          control={control}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 z-30 mt-[42px] grid w-full grid-cols-1 items-center gap-3 bg-white p-4 shadow-[0_0_20px_rgba(0,0,0,0.1)] md:static md:flex md:bg-transparent md:p-0 md:shadow-none">
              <Button
                type="submit"
                className="h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-600"
                disabled={watch("accountName") === undefined && true}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin text-[#fff]" />
                ) : (
                  " Add beneficiary"
                )}
              </Button>
            </div>
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
