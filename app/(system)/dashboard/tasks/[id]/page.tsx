"use client";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import Task1 from "@/public/assets/images/tasks/task1.png";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dot, SquarePen } from "lucide-react";
import { ArchiveMinus, Note } from "iconsax-react";
import Map from "@/public/assets/images/tasks/tasks.png";
import Link from "next/link";
import TaskCardWidget from "@/components/lib/widgets/task_card";

import { StepperProvider, useStepper } from "@/context/TaskStepperContext.tsx";
import TaskStepper from "@/components/task-stepper/TaskStepper";
import { Toaster } from "@/components/ui/sonner";
import { tasks } from "@/utils";
import { cn } from "@/lib/utils";
import {
  createContributorResponse,
  getCampaignQuestion,
  getTaskById,
} from "@/services/contributor";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <section className="space-y-4 py-8 pt-[34px]">
      <CustomBreadCrumbs />
      <div className="flex justify-between rounded-lg bg-white p-5">
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <SkeletonBox className="h-14 w-14 rounded-lg" />
          <div className="">
            <SkeletonBox className="mb-2 h-4 w-48" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>
        <div className="hidden items-center justify-center space-x-2 md:flex">
          <SkeletonBox className="h-12 w-32 rounded-full" />
          <SkeletonBox className="h-12 w-12 rounded-full" />
        </div>
      </div>
      <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
        <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
            <div className="">
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
            <div>
              <SkeletonBox className="mb-2 h-4 w-20" />
              <SkeletonBox className="h-4 w-24" />
            </div>
            <div>
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
            <div className="md:text-right">
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          </div>
          <div className="mt-8">
            <SkeletonBox className="mb-2 h-4 w-32" />
            <SkeletonBox className="h-16 w-full" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <SkeletonBox className="mb-4 h-[85%] w-full rounded-lg" />
          <div className="mt-5 flex gap-5">
            <SkeletonBox className="h-4 w-12" />
            <SkeletonBox className="h-4 w-16" />
          </div>
        </div>
      </div>
    </section>
  );
};

type PageProps = {};

