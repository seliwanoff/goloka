"use client";
import { useRouter } from "next/navigation";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmallAnswer } from "@/components/ui/small-input-answer";
import { Label } from "@radix-ui/react-label";
import { Note } from "iconsax-react";
import { useEffect, useState } from "react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getCountry, getLgs, getOTP, getState } from "@/services/misc";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "iconsax-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@headlessui/react";
import DatePicker from "@/components/settings-comp/date_picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { getOrganizationCampaign } from "@/services/campaign";
import { FaSpinner } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import IconAdd from "@/public/assets/images/add.png";
import CreateCampaingGroup from "@/components/lib/modals/create_campaign_group";
import SuccessDialog from "@/components/lib/modals/success_modal";
import { toast } from "sonner";

import {
  useAddcampaignGroupOverlay,
  useOpenSuccessModalOverlay,
} from "@/stores/overlay";
import FileUpload from "@/components/task-stepper/fileUpload";
import { organizationDetails } from "@/helper";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";

interface StateItem {
  id: number;
  label: string;
}
const CreateNewCampaign = () => {
  const [selectedCampaignGroup, setSelectedCampaignGroup] = useState("");
  const [selectedCampaignGroupId, setSelectedCampaignGroupId] =
    useState<any>("");
  const [selectedCampaignType, setSelectedCampaignType] = useState("");
  const [selectedCampaignTypeId, setSelectedCampaignTypeId] = useState<any>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { show, setShowCreate } = useAddcampaignGroupOverlay();
  const [file, setFile] = useState<File | null>(null);
  const [isAllow, setIsAllow] = useState<boolean>(true);

  const [organizationCampaign, setOrganizationCampaign] = useState([]);

  const [organizationCampaignType, setOrganizationCampaignType] = useState([
    {
      id: 1,
      name: "survey",
      description: "This is Dataphyte campaign group 1",
    },
    {
      id: 2,
      name: "pinpoint",
      description: "This is Dataphyte campaign group 1",
    },
    {
      id: 3,
      name: "navigate",
      description: "This is Dataphyte campaign group 1",
    },
  ]);
  const [countryId, setCountryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountryLabel, setSelectedCountryLabel] = useState("");
  const [stateId, setStateId] = useState<number | null>(null);
  const [stateData, setStateData] = useState<StateItem[]>([]);
  const [lgaData, setLgaData] = useState<StateItem[]>([]);
  const [selectedLgs, setSelectedLgs] = useState<StateItem[]>([]);
  const [stateLabel, setStateLabel] = useState("");
  const [title, setTitle] = useState("");
  const [paymentRate, setPaymentRate] = useState("");
  const [responseNumber, setResponseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [campaignId, setCampaignId] = useState("");

  const router = useRouter();
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );

  const { data: country, isLoading: countryLoading } = useQuery({
    queryKey: ["Get Country list"],
    queryFn: getCountry,
  });
  const countryData = country && country.data;

  const [selectedStates, setSelectedStates] = useState<number[]>([]);

  const { setOpen } = useOpenSuccessModalOverlay();
  const toggleStateSelection = (value: number) => {
    setSelectedStates((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value],
    );
  };

  const getSelectedLabels = (): string[] =>
    stateData
      .filter((item) => selectedStates.includes(item.id))
      .map((item) => item.label);

  const getCampaignGroup = async () => {
    try {
      const response = await getOrganizationCampaign();
      if (response && response.data) {
        setOrganizationCampaign(response.data);
      } else {
        console.warn("Response is null or does not contain data");
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    }
  };

  const getCountryState = async () => {
    try {
      const response = await getState(countryId);
      if (response && response.data) {
        setStateData(response.data);
      } else {
        console.warn("Response is null or does not contain data");
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    }
  };
  const getSelectedLgaLabels = () =>
    selectedLgs.map((lga) => lga.label).join(", ");

  const toggleLgaSelection = (lgaId: number) => {
    const selectedLga = lgaData.find((lga) => lga.id === lgaId);
    if (!selectedLga) return;

    setSelectedLgs((prev) =>
      prev.some((lga) => lga.id === lgaId)
        ? prev.filter((lga) => lga.id !== lgaId)
        : [...prev, selectedLga],
    );
  };

  const getStateLgs = async () => {
    try {
      if (selectedStates.length === 0) {
        console.warn("No states selected");
        return;
      }

      const lgaPromises = selectedStates.map(async (stateId) => {
        const response = await getLgs(stateId);
        return response?.data || [];
      });

      const lgaResults = await Promise.all(lgaPromises);

      const allLgas = lgaResults.flat();

      setLgaData(allLgas);
    } catch (error) {
      console.error("Error fetching LGAs for selected states:", error);
    }
  };

  useEffect(() => {
    getCampaignGroup();
  }, [show]);
  useEffect(() => {
    if (countryId) getCountryState();
  }, [countryId]);

  useEffect(() => {
    if (selectedStates.length > 0) {
      getStateLgs();
    }
  }, [selectedStates]);
  const formatDate = (date: any): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const handleCreateCampaign = async (e: any) => {
    e.preventDefault();
    if (parseFloat(paymentRate) >= 500) {
      setIsLoading(true);

      const formattedStartsAt = formatDate(startDate);
      const formattedEndsAt = formatDate(endDate);
      const formData = new FormData();

      // Append basic fields
      formData.append("title", title);
      formData.append("description", description);
      formData.append("campaign_group_id", selectedCampaignGroupId);
      formData.append("type", "survey");
      formData.append("number_of_responses", responseNumber.toString());
      formData.append("payment_rate_for_response", paymentRate.toString());
      formData.append("starts_at", formattedStartsAt);
      formData.append("ends_at", formattedEndsAt);
      formData.append("allows_multiple_responses", isAllow ? "1" : "0");

      if (file) {
        formData.append("images[0]", file, file.name);
      }

      selectedStates.forEach((state: any, index: number) => {
        formData.append(`state_ids[${index}]`, state);
      });
      selectedLgs.forEach((lga: any, index: number) => {
        formData.append(`lga_ids[${index}]`, lga.id);
      });

      try {
        const response = await axiosInstance.post(
          `/organizations/${organizationDetails.domain}/campaigns/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setOpen(true);
        //console.log(response);
        setCampaignId(response.data.campaign.id);
      } catch (error) {
        console.error("Error creating campaign:", error);
        toast.error("Failed to add campaign. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(
        `Payment rate must be atleast ${currentOrganization && currentOrganization?.symbol}500`,
      );
    }
  };

  const createQuetion = () => {
    router.push(
      `/organization/dashboard/campaigns/questions?questionId=${campaignId}`,
    );
  };
  return (
    <>
      <section className="mx-auto mt-6 w-full max-w-[700px]">
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <CustomBreadCrumbs />
          </div>
          <div>
            <h1 className="mb-1 font-poppins text-xl font-semibold leading-[21px] text-[#333]">
              Create campaign{" "}
            </h1>
            <span className="font-poppins text-[16px] font-medium text-[#4f4f4f]">
              Input details of the campaign you want to create
            </span>
          </div>
          <form
            className="container-xxl mt-4 flex w-full flex-col gap-8 rounded-[18px] bg-[#ffffff] p-8"
            onSubmit={handleCreateCampaign}
          >
            <div className="flex w-full flex-col gap-8">
              <Label htmlFor="questionType" className="w-full">
                <div className="flex items-center justify-between">
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    Campaign group
                  </span>

                  <span
                    className="mb-2 inline-flex cursor-pointer items-center gap-1 font-poppins text-base font-extralight text-[#3365E3]"
                    onClick={() => setShowCreate(true)}
                  >
                    <Image src={IconAdd} alt="add group" className="h-[18px]" />{" "}
                    Create new groups
                  </span>
                </div>

                <Select
                  value={selectedCampaignGroupId}
                  onValueChange={(value: any) => {
                    const selected = organizationCampaign.find(
                      (item: any) => item.id === parseInt(value),
                    ) as { id: number; name: string } | undefined;

                    setSelectedCampaignGroup(selected?.name || "");
                    setSelectedCampaignGroupId(selected?.id);
                  }}
                >
                  <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                    <SelectValue
                      placeholder="Select campaign group"
                      className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                    >
                      {selectedCampaignGroup}
                    </SelectValue>
                  </SelectTrigger>

                  {/* Dropdown Content */}
                  <SelectContent className="max-w-full">
                    <SelectGroup>
                      <SelectLabel>Campaign group</SelectLabel>
                      {organizationCampaign.map((item: any) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="flex items-center gap-2"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>

              {/***

              <Label htmlFor="questionType" className="w-full">
                <div className="flex items-center justify-between">
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    Campaign Type
                  </span>
                </div>

                <Select
                  value={selectedCampaignTypeId}
                  onValueChange={(value: any) => {
                    const selected = organizationCampaignType.find(
                      (item) => item.id === parseInt(value),
                    );

                    setSelectedCampaignType(selected?.name || "");
                    setSelectedCampaignTypeId(selected?.id);
                  }}
                >
                  <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                    <SelectValue
                      placeholder="Select campaign type"
                      className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                    >
                      {selectedCampaignType || ""}
                    </SelectValue>
                  </SelectTrigger>


                  <SelectContent className="max-w-full">
                    <SelectGroup>
                      <SelectLabel>Campaign Type</SelectLabel>
                      {organizationCampaignType.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="flex items-center gap-2"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
              */}

              <Label htmlFor="question" className="w-full">
                <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                  Campaign title
                </span>
                <Input
                  name="tite"
                  id="title"
                  autoComplete="off"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Type your title"
                  className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                />
              </Label>

              <Label htmlFor="question" className="w-full">
                <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                  Campaign Description
                </span>
                <Input
                  name="question"
                  id="question"
                  autoComplete="off"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type your description"
                  className="h-[100px] w-full rounded-md border bg-transparent align-text-top placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                />
              </Label>

              <Label htmlFor="questionType" className="w-full">
                <div className="flex items-center justify-between">
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    Location
                  </span>
                </div>

                <Select
                  value={selectedCountryLabel}
                  onValueChange={(value) => {
                    // Find the selected country
                    const selectedCountry = countryData.find(
                      (item: any) => item.id === value,
                    );

                    if (selectedCountry) {
                      //  console.log(selectedCountry);
                      setSelectedCountryLabel(selectedCountry.label);
                      setCountryId(selectedCountry.id);
                    } else {
                      console.warn("Selected country not found!");
                    }
                  }}
                >
                  <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                    <SelectValue
                      placeholder="Select country"
                      className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                    >
                      {selectedCountryLabel || "Select country"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-w-full">
                    <SelectGroup>
                      <SelectLabel>Country</SelectLabel>
                      {countryData?.map((item: any) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          className="flex items-center gap-2"
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>

              {countryId && (
                <Label htmlFor="questionType" className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                      State
                    </span>
                  </div>
                  <Select
                    value={undefined} // Keep undefined to avoid single value binding
                    onValueChange={(value) =>
                      toggleStateSelection(Number(value))
                    }
                  >
                    <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                      <SelectValue
                        placeholder="Select state"
                        className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                      >
                        {getSelectedLabels().length > 0
                          ? getSelectedLabels().join(", ")
                          : "Select state"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-w-full">
                      <SelectGroup>
                        <SelectLabel>State</SelectLabel>
                        {stateData?.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id.toString()}
                            className={`flex items-center gap-2 ${
                              selectedStates.includes(item.id)
                                ? "font-bold text-main-100"
                                : ""
                            }`}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="font-poppins text-sm font-normal leading-[21px] text-[#828282]">
                    Leave empty to campaigns to be available all location
                  </span>
                </Label>
              )}

              {selectedStates.length > 0 && (
                <Label htmlFor="questionType" className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                      LGs
                    </span>
                  </div>

                  <Select
                    onValueChange={(value) => toggleLgaSelection(Number(value))}
                  >
                    <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                      <SelectValue
                        placeholder="Select LGAs"
                        className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                      >
                        {getSelectedLgaLabels() || "Select LGAs"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-w-full">
                      <SelectGroup>
                        <SelectLabel>Local Government Areas</SelectLabel>
                        {lgaData?.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id.toString()}
                            className={`flex items-center gap-2 ${
                              selectedLgs.some((lga) => lga.id === item.id)
                                ? "font-bold"
                                : ""
                            }`}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="font-poppins text-sm font-normal leading-[21px] text-[#828282]">
                    Leave empty to campaigns to be available all location
                  </span>
                </Label>
              )}

              <Label htmlFor="question" className="w-full">
                <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                  Payment rate (
                  {currentOrganization && currentOrganization.currency}{" "}
                  {currentOrganization && currentOrganization?.symbol})
                </span>
                <Input
                  name="question"
                  id="question"
                  type="text"
                  value={paymentRate}
                  autoComplete="off"
                  placeholder="Payment rate"
                  onChange={(e) => {
                    const value = e.target.value;
                    const sanitizedValue = value.replace(/\D/g, "");
                    setPaymentRate(sanitizedValue);
                  }}
                  className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                />

                <span className="font-poppins text-sm font-normal leading-[21px] text-[#828282]">
                  This is amount you are willing to pay for each response
                </span>
              </Label>

              <Label htmlFor="question" className="w-full">
                <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                  Number of respondents
                </span>
                <Input
                  name="question"
                  id="question"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Input number of response"
                  value={responseNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    const sanitizedValue = value.replace(/\D/g, "");
                    setResponseNumber(sanitizedValue);
                  }}
                  className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                />

                <span className="mt-2 inline-flex gap-2 font-poppins text-sm font-normal leading-[21px] text-[#828282]">
                  <Input
                    type="checkbox"
                    checked={isAllow}
                    className="h-3 w-1 cursor-pointer"
                    onChange={(e: any) => {
                      setIsAllow(e.target.checked);
                    }}
                  />
                  Accept multiple response from an individual response
                </span>
              </Label>

              <div className="flex w-full items-center gap-6">
                <Label htmlFor="startDate" className="w-1/2">
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    Start at
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between gap-3 rounded-md border px-3 pr-1 text-center text-sm font-normal",
                          "border-neutral-300",
                        )}
                      >
                        {startDate
                          ? `${format(startDate, "PPP")}`
                          : "Select  date"}
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F8F8F8]">
                          <Calendar size={20} color="#828282" />
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <div className="flex flex-col items-center gap-4 rounded-md border bg-[#fff] shadow-md">
                        <CalenderDate
                          mode="single"
                          //@ts-ignore
                          selected={startDate}
                          onSelect={(date: any) => setStartDate(date || null)}
                          initialFocus
                        />
                        <div className="flex w-auto items-center justify-between">
                          <button
                            className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                            onClick={() => setStartDate(null)}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Label>

                <Label htmlFor="endDate" className="border-red w-1/2">
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    End at
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between gap-3 rounded-md border px-3 pr-1 text-center text-sm font-normal",
                          "border-neutral-300", // Adjust border color
                        )}
                      >
                        {endDate ? `${format(endDate, "PPP")}` : "Select date"}
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F8F8F8]">
                          <Calendar size={20} color="#828282" />
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4">
                      <div className="flex flex-col items-center gap-4 rounded-md border bg-[#fff] shadow-md">
                        <CalenderDate
                          mode="single"
                          //@ts-ignore
                          selected={endDate}
                          onSelect={(date: any) => setEndDate(date || null)}
                          initialFocus
                        />
                        <div className="flex w-auto items-center justify-between">
                          <button
                            className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                            onClick={() => setEndDate(null)}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Label>
              </div>
              <FileUpload
                ref={null}
                type="image"
                value={null}
                onFileUpload={(file: any) => {
                  setFile(file);
                  console.log(file);
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700 disabled:bg-blue-500"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Create campaign"
              )}
            </Button>
          </form>
        </div>
      </section>

      {/*** CREATE CAMPAIGN GROUP */}
      <CreateCampaingGroup />

      {/*** SUCCESS DIALOG */}

      <SuccessDialog
        title="Campaign created successfully!"
        content="This campaign has been saved to your draft. Add campaign questions in order to submit it for approval"
        action={createQuetion}
      />
    </>
  );
};

export default CreateNewCampaign;
