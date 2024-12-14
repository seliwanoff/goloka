import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTrxId } from "@/services/transactions";
import { useInvoiceOverlay } from "@/stores/overlay";
import { useQuery } from "@tanstack/react-query";
import { DocumentDownload } from "iconsax-react";
import { Skeleton } from "@/components/task-stepper/skeleton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "@/public/assets/images/thumb.svg";
import { useRemoteUserStore } from "@/stores/remoteUser";

interface BeneficiaryDetails {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
}

interface TransactionData {
  amount?: string;
  status?: string;
  created_at?: string;
  reference?: string;
  meta?: {
    beneficiary?: BeneficiaryDetails;
  };
}
interface DownloadInvoiceProps {
  getResponseData: TransactionData | null;
  isError: boolean;
  isLoading: boolean;
}
const DownloadInvoice: React.FC<DownloadInvoiceProps> = ({
  getResponseData,
  isError,
  isLoading,
}) => {
  const currentDate = new Date().toLocaleDateString();
 const { user, isAuthenticated } = useRemoteUserStore();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  // PDF Download Handler
  const handleDownloadPDF = async () => {
    // Ensure data exists before generating PDF
    if (!getResponseData) {
      console.error("No transaction data available");
      return;
    }

    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Create PDF content with type-safe access
    const pdfContent = `
<div style="
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
">
  <div style="
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #3365E3;
    padding-bottom: 15px;
  ">
    <h1 style="
      color: #3365E3;
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 700;
    ">Transaction Details for ${getResponseData?.meta?.beneficiary?.account_name || "Unknown Beneficiary"}</h1>
    <p style="
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
    ">Goloka Web App Transaction Summary</p>
  </div>

  <div style="
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  ">
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 15px;
    ">
      <div>
        <h3 style="
          color: #495057;
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 600;
        ">Transaction Amount</h3>
        <p style="
          color: #3365E3;
          font-size: 20px;
          font-weight: 700;
        ">${USER_CURRENCY_SYMBOL} ${Math.abs(parseFloat(getResponseData?.amount || "0")).toLocaleString()}</p>
      </div>
      <div style="text-align: right;">
        <h3 style="
          color: #495057;
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 600;
        ">Transaction Status</h3>
        <p style="
          color: ${
            getResponseData?.status === "completed"
              ? "#28a745"
              : getResponseData?.status === "pending"
                ? "#ffc107"
                : "#dc3545"
          };
          font-size: 18px;
          font-weight: 600;
          text-transform: capitalize;
        ">
          ${getResponseData?.status ? getResponseData?.status.charAt(0).toUpperCase() + getResponseData?.status.slice(1) : "N/A"}
        </p>
      </div>
    </div>

    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      padding-top: 15px;
    ">
      <div>
        <h3 style="
          color: #495057;
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 500;
        ">Beneficiary Name</h3>
        <p style="
          color: #212529;
          font-size: 16px;
          font-weight: 600;
        ">${getResponseData?.meta?.beneficiary?.account_name || "N/A"}</p>
      </div>
      <div style="text-align: right;">
        <h3 style="
          color: #495057;
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 500;
        ">Bank Name</h3>
        <p style="
          color: #212529;
          font-size: 16px;
          font-weight: 600;
        ">${getResponseData?.meta?.beneficiary?.bank_name || "N/A"}</p>
      </div>
      <div>
        <h3 style="
          color: #495057;
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 500;
        ">Account Number</h3>
        <p style="
          color: #212529;
          font-size: 16px;
          font-weight: 600;
        ">${getResponseData?.meta?.beneficiary?.account_number || "N/A"}</p>
      </div>
      <div style="text-align: right;">
        <h3 style="
          color: #495057;
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 500;
        ">Transaction Date</h3>
        <p style="
          color: #212529;
          font-size: 16px;
          font-weight: 600;
        ">${getResponseData?.created_at ? new Date(getResponseData?.created_at).toLocaleDateString() : "N/A"}</p>
      </div>
    </div>
  </div>

  <div style="
    text-align: center;
    margin-top: 20px;
    color: #6c757d;
    font-size: 12px;
    border-top: 1px solid #e9ecef;
    padding-top: 15px;
  ">
    <p style="margin-bottom: 5px;">
      <strong>Generated from Goloka Web App</strong> © 2024
    </p>
    <p>Date Generated: ${currentDate}</p>
  </div>
</div>

    `;

    try {
      // Create a temporary div to render HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = pdfContent;
      document.body.appendChild(tempDiv);

      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 4,
        useCORS: true,
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Convert canvas to image
      const imgData = canvas.toDataURL(Logo);

      // Calculate image dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to PDF
      doc.addImage(
        imgData,
        "SVG",
        0,
        position,
        imgWidth,
        imgHeight,
        "",
        "FAST",
      );
      heightLeft -= pageHeight;

      // Add additional pages if content exceeds one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST",
        );
        heightLeft -= pageHeight;
      }

      // Save PDF
      //@ts-ignore
      doc.save(`transaction_${getResponseData.reference || "details"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Optionally show a user-friendly error message
    }
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-2 items-center p-5">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-4 w-1/4 justify-self-end" />

      <div className="col-span-2 mt-11 rounded-lg border border-[#F2F2F2] bg-[#f8f8f8] p-6">
        <Skeleton className="h-8 w-1/2 rounded-full" />

        <div className="mt-6 space-y-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2 justify-self-end" />
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 mt-24 grid gap-4">
        <Skeleton className="h-14 rounded-full" />
        <Skeleton className="h-14 rounded-full" />
      </div>
    </div>
  );

  // If loading, return skeleton loader
  if (isLoading) return <SkeletonLoader />;

  // If error or no, handle accordingly
  if (isError || !getResponseData)
    return <div>Error loading transaction details</div>;

  return (
    <div className="grid grid-cols-2 items-center p-5">
      <div className="">
        <h3 className="font-medium text-[#101828]">
          ₦
          {Math.abs(
            //@ts-ignore
            parseFloat(getResponseData?.amount || "0"),
          ).toLocaleString()}
        </h3>
        <p className="text-sm text-[#828282]">Amount</p>
      </div>
      <span className={cn("justify-self-end text-xs")}>
        {getResponseData?.status
          ? //@ts-ignore
            getResponseData.status.charAt(0).toUpperCase() +
            //@ts-ignore
            getResponseData.status.slice(1)
          : "Unknown"}
      </span>

      <div className="col-span-2 mt-11 rounded-lg border border-[#F2F2F2] bg-[#f8f8f8] p-6">
        <span className="inline-block rounded-full border bg-white p-2 px-4 text-sm text-[#333]">
          Transaction summary
        </span>

        <div className="mt-6 space-y-8">
          <div className="grid grid-cols-2">
            <span className="text-sm text-[#4F4F4F]">Beneficiary</span>
            <span className="justify-self-end text-right text-sm font-medium text-[#333]">
              {/* @ts-ignore */}
              {getResponseData?.meta?.beneficiary?.account_name || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-[#4F4F4F]">Bank</span>
            <span className="justify-self-end text-sm font-medium text-[#333]">
              {/* @ts-ignore */}
              {getResponseData?.meta?.beneficiary?.bank_name || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-[#4F4F4F]">Account number</span>
            <span className="justify-self-end text-sm font-medium text-[#333]">
              {/* @ts-ignore */}
              {getResponseData?.meta?.beneficiary?.account_number || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-[#4F4F4F]">Date</span>
            <span className="justify-self-end text-sm font-medium text-[#333]">
              {/* @ts-ignore */}
              {getResponseData?.created_at
                ? new Date(getResponseData.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-2 mt-24 grid gap-4">
        <Button
          onClick={handleDownloadPDF}
          className="h-14 items-center gap-3 rounded-full bg-[#3365E30F] text-sm font-medium text-main-100 hover:bg-blue-700 hover:text-blue-50"
        >
          <span>
            <DocumentDownload size={20} />
          </span>
          Download PDF
        </Button>
        <Button
          variant="outline"
          className="h-14 rounded-full border-main-100 text-sm font-medium text-main-100 hover:border-blue-700 hover:text-blue-700"
        >
          Report Transaction
        </Button>
      </div>
    </div>
  );
};

export default DownloadInvoice;
