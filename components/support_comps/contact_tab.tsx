import { CallOutgoing, Sms, Whatsapp } from "iconsax-react";
import { ChevronRight } from "lucide-react";
import React from "react";

const ContactTab = () => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#09091A]">
        Reach out to our friendly team
      </h2>
      <p className="mt-2 text-[#5C5C5C]">
        Select option that is more convenient for you, our team are always
        ready.
      </p>

      <div className="mt-10 space-y-[18px]">
        {contactInfo.map((info: any, index: number) => (
          <div
            key={index}
            onClick={info.buttonAction}
            className="grid max-w-96 cursor-pointer grid-cols-[42px_1fr_20px] items-center justify-between gap-3 rounded-lg border border-[#E0E0E0] bg-[#FCFCFC] p-3"
          >
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#F2F2F2]">
              {info.icon}
            </span>
            <div>
              <h3 className="text-sm font-medium text-[#09091A]">
                {info.title}
              </h3>
              <p className="mt-1 text-sm text-[#767676]">{info.description}</p>
            </div>
            <span className="text-[#828282]">
              <ChevronRight size={20} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContactTab;

const contactInfo = [
  {
    icon: <CallOutgoing size={24} />,
    title: "+234(811)6665321",
    description: "We are available to speak with you",
    buttonLabel: "Call Now",
    buttonAction: () => {
      window.open("tel:+2348116665321", "_self");
      alert("calling");
    },
  },
  {
    icon: <Sms size={24} />,
    title: "Send us a mail",
    description: "Send us mail and we will get back soon",
    buttonLabel: "Email Us",
    buttonAction: () => window.open("mailto:hello@goloka.io"),
  },
  {
    icon: <Whatsapp size={42} color="#60D669" variant="Bold" />,
    title: "WhatsApp",
    description: "Relate to us like your best buddy",
    buttonLabel: "Chat Now",
    buttonAction: () => window.open("https://wa.me/2348116665321", "_blank"),
  },
];
