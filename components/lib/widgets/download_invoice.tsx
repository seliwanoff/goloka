import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInvoiceOverlay } from "@/stores/overlay";
import { DocumentDownload } from "iconsax-react";

const DownloadInvoice = () => {
  const { open, setOpen } = useInvoiceOverlay();

  return (
    <>
      <div className="grid grid-cols-2 items-center p-5">
        <div className="">
          <h3 className="font-medium text-[#101828]">₦78,000 </h3>
          <p className="text-sm text-[#828282]">Amount</p>
        </div>
        <span className={cn("justify-self-end text-xs")}>Completed</span>

        <div className="col-span-2 mt-11 rounded-lg border border-[#F2F2F2] bg-[#f8f8f8] p-6">
          <span className="inline-block rounded-full border bg-white p-2 px-4 text-sm text-[#333]">
            Transaction summary
          </span>

          <div className="mt-6 space-y-8">
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Beneficiary</span>
              <span className="justify-self-end text-right text-sm font-medium text-[#333]">
                Muhammed Jamiu
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Bank</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                UBA
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Account number</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                9273786272837
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Date</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                15/5/2024
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2 mt-24 grid gap-4">
          <Button className="h-14 items-center gap-3 rounded-full bg-[#3365E30F] text-sm font-medium text-main-100 hover:bg-blue-700 hover:text-blue-50">
            <span>
              <DocumentDownload size={20} />
            </span>
            Dowload file
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-full border-main-100 text-sm font-medium text-main-100 hover:border-blue-700 hover:text-blue-700"
          >
            Report Transaction
          </Button>
        </div>
      </div>
    </>
  );
};

export default DownloadInvoice;
