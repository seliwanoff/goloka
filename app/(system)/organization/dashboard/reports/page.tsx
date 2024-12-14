"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { chunkArray, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, CloseCircle, Message, Sms } from "iconsax-react";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import Img from "@/public/assets/images/reviewer.jpg";
import Image, { StaticImageData } from "next/image";
import Pagination from "@/components/lib/navigation/Pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BsThreeDots } from "react-icons/bs";

const Report = () => {
  const [date, setDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(myReports, pageSize);
  const currentPageData = pages[currentPage - 1] || [];
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<IReport | any>();

  const handleOpenReport = (index: number) => {
    setSelected(currentPageData[index]);
    setOpen(true);
  };

  return (
    <>
      <section className="mt-4 w-full rounded-2xl bg-white p-6">
        {/* SEARCH AND DATE */}
        <div className="flex gap-2">
          <div className="relative flex w-[250px] items-center justify-center md:w-[300px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder="Search task, organization"
              type="text"
              className="w-full rounded-full bg-gray-50 pl-10"
            />
          </div>
          {/* DATE */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-min justify-start gap-3 rounded-full px-3 pr-1 text-center text-sm font-normal",
                )}
              >
                {date ? format(date, "PPP") : <span>Pick date</span>}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                  <Calendar size={20} color="#828282" className="m-0" />
                </span>{" "}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalenderDate
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* REPORT LISTS */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          {currentPageData.map((report, index) => {
            return (
              <div
                key={index}
                className="space-y-3 rounded-[8px] border border-[#f2f2f2] bg-[#FCFCFC] p-3.5"
              >
                <h3
                  onClick={() => handleOpenReport(index)}
                  className="cursor-pointer text-sm font-medium text-black"
                >
                  {report.title}
                </h3>
                <p className="text-sm text-[#333333]">{report.description}</p>
                <div className="flex items-center gap-2">
                  <Image
                    src={report.photo}
                    alt={report.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-[#4F4F4F]">
                      {report.name}
                    </h4>
                    <p className="text-xs text-[#4F4F4F]">{report.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          {" "}
          <div className="mt-6">
            <Pagination
              // @ts-ignore
              totalPages={pages?.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              RowSize={pageSize}
              onRowSizeChange={setPageSize}
            />
          </div>
        </div>

        {/* SHEET */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="border-none">
            <div className="absolute left-0 top-0 z-10 w-full bg-main-100 p-4">
              <h3 className="text-sm text-white">Report #1838942022 </h3>
              <p className="text-sm text-white">{selected?.date}</p>

              <span
                onClick={() => setOpen(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full text-white"
              >
                <CloseCircle variant="Bold" size={24} />
              </span>
            </div>
            <div className="mt-16"></div>
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base">{selected?.title}</SheetTitle>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-500"
                >
                  Completed{" "}
                </Badge>
              </div>
              <SheetDescription className="mt-5 text-sm text-[#333333]">
                {selected?.description}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8">
              <h3 className="mb-5 text-base text-[#4F4F4F]">
                Reported contributor
              </h3>

              <div className="flex items-center justify-between rounded-[50px] bg-[#F8F8F8] p-3.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={selected?.photo}
                    alt={selected?.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-[#4F4F4F]">
                      {selected?.name}
                    </h4>
                    <p className="text-xs text-[#4F4F4F]">{selected?.date}</p>
                  </div>
                </div>

                <Popover>
                  <PopoverTrigger>
                    <span className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#DFDFDF] text-[#828282]">
                      <BsThreeDots />
                    </span>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" className="w-min p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[#101828]">
                        <span className="text-[#828282]">
                          <Message />
                        </span>
                        Message
                      </div>
                      <div className="flex items-center gap-3 text-[#101828]">
                        <span className="text-[#828282]">
                          <Sms />
                        </span>
                        Email
                      </div>
                      <div className="flex items-center gap-3 text-[#EB5757]">
                        <span className="text-[#EB5757]">
                          <Message />
                        </span>
                        Deactivate
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-5 text-base text-[#4F4F4F]">Reported by</h3>

              <div className="flex items-center justify-between rounded-[50px] bg-[#F8F8F8] p-3.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={selected?.photo}
                    alt={selected?.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-[#4F4F4F]">
                      {selected?.name}
                    </h4>
                    <p className="text-xs text-[#4F4F4F]">{selected?.date}</p>
                  </div>
                </div>

                <Button className="h-auto rounded-[50px] bg-[#EBF0FC] text-[#3365E3] hover:bg-[#EBF0FC] focus:ring-0">
                  Message
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </>
  );
};

export default Report;

interface IReport {
  title: string;
  description: string;
  photo: StaticImageData;
  name: string;
  date: string;
}

const myReports = [
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report4 title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 18th June, 2024",
  },
  {
    title: "Report title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 29th June, 2024",
  },
  {
    title: "Report 2 title goes here",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam vitae amet purus lorem nunc. Odio vestibulum ...",
    photo: Img,
    name: "Mohh_Jumah",
    date: "Tue 28th June, 2024",
  },
];
