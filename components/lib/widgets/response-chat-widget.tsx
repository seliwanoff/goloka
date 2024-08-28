import profileImg from "@/public/assets/images/chat-user-profile.png";
import Image from "next/image";

const ChatWidget = () => {
  return (
    <>
      <div className="flex flex-col space-y-8 p-4 pb-20 md:self-stretch md:pb-4">
        {/* Receiver's Message  */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-2xl bg-gray-200 p-4">
            <p className="text-[#100C2A]">
              Hi Style Terrain, How can i assign role to my sraff on this
              platform
            </p>
            <span className="mt-1 block text-right text-xs text-[#9A96A4]">
              1:32 PM
            </span>
          </div>
        </div>

        {/* Sender's Message  */}
        <div className="flex items-end justify-start gap-4">
          <Image
            src={profileImg}
            alt="chat-user"
            className="h-12 w-12 rounded-full object-cover object-center"
          />
          <div className="max-w-xs rounded-2xl bg-blue-500 p-4">
            <p className="text-white">
              Hi Style Terrain, How can i assign role to my sraff on this
              platform
            </p>
            <span className="mt-1 block text-left text-xs text-[#EBF0FC]">
              1:32 PM
            </span>
          </div>
        </div>

        {/* Receiver's Message  */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-2xl bg-gray-200 p-4">
            <p className="text-[#100C2A]">
              Lorem ipsum dolor sit amet consectetur.
            </p>
            <span className="mt-1 block text-right text-xs text-[#9A96A4]">
              1:32 PM
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
