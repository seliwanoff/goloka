"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";
import { useSuccessModalStore } from "@/stores/misc";
import { useRouter } from "next/navigation";

const SuccessModal = () => {

  const { isModalOpen, closeModal } = useSuccessModalStore();
 const router = useRouter();

 const navigateToMarketplace = () => {
   closeModal();
   router.push("/dashboard/marketplace");
 };
  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal} >
      <DialogContent className="fixed left-1/2 top-1/2 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg bg-white p-6 shadow-lg sm:w-auto ">
        {/* <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button> */}
        <DialogHeader>
          <div className="mb-4 flex flex-col items-center rounded-lg border border-[#3365E31F] bg-[#3365E30A] p-4">
            {/* <CheckCircle className="text-blue-500" size={48} /> */}
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 0.875C35.194 0.875 42.0933 3.7328 47.1803 8.81973C52.2672 13.9067 55.125 20.806 55.125 28C55.125 35.194 52.2672 42.0933 47.1803 47.1803C42.0933 52.2672 35.194 55.125 28 55.125C20.806 55.125 13.9067 52.2672 8.81973 47.1803C3.7328 42.0933 0.875 35.194 0.875 28C0.875 20.806 3.7328 13.9067 8.81973 8.81973C13.9067 3.7328 20.806 0.875 28 0.875ZM24.621 33.3514L18.5954 27.3219C18.3794 27.1059 18.1229 26.9345 17.8407 26.8176C17.5584 26.7007 17.2559 26.6405 16.9504 26.6405C16.6449 26.6405 16.3424 26.7007 16.0602 26.8176C15.778 26.9345 15.5215 27.1059 15.3055 27.3219C14.8692 27.7581 14.6241 28.3498 14.6241 28.9668C14.6241 29.5838 14.8692 30.1755 15.3055 30.6117L22.978 38.2843C23.1934 38.5014 23.4497 38.6737 23.732 38.7912C24.0143 38.9088 24.3171 38.9694 24.6229 38.9694C24.9288 38.9694 25.2316 38.9088 25.5139 38.7912C25.7962 38.6737 26.0525 38.5014 26.2679 38.2843L42.1554 22.3929C42.3743 22.1778 42.5484 21.9214 42.6678 21.6387C42.7871 21.3559 42.8493 21.0523 42.8507 20.7454C42.8521 20.4385 42.7928 20.1343 42.6761 19.8505C42.5594 19.5666 42.3876 19.3087 42.1707 19.0915C41.9538 18.8744 41.6961 18.7023 41.4124 18.5853C41.1287 18.4683 40.8246 18.4085 40.5177 18.4096C40.2108 18.4107 39.9071 18.4725 39.6242 18.5915C39.3413 18.7105 39.0848 18.8844 38.8694 19.103L24.621 33.3514Z"
                fill="#3365E3"
              />
            </svg>
            <DialogTitle className="mt-4 text-center text-base font-normal text-[#333333]">
              Great! You have successfully answered all the questions
            </DialogTitle>
          </div>
          <DialogDescription className="mt-4 text-center text-sm text-gray-600">
            You will be credited once the organisation accepts your response
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={navigateToMarketplace}
            className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Explore more Marketplace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
