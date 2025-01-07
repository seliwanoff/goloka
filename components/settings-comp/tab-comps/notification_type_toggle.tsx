import { Switch } from "@/components/ui/switch";
import { notificationPreferences } from "@/services/misc";
import { useState } from "react";
import { toast } from "sonner";

const NotificationType: React.FC<{
  data: any;
  type: "push" | "email";
}> = ({ data, type }) => {
  const [active, setActive] = useState(data?.isActive);
  const [loading, setLoading] = useState(false);

  const handleChange = async (val: boolean) => {
    setLoading(true); // Start loading
    const notifyData = {
      notificationType: type,
      notificationName: data?.value,
      isActive: val,
    };

    try {
      const res = await notificationPreferences(notifyData?.notificationName);
      console.log(notifyData); // send to backend
      setActive(val);
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
      console.error("Error updating notification preferences:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex w-full items-center justify-between rounded-full bg-gray-100 px-3 py-4">
      <span className="text-base font-medium text-gray-800">{data?.label}</span>

      <div className="flex items-center space-x-2">
        {loading && (
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"
            aria-label="Loading"
          ></div>
        )}
        <Switch
          // className={`bg-gray-300 shadow-sm transition-opacity duration-200 ${
          //   loading ? "pointer-events-none opacity-50" : ""
          // }`}
          className={`bg-[#fff] shadow-[0_0_1px_rgba(0,0,0,0.25)] data-[state=checked]:bg-[#fff] *:data-[state=checked]:bg-main-100 *:data-[state=unchecked]:bg-[#fff] *:data-[state=unchecked]:shadow-[0_0_3px_rgba(0,0,0,0.25)] ${
            loading ? "pointer-events-none opacity-50" : ""
          }`}
          checked={active}
          onCheckedChange={handleChange}
          disabled={loading} // Disable the switch while loading
        />
      </div>
    </div>
  );
};

export default NotificationType;
