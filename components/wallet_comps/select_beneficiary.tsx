"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useWithdrawStepper } from "@/stores/misc";
import { useAddBeneficiaryOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { Add } from "iconsax-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContributorsProfile } from "@/services/contributor";
import { useRouter, useSearchParams } from "next/navigation";
import { useBeneficiaryStore } from "@/stores/use-user-store";
import { useTransactionStore } from "@/stores/useWithdrawal";

interface Beneficiary {
  id: number;
  bank_code: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

const SelectBeneficiary = () => {
  const { bank_code, setBankCode, account_number, setAccountNumber } =
    useTransactionStore();
  const { setOpen } = useWithdrawOverlay();
  const { show, setShow } = useAddBeneficiaryOverlay();
  const { addBeneficiary } = useBeneficiaryStore();
  const { setStep, setTransaction, transaction } = useWithdrawStepper();
  const [selectedValue, setSelectedValue] = useState("");

  const { data: remoteUser, isLoading } = useQuery({
    queryKey: ["Get remote user"],
    queryFn: getContributorsProfile,
  });

  const beneficiaries = useMemo(
    //@ts-ignore
    () => remoteUser?.data?.bank_accounts,
    [remoteUser?.data],
  );

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
      setAccountNumber(selected.account_number);
      setBankCode(String(selected.bank_code));
    }
  };

  const handleProceed = () => {
    const selected = beneficiaries?.find(
      (item: Beneficiary) => item.id.toString() === selectedValue,
    );

    if (selected) {
      addBeneficiary(selected);
      setStep(1);
    }
  };

  const handleAddBeneficiary = () => {
    setOpen(false);
    setShow(true);
  };

  console.log({ beneficiaries });

  return (
    <div>
      {beneficiaries && beneficiaries.length > 0 ? (
        <div>
          <div className="">
            <h3 className="text-center font-medium text-[#333333]">
              Select beneficiary account before proceeding
            </h3>

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

            <Button
              onClick={handleAddBeneficiary}
              className="my-11 h-14 w-full items-center justify-start gap-3 rounded-full bg-[#F8F8F8] p-3 hover:bg-current"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-[#E0E0E0] bg-[#F4F4F4] text-[#333]">
                <Add size={24} />
              </span>
              <span className="text-base text-[#333]">Add new beneficiary</span>
            </Button>
          </div>

          <Button
            disabled={!selectedValue}
            onClick={handleProceed}
            className="mx-auto h-14 w-full rounded-full bg-main-100 p-3 text-base text-white hover:bg-blue-700 hover:text-white disabled:opacity-50"
          >
            Proceed
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-col space-y-10">
            <div className="self-center">
              <svg
                width="105"
                height="79"
                viewBox="0 0 105 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9.27502" cy="16.625" r="2.375" fill="#EAEEF9" />
                <circle cx="4.525" cy="57.9508" r="4.275" fill="#EAEEF9" />
                <circle cx="97.625" cy="13.2992" r="2.85" fill="#EAEEF9" />
                <circle cx="52.5" cy="38" r="38" fill="#EBF0FC" />
                <g filter="url(#filter0_dd_2025_64409)">
                  <rect
                    x="13.075"
                    y="10.4492"
                    width="78.85"
                    height="49.4"
                    rx="2.85"
                    fill="url(#paint0_linear_2025_64409)"
                  />
                  <rect
                    x="19.7584"
                    y="21.9375"
                    width="13.786"
                    height="10.3395"
                    rx="0.95"
                    fill="#D3DFFF"
                  />
                  <circle
                    cx="79.4976"
                    cy="25.3848"
                    r="5.74419"
                    fill="#C1D1FA"
                  />
                  <circle
                    cx="72.6045"
                    cy="25.3848"
                    r="5.74419"
                    fill="url(#paint1_linear_2025_64409)"
                  />
                  <path
                    d="M19.7584 52.3813C19.7584 51.7468 20.2728 51.2324 20.9073 51.2324H32.3956C33.0301 51.2324 33.5445 51.7468 33.5445 52.3813C33.5445 53.0157 33.0301 53.5301 32.3956 53.5301H20.9073C20.2728 53.5301 19.7584 53.0157 19.7584 52.3813Z"
                    fill="#D5DDEA"
                  />
                  <path
                    d="M36.991 52.3813C36.991 51.7468 37.5053 51.2324 38.1398 51.2324H49.6282C50.2627 51.2324 50.777 51.7468 50.777 52.3813C50.777 53.0157 50.2627 53.5301 49.6282 53.5301H38.1398C37.5053 53.5301 36.991 53.0157 36.991 52.3813Z"
                    fill="#D5DDEA"
                  />
                  <path
                    d="M54.2235 52.3813C54.2235 51.7468 54.7379 51.2324 55.3724 51.2324H66.8607C67.4952 51.2324 68.0096 51.7468 68.0096 52.3813C68.0096 53.0157 67.4952 53.5301 66.8607 53.5301H55.3724C54.7379 53.5301 54.2235 53.0157 54.2235 52.3813Z"
                    fill="#D5DDEA"
                  />
                  <path
                    d="M71.4561 52.3813C71.4561 51.7468 71.9704 51.2324 72.6049 51.2324H84.0933C84.7278 51.2324 85.2421 51.7468 85.2421 52.3813C85.2421 53.0157 84.7278 53.5301 84.0933 53.5301H72.6049C71.9704 53.5301 71.4561 53.0157 71.4561 52.3813Z"
                    fill="#D5DDEA"
                  />
                </g>
                <path
                  d="M89.6943 48.4488C90.7913 46.5488 93.5337 46.5488 94.6307 48.4488L103.475 63.7676C104.572 65.6676 103.201 68.0426 101.007 68.0426H83.3182C81.1243 68.0426 79.7531 65.6676 80.85 63.7676L89.6943 48.4488Z"
                  fill="url(#paint2_linear_2025_64409)"
                />
                <path
                  d="M91.0966 63.7675C91.0966 63.5959 91.1303 63.4261 91.196 63.2676C91.2616 63.1091 91.3579 62.9651 91.4791 62.8438C91.6004 62.7225 91.7444 62.6263 91.9029 62.5607C92.0614 62.495 92.2313 62.4612 92.4028 62.4612C92.5743 62.4612 92.7442 62.495 92.9027 62.5607C93.0612 62.6263 93.2052 62.7225 93.3265 62.8438C93.4478 62.9651 93.544 63.1091 93.6096 63.2676C93.6753 63.4261 93.7091 63.5959 93.7091 63.7675C93.7091 64.1139 93.5714 64.4462 93.3265 64.6911C93.0815 64.9361 92.7492 65.0737 92.4028 65.0737C92.0564 65.0737 91.7241 64.9361 91.4791 64.6911C91.2342 64.4462 91.0966 64.1139 91.0966 63.7675ZM91.2246 55.9234C91.2072 55.7586 91.2246 55.592 91.2758 55.4344C91.3269 55.2768 91.4107 55.1317 91.5215 55.0085C91.6324 54.8854 91.7679 54.7869 91.9192 54.7194C92.0706 54.652 92.2345 54.6172 92.4002 54.6172C92.5659 54.6172 92.7298 54.652 92.8811 54.7194C93.0325 54.7869 93.168 54.8854 93.2789 55.0085C93.3897 55.1317 93.4735 55.2768 93.5246 55.4344C93.5758 55.592 93.5932 55.7586 93.5758 55.9234L93.1186 60.5045C93.1001 60.6821 93.0164 60.8465 92.8837 60.966C92.751 61.0855 92.5788 61.1517 92.4002 61.1517C92.2216 61.1517 92.0494 61.0855 91.9167 60.966C91.784 60.8465 91.7003 60.6821 91.6818 60.5045L91.2246 55.9234Z"
                  fill="white"
                />
                <circle cx="99.525" cy="1.9" r="1.9" fill="#EAEEF9" />
                <defs>
                  <filter
                    id="filter0_dd_2025_64409"
                    x="3.57495"
                    y="10.4492"
                    width="97.85"
                    height="68.4004"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="1.9"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect1_dropShadow_2025_64409"
                    />
                    <feOffset dy="3.8" />
                    <feGaussianBlur stdDeviation="1.9" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.03 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2025_64409"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feMorphology
                      radius="1.9"
                      operator="erode"
                      in="SourceAlpha"
                      result="effect2_dropShadow_2025_64409"
                    />
                    <feOffset dy="9.5" />
                    <feGaussianBlur stdDeviation="5.7" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.08 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_2025_64409"
                      result="effect2_dropShadow_2025_64409"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_2025_64409"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_2025_64409"
                    x1="15.8209"
                    y1="59.2645"
                    x2="23.0996"
                    y2="9.34054"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3365E3" />
                    <stop offset="1" stopColor="#6A7EFF" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2025_64409"
                    x1="72.6045"
                    y1="19.6406"
                    x2="72.6045"
                    y2="31.129"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3365E3" />
                    <stop offset="1" stopColor="#1C387D" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_2025_64409"
                    x1="92.1625"
                    y1="28.2613"
                    x2="60.3375"
                    y2="60.0863"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF8960" />
                    <stop offset="1" stopColor="#FF62A5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-center font-bold text-main-100">
                No Beneficiary Added
              </h3>
              <p className="text-center font-medium text-[#4F4F4F]">
                You have not yet add any beneficiary account,
                <br /> add a beneficiary account to make withdrawal
              </p>
            </div>
          </div>

          <Button
            onClick={handleAddBeneficiary}
            className="mx-auto mt-10 h-14 w-full rounded-full bg-main-100 p-3 text-base text-white hover:bg-blue-700 hover:text-white disabled:opacity-50"
          >
            Add new beneficiary
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectBeneficiary;

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
