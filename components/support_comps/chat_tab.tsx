import React from "react";
import ChatWidget from "@/components/support_comps/chat-widget";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send2 } from "iconsax-react";

const ChatTab = () => {
  return (
    <>
      <div className="absolute left-0 top-0 w-full bg-[#3365E30A] px-6 py-3.5 font-semibold text-main-100">
        Chat with Goloka
      </div>

      <div className="pt-14">
        <ChatWidget />
      </div>

      <div className="absolute bottom-0 left-0 w-full border-t px-6 py-4">
        <form id="chat-box" className="block w-full">
          <div className="flex w-full items-center gap-6">
            <Input
              type="text"
              name="message"
              id="message"
              aria-label="Message"
              placeholder="Input your message"
              className="form-input h-[50px] rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
            />
            <Button className="h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white">
              <span className="">
                <Send2 size="24" />
              </span>
              Send
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatTab;
