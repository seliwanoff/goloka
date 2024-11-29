import { myBeneficiaries } from "@/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Trash } from "iconsax-react";
import MasterCard from "@/public/assets/images/Mastercard.svg";
import Visa from "@/public/assets/images/Vector.svg";
import Image from "next/image";
import AddCard from "@/components/organization-comps/payment-comps/addcard";
import AddNewCard from "@/components/organization-comps/payment-comps/addcard";
import AddNewBeneficiary from "../add_new_beneficiary";

const Payment: React.FC<any> = ({}) => {
  const pathname = usePathname();
  const [selectedValue, setSelectedValue] = useState("");
  const [beneficiaries, setBeneficiaries] = useState(myBeneficiaries);
  const [cards, setCards] = useState([
    {
      cardType: "mastercard",
      cardNo: "5434 4434 3223 2234",
      beneficiary: "Jamiu jimoh",
    },
    {
      cardType: "visa",
      cardNo: "5434 4434 3223 2234",
      beneficiary: "Jamiu jimoh",
    },
  ]);

  return (
    <>
      <div className="block max-w-4xl">
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
      </div>
    </>
  );
};

export default Payment;
