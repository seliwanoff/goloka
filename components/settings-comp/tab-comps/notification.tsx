import { emailNotifications, pushNotifications } from "@/utils";
import NotificationType from "./notification_type_toggle";

type ComponentProps = {};

const Notification: React.FC<ComponentProps> = ({}) => {
  return (
    <>
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6">
        <div>
          <div className="">
            <h3 className="mb-1 text-lg font-semibold text-[#101828]">
              Push Notification
            </h3>
            <p className="text-sm text-[#475467]">
              Messages you receive from the app
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {pushNotifications?.map((item: any, index: number) => (
              <NotificationType
                type="push"
                data={item}
                key={item.value + index}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mt-[64px]">
            <h3 className="mb-1 text-lg font-semibold text-[#101828]">
              Email Notification
            </h3>
            <p className="text-sm text-[#475467]">
              Messages that will be sent to your mail
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {emailNotifications?.map((item: any, index: number) => (
              <NotificationType
                type="email"
                data={item}
                key={item.value + index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
