import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const NotificationType: React.FC<{
  data: any;
  type: "push" | "email";
}> = ({ data, type }) => {
  const [active, setActive] = useState(data?.isActive);
  const handleChange = (val: any) => {
    const notifyData = {
      notificationType: type,
      notificationName: data?.value,
      isActive: val,
    };
    console.log(notifyData); // send to backend
    setActive(val);
  };

  return (
    <>
      <div className="flex w-full items-center justify-between rounded-full bg-[#F8F8F8] px-3 py-4">
        <span className="text-base font-medium text-[#333]">{data?.label}</span>

        <Switch
          className="bg-[#EAEAEA] shadow-[0_0_1px_rgba(0,0,0,0.25)] data-[state=checked]:bg-[#EAEAEA] *:data-[state=checked]:bg-main-100 *:data-[state=unchecked]:bg-[#E0E0E0] *:data-[state=unchecked]:shadow-[0_0_3px_rgba(0,0,0,0.25)]"
          checked={active}
          onCheckedChange={handleChange}
        />
      </div>
    </>
  );
};

export default NotificationType;
