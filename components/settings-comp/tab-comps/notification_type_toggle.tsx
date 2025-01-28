import { Switch } from "@/components/ui/switch";
import {
  getNotificationsPreference,
  notificationPreferences,
} from "@/services/misc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type NotificationItem = {
  label: string;
  value: string;
  isActive: boolean;
};

export const NotificationTypeSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="flex w-full items-center justify-between rounded-full bg-gray-100 px-3 py-4"
      >
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200" />
      </div>
    ))}
  </div>
);

const NotificationType: React.FC<{
  data: NotificationItem;
  type: "push" | "email";
  initialActiveState: boolean;
  refetchPreferences: () => void;
}> = ({ data, type, initialActiveState, refetchPreferences }) => {
  const [active, setActive] = useState(initialActiveState);
  const [loading, setLoading] = useState(false);

  // Update active state when initialActiveState changes
  useEffect(() => {
    setActive(initialActiveState);
  }, [initialActiveState]);

  // const handleChange = async (val: boolean) => {
  //   setLoading(true);
  //   const notifyData = {
  //     notificationType: type,
  //     notificationName: data?.value,
  //     isActive: val,
  //   };

  //   try {
  //     await notificationPreferences(notifyData);

  //     // Refetch the preferences to get the latest state from backend
  //     refetchPreferences();

  //     // Optimistically update the state
  //     setActive(val);
  //   } catch (error) {
  //     //@ts-ignore
  //     toast.error(error?.response?.data?.message);
  //     console.error("Error updating notification preferences:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleChange = async (val: boolean) => {
    setLoading(true);

    // Create FormData
    const formData = new FormData();

    // Add the current notification's value with its new state (1 or 0)
    formData.append(data.value, val ? "1" : "0");

    try {
      const res = await notificationPreferences(formData);

      // Refetch the preferences to get the latest state from backend
      refetchPreferences();

      // Optimistically update the state
      setActive(val);
      //@ts-ignore
      toast.success(res.message);
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message);
      console.error("Error updating notification preferences:", error);
    } finally {
      setLoading(false);
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
          className={`bg-[#fff] shadow-[0_0_1px_rgba(0,0,0,0.25)] data-[state=checked]:bg-[#fff] *:data-[state=checked]:bg-main-100 *:data-[state=unchecked]:bg-[#fff] *:data-[state=unchecked]:shadow-[0_0_3px_rgba(0,0,0,0.25)] ${
            loading ? "pointer-events-none opacity-50" : ""
          }`}
          checked={active}
          onCheckedChange={handleChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default NotificationType;
