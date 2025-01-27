import NotificationType, {
  NotificationItem,
  NotificationTypeSkeleton,
} from "./notification_type_toggle";
import { useQuery } from "@tanstack/react-query";
import { getNotificationsPreference } from "@/services/misc";
import { Skeleton } from "@/components/task-stepper/skeleton";

const Notification: React.FC = () => {
  const {
    data: notificationsPref,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get notifications"],
    queryFn: getNotificationsPreference,
  });

  const pushNotifications: NotificationItem[] = [
    {
      label: "Task Updates",
      value: "push_task_updates",
      isActive: true,
    },
    {
      label: "Tasks related to me",
      value: "push_task_related",
      isActive: true,
    },
    {
      label: "Messages from organization",
      value: "push_messages",
      isActive: true,
    },
    {
      label: "Task recommendations",
      value: "push_task_recommendations",
      isActive: true,
    },
    {
      label: "Payments",
      value: "push_payments",
      isActive: true,
    },
  ];

  const emailNotifications: NotificationItem[] = [
    {
      label: "Task Updates",
      value: "email_task_updates",
      isActive: true,
    },
    {
      label: "Tasks related to me",
      value: "email_task_related",
      isActive: false,
    },
    {
      label: "Messages from organization",
      value: "email_messages",
      isActive: true,
    },
    {
      label: "Payments",
      value: "email_payments",
      isActive: true,
    },
  ];

  // Function to get initial state from preferences
  const getInitialState = (
    notifications: NotificationItem[],
    prefData: any,
  ) => {
    return notifications.map((item) => ({
      ...item,
      isActive: prefData ? prefData[item.value] === 1 : item.isActive,
    }));
  };

  const updatedPushNotifications = getInitialState(pushNotifications, notificationsPref?.data);

  const updatedEmailNotifications =  getInitialState(emailNotifications, notificationsPref?.data);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6">
        <div>
          <Skeleton className="mb-4 h-8 w-1/2" />
          <Skeleton className="mb-8 h-4 w-3/4" />
          <NotificationTypeSkeleton />
        </div>
        <div className="mt-12">
          <Skeleton className="mb-4 h-8 w-1/2" />
          <Skeleton className="mb-8 h-4 w-3/4" />
          <NotificationTypeSkeleton />
        </div>
      </div>
    );
  }



  return (
    <div className="w-full max-w-4xl rounded-2xl bg-white p-6">
      <div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-[#101828]">
            Push Notification
          </h3>
          <p className="text-sm text-[#475467]">
            Messages you receive from the app
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {updatedPushNotifications?.map((item) => (
            <NotificationType
              type="push"
              data={item}
              key={item.value}
              initialActiveState={item.isActive}
              refetchPreferences={refetch}
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
          {updatedEmailNotifications?.map((item) => (
            <NotificationType
              type="email"
              data={item}
              key={item.value}
              initialActiveState={item.isActive}
              refetchPreferences={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
