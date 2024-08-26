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
import { Dot } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Map from "@/public/assets/images/tasks/tasks.png";

const page = () => {
  const [activeTab, setActiveTab] = useState("questions");

  console.log(responseStatus);

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
              "rounded-full px-8 py-2.5 text-xs font-medium",
              //@ts-ignore
              responseStatus("Pending"),
            )}
          >
            Pending
          </span>
        </div>

        <div className="bg-white p-4 lg:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="grid w-full grid-cols-2 gap-y-8"
          >
            <TabsList
              className={cn("w-[300px] rounded-full bg-[#F1F1F1] px-1 py-6")}
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
            <Button className="h-full w-[150px] gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100">
              Message{" "}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                2
              </span>
            </Button>
            <TabsContent value="questions" className="col-span-2">
              <div>
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