const TaskDetail: React.FC<PageProps> = ({}) => {
  const [isStepper, setIsStepper] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: taskId } = useParams();
  const { step } = useStepper();
  // const { data } = getTaskById("");taskId;
  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get task"],
    queryFn: async () => await getTaskById(taskId as string),
  });
  // const {
  //   data: quest,
  //   // isLoading,
  //   // refetch,
  // } = useQuery({
  //   queryKey: ["campaign questions"],
  //   queryFn: async () => await getCampaignQuestion(taskId as string),
  // });

  useEffect(() => {
    const stepperParam = searchParams.get("stepper");
    const stepParam = searchParams.get("step");

    if (stepperParam === "true" && !isStepper) {
      setIsStepper(true);
    }
  }, [searchParams]);

  const {
    data: quest,
    isLoading: questLoading,
    error: questError,
  } = useQuery({
    queryKey: ["campaign questions", taskId], // The key used for caching
    queryFn: () => getCampaignQuestion(taskId as string), // Function to fetch data
    enabled: !!taskId, // Ensures the query only runs when taskId exists
    retry: 2, // Retry failed queries up to 2 times
  });

  const onContribute = async () => {
    setIsStepper(true);
    router.push(`${window.location.pathname}?stepper=true&step=1`);
  };

  console.log(quest, "quest");
  const updateStepUrl = (newStep: number) => {
    router.push(`${window.location.pathname}?stepper=true&step=${newStep}`);
  };

  const WrappedTaskStepper = () => (
    <TaskStepper
      //@ts-ignore
      quest={quest}
      onStepChange={(newStep: any) => {
        updateStepUrl(newStep);
      }}
    />
  );

  //@ts-ignore
  const Date = moment(task?.data?.ends_at).format("DD MMMM YYYY");
  //@ts-ignore
  const Time = moment(task?.data?.ends_at).format("hh:mm A");

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <Toaster richColors position={"top-right"} />
      <section className="space-y-4 py-8 pt-[34px]">
        <CustomBreadCrumbs />

        {isStepper ? (
          <>
            <div className="mx-auto mt-9 w-full rounded-2xl bg-white p-4 sm:w-[500px] md:mt-[96px]">
              <h3 className="mb-6 text-xl font-semibold text-neutral-900">
                Agriculture & Food Security
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block font-medium text-neutral-600">
                    <span className="text-main-100">{step}</span>/4
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }, (_: any, index: number) => (
                      <span
                        key={index}
                        className={cn(
                          "inline-block h-1 w-3 rounded-full bg-neutral-200",
                          step >= index + 1 && "bg-main-100",
                          step === index + 1 && "w-5",
                        )}
                      ></span>
                    ))}
                  </div>
                </div>

                <span className="text-sm text-neutral-500">
                  <span className="font-semibold text-neutral-900">10</span>{" "}
                  Questions
                </span>
              </div>

              <div className="mt-6">
                {/* @ts-ignore */}
                <WrappedTaskStepper />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ####################################### */}
            {/* -- Header text section */}
            {/* ####################################### */}

            <div className="flex justify-between rounded-lg bg-white p-5">
              <div className="grid grid-cols-[56px_1fr] items-center gap-4">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    //@ts-ignore
                    src={task?.data?.image_path[0]}
                    alt="Task image"
                    className="h-14 w-14 rounded-lg object-cover"
                    width={100}
                    height={100}
                  />
                </AspectRatio>

                <div className="">
                  <h3 className="font-semibold text-neutral-900">
                    {/* @ts-ignore */}
                    {task?.data?.title}
                  </h3>
                  <p className="text-sm text-[#828282]">By Muhammad Jamiu</p>
                </div>
              </div>
              <div className="hidden items-center justify-center space-x-2 md:flex">
                <Button
                  onClick={onContribute}
                  className="h-auto gap-3 rounded-full bg-main-100 px-10 py-3 text-sm shadow-lg shadow-blue-50 hover:bg-blue-700"
                >
                  <span>
                    <Note size={20} />
                  </span>
                  Contribute
                </Button>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#3365E31F] text-main-100">
                  <ArchiveMinus size={24} />
                </span>
              </div>
            </div>

            {/* -- Details */}
            <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
              <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Task Details
                </h3>
                <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                  <div className="">
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">{Date}</h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">{Time}</span>
                    </div>
                    <p className="text-sm text-gray-400">Task Ends on</p>
                  </div>
                  <div>
                    <h4 className="text-[#101828]">
                      {/* @ts-ignore */}${" "}
                      {task?.data?.payment_rate_for_response}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Per response</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#101828]">Multiple</h4>
                    <p className="text-sm text-gray-400">Response type </p>
                  </div>
                  <div className="md:text-right">
                    <h4 className="font-medium text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.type}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign</p>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="text-sm text-gray-400">Description</span>
                  <p className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                    {/* @ts-ignore */}
                    {task?.data?.description}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5">
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
                    {/* @ts-ignore */}
                    {task?.data?.number_of_responses_received}{" "}
                    <span className="font-normal text-[#828282]">
                      {/* @ts-ignore */}
                      0f {task?.data?.number_of_responses} responses
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ####################################### */}
            {/* -- Tasks section */}
            {/* ####################################### */}
            <div className="col-span-5 mt-8">
              <div className="mb-6 flex justify-between">
                <h3 className="text-lg font-semibold text-[#333]">
                  Related Tasks
                </h3>

                <Link
                  href="/dashboard/tasks"
                  className="text-lg font-semibold text-main-100"
                >
                  See all
                </Link>
              </div>

              {/* Task list */}
              {/* <div className="grid gap-5 md:grid-cols-2 1xl:grid-cols-3 xl:grid-cols-3">
                {tasks.map((task: any, index: number) => (
                  <TaskCardWidget {...task} key={index} />
                ))}
              </div> */}
            </div>

            {/* MOBILE CTA */}
            <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-start space-x-2 bg-white p-5 md:hidden">
              <Button
                onClick={onContribute}
                className="h-auto flex-grow gap-3 rounded-full bg-main-100 px-10 py-3 text-sm shadow-lg shadow-blue-50 hover:bg-blue-700"
              >
                <span>
                  <Note size={20} />
                </span>
                Contribute
              </Button>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#3365E31F] text-main-100">
                <ArchiveMinus size={24} />
              </span>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default TaskDetail;
