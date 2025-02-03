"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CheckCheckIcon, Loader, X } from "lucide-react"; // Import X icon for removing tags
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "iconsax-react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { format, formatDate } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  useEditCampaignOverlay,
  useEditMainCampaignOverlay,
} from "@/stores/overlay";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getOrganizationCampaign,
  updateCampaign,
  updateCampaignGroupById,
} from "@/services/campaign";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { getCountry, getState, getLgs } from "@/services/misc";
import { useQuery } from "@tanstack/react-query";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import FileUpload from "@/components/task-stepper/fileUpload";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  response: yup.string().required("Response number is required"),
  rate: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  countryId: yup.string().required("Country is required"),
  stateIds: yup.array().of(yup.number()).required("State(s) are required"),
  lgaIds: yup.array().of(yup.number()).required("LGA(s) are required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
});

const EditMainCampaignWidget = () => {
  /* @ts-ignore */
  const {
    title,
    description,
    id,
    setShow,
    setIsShowEdit,
    countryId: initialCountryId,
    stateIds: initialStateIds,
    lgaIds: initialLgaIds,
    payment_rate_for_response,
    number_of_responses,
    startDate: initialStartDate,
    endDate: initialEndDate,
    allow_multiple_responses: allow_multiple_responses,
    type: type,
  } = useEditMainCampaignOverlay(); // Initial values from overlay
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(1);
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );
  const [selectedStateIds, setSelectedStateIds] = useState<number[]>(
    /* @ts-ignore */
    [2, 5, 6, 7],
  );
  const [selectedCampaignGroupId, setSelectedCampaignGroupId] =
    useState<any>("");
  const [selectedCampaignGroup, setSelectedCampaignGroup] = useState("");

  const [selectedLgaIds, setSelectedLgaIds] = useState<number[]>(
    /* @ts-ignore */
    [110, 220, 120, 118],
  );
  const [file, setFile] = useState<File | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(
    initialStartDate ? new Date(initialStartDate) : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialEndDate ? new Date(initialEndDate) : null,
  );
  const [organizationCampaign, setOrganizationCampaign] = useState([]);

  const { data: countryData } = useQuery({
    queryKey: ["Get Country list"],
    queryFn: getCountry,
  });

  const { data: stateData } = useQuery({
    queryKey: ["Get State list", selectedCountryId],
    queryFn: () => getState(selectedCountryId),
    enabled: !!selectedCountryId,
  });

  const { data: lgaData } = useQuery({
    queryKey: ["Get LGA list", selectedStateIds],
    /* @ts-ignore */
    queryFn: () =>
      Promise.all(selectedStateIds.map((stateId) => getLgs(stateId))).then(
        /* @ts-ignore */
        (responses) => responses.flatMap((response) => response.data),
      ),
    enabled: selectedStateIds.length > 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      response: "",
      rate: "",
      countryId: "",
      stateIds: [],
      lgaIds: [],
      /* @ts-ignore */
      startDate: null,
      /* @ts-ignore */
      endDate: null,
      type: "",
      allow_multiple_responses: 0,
    },
  });

  // Populate form with initial values
  useEffect(() => {
    setValue("title", title || "");
    setValue("description", description || "");
    /* @ts-ignore */
    setValue("countryId", "1" || "1");
    // setValue("allow_multiple_response", allow_ || "1");
    /* @ts-ignore */
    setValue("stateIds", initialStateIds || [2, 4, 6, 8]);
    /* @ts-ignore */
    setValue("lgaIds", initialLgaIds || [110, 220, 120, 118]);

    setValue(
      "rate",
      /* @ts-ignore */
      parseInt(payment_rate_for_response) || [110, 220, 120, 118],
    );
    setValue("response", number_of_responses || [110, 220, 120, 118]);
    /* @ts-ignore */
    setValue("startDate", initialStartDate || [110, 220, 120, 118]);
    /* @ts-ignore */
    setValue("endDate", initialEndDate || [110, 220, 120, 118]);
  }, [
    title,
    description,
    initialCountryId,
    initialStateIds,
    initialLgaIds,
    setValue,
  ]);
  const formatDate = (date: any): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onUpdateCampaignGroup = async () => {
    // e.preventDefault();
    setIsLoading(true);

    const formattedStartsAt = formatDate(startDate);
    const formattedEndsAt = formatDate(endDate);
    const formData = new FormData();

    // Append campaign details
    formData.append("title", title);
    formData.append("description", description);
    formData.append("campaign_group_id", selectedCampaignGroupId);
    formData.append("type", "survey");
    formData.append("number_of_responses", number_of_responses.toString());
    formData.append(
      "payment_rate_for_response",
      payment_rate_for_response.toString(),
    );
    formData.append("starts_at", formattedStartsAt);
    formData.append("ends_at", formattedEndsAt);
    formData.append(
      "allows_multiple_responses",
      allow_multiple_responses ? "1" : "0",
    );

    // Append selected locations
    selectedStateIds.forEach((state: any, index: number) => {
      formData.append(`state_ids[${index}]`, state);
    });
    selectedLgaIds.forEach((lga: any, index: number) => {
      formData.append(`lga_ids[${index}]`, lga);
    });

    if (file) {
      formData.append("images[0]", file, file.name);
    }

    // Handle image upload if available

    try {
      await updateCampaign(id, formData);
      toast.success("Campaign updated successfully");
      reset();
      // Handle success (e.g., close modal, show success message)
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("An error occurred while updating campaign");
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStateSelection = (stateId: number) => {
    setSelectedStateIds((prev) =>
      prev.includes(stateId)
        ? prev.filter((id) => id !== stateId)
        : [...prev, stateId],
    );
    setValue(
      "stateIds",
      selectedStateIds.includes(stateId)
        ? selectedStateIds.filter((id) => id !== stateId)
        : [...selectedStateIds, stateId],
    );
  };

  const toggleLgaSelection = (lgaId: number) => {
    setSelectedLgaIds((prev) =>
      prev.includes(lgaId)
        ? prev.filter((id) => id !== lgaId)
        : [...prev, lgaId],
    );
    setValue(
      "lgaIds",
      selectedLgaIds.includes(lgaId)
        ? selectedLgaIds.filter((id) => id !== lgaId)
        : [...selectedLgaIds, lgaId],
    );
  };
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

  // Helper function to get labels for selected states and LGAs
  const getSelectedLabels = (ids: number[], data: any[]) => {
    return ids
      .map((id) => data.find((item) => item.id === id)?.label)
      .filter(Boolean);
  };
  useEffect(() => {
    getCampaignGroup();
  }, []);

  return (
    <div>
      <form
        id="edit_campaign_group"
        onSubmit={handleSubmit(onUpdateCampaignGroup)}
        className="space-y-6"
      >
        {/* Group Name */}
        <div>
          <Label htmlFor="questionType" className="w-full">
            <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
              Campaign group
            </span>
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
          <Label
            htmlFor="title"
            className="mb-2 mt-6 inline-block font-light text-[#4F4F4F]"
          >
            Title
          </Label>
          <div className="relative">
            <Input
              {...register("title")}
              id="title"
              name="title"
              placeholder="Input title"
              className={cn(
                "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                errors.title &&
                  "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="description"
            className="mb-2 inline-block font-light text-[#4F4F4F]"
          >
            Description
          </Label>
          <Textarea
            {...register("description")}
            id="description"
            name="description"
            placeholder="Describe the group here."
            className={cn(
              "form-input resize-none overflow-hidden rounded-lg border border-[#D9DCE0] px-4 py-[18px] text-left outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
              errors.description &&
                "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <Label
            htmlFor="countryId"
            className="mb-2 inline-block font-light text-[#4F4F4F]"
          >
            Country
          </Label>
          <Select
            /* @ts-ignore */
            value={selectedCountryId}
            onValueChange={(value) => {
              /* @ts-ignore */
              setSelectedCountryId(1);
              setValue("countryId", "1");
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
              <SelectValue
                placeholder="Select country"
                className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
              />
            </SelectTrigger>
            <SelectContent className="max-w-full">
              <SelectGroup>
                <SelectLabel>Country</SelectLabel>
                {countryData?.data?.map((item: any) => (
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
          {errors.countryId && (
            <p className="text-sm text-red-500">{errors.countryId.message}</p>
          )}
        </div>

        {/* State */}
        {selectedCountryId && (
          <div>
            <Label
              htmlFor="stateIds"
              className="mb-2 inline-block font-light text-[#4F4F4F]"
            >
              State
            </Label>
            <div className="flex flex-wrap gap-2 rounded-md border border-[#D9DCE0] p-2">
              {getSelectedLabels(selectedStateIds, stateData?.data || []).map(
                (label) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full bg-main-100 px-3 py-1 text-sm text-white"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() =>
                        toggleStateSelection(
                          stateData?.data.find(
                            (item: any) => item.label === label,
                          )?.id || 0,
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ),
              )}
            </div>
            <Select
              value=""
              onValueChange={(value) => toggleStateSelection(Number(value))}
            >
              <SelectTrigger className="mt-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                <SelectValue
                  placeholder="Select state"
                  className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                />
              </SelectTrigger>
              <SelectContent className="max-w-full">
                <SelectGroup>
                  <SelectLabel>State</SelectLabel>
                  {stateData?.data?.map((item: any) => (
                    <SelectItem
                      key={item.id}
                      value={item.id.toString()}
                      className="flex items-center gap-2"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.stateIds && (
              <p className="text-sm text-red-500">{errors.stateIds.message}</p>
            )}
          </div>
        )}

        {/* LGA */}
        {selectedStateIds.length > 0 && (
          <div>
            <Label
              htmlFor="lgaIds"
              className="mb-2 inline-block font-light text-[#4F4F4F]"
            >
              LGA
            </Label>
            <div className="flex flex-wrap gap-2 rounded-md border border-[#D9DCE0] p-2">
              {getSelectedLabels(selectedLgaIds, lgaData || []).map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-main-100 px-3 py-1 text-sm text-white"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() =>
                      toggleLgaSelection(
                        lgaData?.find((item) => item.label === label)?.id || 0,
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Select
              value=""
              onValueChange={(value) => toggleLgaSelection(Number(value))}
            >
              <SelectTrigger className="mt-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                <SelectValue
                  placeholder="Select LGA"
                  className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                />
              </SelectTrigger>
              <SelectContent className="max-w-full">
                <SelectGroup>
                  <SelectLabel>LGA</SelectLabel>
                  {lgaData?.map((item: any) => (
                    <SelectItem
                      key={item.id}
                      value={item.id.toString()}
                      className="flex items-center gap-2"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.lgaIds && (
              <p className="text-sm text-red-500">{errors.lgaIds.message}</p>
            )}

            <Label htmlFor="question" className="w-full">
              <span className="mb-2 mt-6 inline-block text-base font-extralight text-[#4F4F4F]">
                Payment rate (
                {currentOrganization && currentOrganization.currency}{" "}
                {currentOrganization && currentOrganization?.symbol})
              </span>
              <Input
                {...register("rate")}
                name="rate"
                id="rate"
                type="number"
                autoComplete="off"
                placeholder="Payment rate"
                // onChange={(e) => setPaymentRate(e.target.value)}
                className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
              <span className="font-poppins text-sm font-normal leading-[21px] text-[#828282]">
                This is amount you are willing to pay for each response
              </span>
            </Label>

            <Label htmlFor="question" className="mt-6 w-full">
              <span className="mb-2 mt-6 inline-block text-base font-extralight text-[#4F4F4F]">
                Number of respondents
              </span>
              <Input
                {...register("response")}
                name="response"
                type="number"
                autoComplete="off"
                id="response"
                //  onChange={(e) => setResponseNumber(e.target.value)}
                placeholder="input number of response"
                className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
            </Label>
            <div className="mt-4 flex w-full items-center gap-6">
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
            <div className="mt-6">
              <FileUpload
                ref={null}
                value={file}
                onFileUpload={(file: any) => {
                  setFile(file);
                  console.log(file);
                }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <Button
            className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
            type="submit"
            disabled={!watch("title") || isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin text-[#fff]" />
            ) : (
              "Update campaign"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditMainCampaignWidget;
