"use client";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import React, { useState } from "react";
import Image from "next/image";
import Task1 from "@/public/assets/images/tasks/task1.png";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { responseStatus } from "../page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@react-hook/media-query";
import Map from "@/public/assets/images/tasks/tasks.png";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Send2 } from "iconsax-react";
import ChatWidget from "@/components/lib/widgets/response-chat-widget";

const page = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <section className="space-y-4 py-8 pt-[34px]">
        <CustomBreadCrumbs />

        <div className="flex items-center justify-between rounded-lg bg-white p-5">
          <div className="grid grid-cols-[56px_1fr] items-center gap-4">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={Task1}
                alt="Task image"
                className="h-14 w-14 rounded-lg object-cover"
              />
            </AspectRatio>

            <div className="">
              <h3 className="font-semibold text-neutral-900">
                Agriculture & Food Security
              </h3>
              <p className="text-sm text-[#828282]">By Muhammad Jamiu</p>
            </div>
          </div>

          <span
            className={cn(
              "self-end rounded-full px-3 py-2 text-xs font-medium md:self-center md:px-8 md:py-2.5",
              //@ts-ignore
              responseStatus("Pending"),
            )}
          >
            Pending
          </span>
        </div>

        <div className="rounded-2xl bg-white p-4 lg:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="grid w-full grid-cols-2 gap-4 md:gap-y-8"
          >
            <TabsList
              className={cn(
                "col-span-2 w-full rounded-full bg-[#F1F1F1] px-1 py-6 md:col-span-1 md:w-[300px]",
              )}
            >
              <TabsTrigger
                value="questions"
                className={cn(
                  "flex-grow rounded-full py-2.5 text-sm font-normal text-[#828282] data-[state=active]:bg-blue-700 data-[state=active]:text-white",
                )}
              >
                Questions
              </TabsTrigger>
              <TabsTrigger
                value="task-details"
                className={cn(
                  "flex-grow rounded-full py-2.5 text-sm font-normal text-[#828282] data-[state=active]:bg-blue-700 data-[state=active]:text-white",
                )}
              >
                Task details
              </TabsTrigger>
            </TabsList>

            {/* MESSAGE CHAT SHEET */}
            <div className="col-span-2 md:col-span-1 md:place-self-end">
              {isDesktop ? (
                <>
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="relative flex justify-end">
                      <Button className="h-full w-[150px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                        Message{" "}
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                          2
                        </span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
                      <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                        <SheetTitle className="font-normal text-white">
                          Messages
                        </SheetTitle>
                        <SheetDescription className="text-white">
                          24
                        </SheetDescription>
                        {/* CUSTOM CLOSE */}
                        <span
                          onClick={() => setOpen(false)}
                          className="absolute right-4 mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                        >
                          <X size={20} />
                        </span>
                      </SheetHeader>

                      {/* CHAT WIDGET */}
                      <div className="mt-24">
                        <ChatWidget />
                      </div>

                      {/* CHAT MESSAGE INPUT */}
                      <SheetFooter className="absolute bottom-0 left-0 w-full border-t md:flex-row md:justify-start md:p-4">
                        <form id="chat-box" className="block w-full">
                          <div className="flex w-full items-center gap-6">
                            <Input
                              type="text"
                              name="message"
                              id="message"
                              aria-label="Message"
                              placeholder="Input your message"
                              className="form-input h-[50px] rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
                            />
                            <Button className="h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white">
                              <span className="">
                                <Send2 size="24" />
                              </span>
                              Send
                            </Button>
                          </div>
                        </form>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </>
              ) : (
                <>
                  <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                      <Button className="h-full w-full gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314] focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[150px]">
                        Message{" "}
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                          2
                        </span>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
                      <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                        <DrawerTitle className="font-normal text-white">
                          {" "}
                          Messages
                        </DrawerTitle>
                        <DrawerDescription className="text-white">
                          24
                        </DrawerDescription>
                        <span
                          onClick={() => setOpen(false)}
                          className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                        >
                          <X size={20} />
                        </span>
                      </DrawerHeader>
                      <div className="mt-24" />
                      <ChatWidget />
                      <DrawerFooter className="border-t">
                        <form id="chat-box">
                          <div className="flex items-center gap-6">
                            <Input
                              type="text"
                              name="message"
                              id="message"
                              aria-label="Message"
                              placeholder="Input your message"
                              className="form-input h-[50px] rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
                            />
                            <Button className="h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white">
                              <span className="">
                                <Send2 size="24" />
                              </span>
                              Send
                            </Button>
                          </div>
                        </form>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </>
              )}
            </div>

            {/* TAB CONTENT */}
            <TabsContent value="questions" className="col-span-2">
              {/* MOBILE VIEW */}
              <div className="md:hidden">
                {tableData?.map((data: any, index: number) => (
                  <div
                    key={index}
                    className="space-y-3 border-t border-[#E5E5EA] pb-4 pt-4 first:border-0"
                  >
                    <div className="text-sm">
                      <h3 className="mb-1.5 text-sm text-[#828282]">
                        Question
                      </h3>
                      <p className="text-sm text-[#333333]">{data?.Question}</p>
                    </div>
                    <div className="text-sm">
                      <h3 className="mb-1.5 text-sm text-[#828282]">Answers</h3>
                      <p className="text-sm text-[#333333]">{data?.Answers}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-0 bg-[#FBFBFB]">
                      <TableHead className="">Questions</TableHead>
                      <TableHead>Answers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData?.map((data: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="w-1/2 text-sm">
                          {data?.Question}
                        </TableCell>
                        <TableCell className="w-1/2 text-sm">
                          {data?.Answers}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="task-details" className="col-span-2 w-full">
              {/* -- Details */}
              <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
                <div className="mb-4 h-full w-full rounded-2xl bg-[#F8F8F8] p-5 md:mb-0">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Task Details
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                    <div className="">
                      <div className="flex items-center">
                        <h4 className="font-medium text-[#101828]">
                          26 June 2023 • 05:07 PM
                        </h4>
                      </div>
                      <p className="text-sm text-gray-400">Task Ends on</p>
                    </div>
                    <div>
                      <h4 className="text-[#101828]">$4 </h4>
                      <p className="text-sm text-gray-400">Per response</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#101828]">Multiple</h4>
                      <p className="text-sm text-gray-400">Response type </p>
                    </div>
                    <div className="md:text-right">
                      <h4 className="font-medium text-[#101828]">Survey </h4>
                      <p className="text-sm text-gray-400">Campaign</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <span className="text-sm text-gray-400">Description</span>
                    <p className="mt-3 text-sm leading-6 text-[#4F4F4F]">
                      {/* @ts-ignore */}
                      Agriculture is the cornerstone of food security, serving
                      as the primary means of sustenance and economic stability
                      for nations worldwide. It encompasses the cultivation of
                      crops and livestock, which are essential for providing the
                      food supply that supports human life. n addition to its
                      role in feeding populations, agriculture also drives
                      economic development.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F8F8F8] p-5">
                  <figure className="h-[85%]">
                    <Image
                      src={Map}
                      alt="map"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </figure>
                  <div className="mt-5 flex gap-5">
                    <div className="text-sm font-semibold text-[#101828]">
                      6{" "}
                      <span className="font-normal text-[#828282]">
                        Questions
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#101828]">
                      24{" "}
                      <span className="font-normal text-[#828282]">
                        0f 64 responses
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default page;

const tableData = [
  {
    Question: "How many years have you been involved in farming?",
    Answers:
      "Agriculture is the cornerstone of food security, serving as the primary means of sustenance and economic stability for...",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture is the cornerstone of food security",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "security",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture is the cornerstone of food security",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture is the cornerstone of food security",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture is the cornerstone of food security",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture is the cornerstone of food security",
  },
  {
    Question: "How many years have you been involved in farming?",
    Answers: "Agriculture is the cornerstone of food security",
  },
];
