import React from "react";
import { useMediaQuery } from "@react-hook/media-query";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useInvoiceOverlay } from "@/stores/overlay";
import { X } from "lucide-react";
import DownloadInvoice from "../widgets/download_invoice";
import { getTrxId } from "@/services/transactions";
import { useQuery } from "@tanstack/react-query";


const InvoiceModal = () => {
  const { open, setOpen } = useInvoiceOverlay();
  const isDesktop = useMediaQuery("(min-width: 768px)");

   const {  id } = useInvoiceOverlay();
   const {
     data: getResponse,
     isLoading,
     isError,
     error,
     refetch: refetchResponse,
   } = useQuery({
     queryKey: ["get a Response", id],
     queryFn: async () => (id ? await getTrxId(id) : null),
     enabled: !!id,
   });
  const getResponseData = getResponse?.data || null;
  return (
    <>
      {isDesktop ? (
        <>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
              <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                <SheetTitle className="font-normal text-white">
                  {/* @ts-ignore */}
                  Invoice #1 {getResponseData?.reference}
                </SheetTitle>
                <SheetDescription className="text-white">
                  Transaction ID
                </SheetDescription>
                {/* CUSTOM CLOSE */}
                <span
                  onClick={() => setOpen(false)}
                  className="absolute right-4 mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                >
                  <X size={20} />
                </span>
              </SheetHeader>

              {/* INVOICE WIDGET */}
              <div className="mt-24">
                <DownloadInvoice
                  //@ts-ignore
                  getResponseData={getResponseData}
                  isError={isError}
                  isLoading={isLoading}
                />
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
              <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                <DrawerTitle className="font-normal text-white">
                  Invoice #1838942022
                </DrawerTitle>
                <DrawerDescription className="text-white">
                  Transaction ID
                </DrawerDescription>
                <span
                  onClick={() => setOpen(false)}
                  className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                >
                  <X size={20} />
                </span>
              </DrawerHeader>
              <div className="mt-24" />
              {/* @ts-ignore */}
              <DownloadInvoice getResponseData={getResponseData} />
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  );
};

export default InvoiceModal;
