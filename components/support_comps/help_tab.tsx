import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpTab = () => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#09091A]">Help Center</h2>
      <p className="mt-2 text-[#5C5C5C]">
        Lorem ipsum dolor sit amet consectetur. Sed ut consectetur a libero.
        Lobortis ac sit arcu.
      </p>

      <div className="mt-10">
        <Accordion type="single" collapsible className="space-y-6">
          {help.map((item: any, index: number) => (
            <AccordionItem
              key={`item-${index + 1}`}
              className="rounded-xl border border-[#E0E0E0] p-4"
              value={`item-${index + 1}`}
            >
              <AccordionTrigger className="border-b-0 p-0 text-left font-medium text-[#333333] hover:no-underline">
                {item?.title}
              </AccordionTrigger>
              <AccordionContent className="mt-4 border-t border-[#F2F2F2] pt-4 leading-relaxed">
                {item?.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default HelpTab;

const help = [
  {
    title: "Lorem ipsum dolor sit amet consectetur Aliquetvida.",
    content:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt mi vulputate sit enim ut urna. Adipiscing augue pellentesque scelerisque semper facilisis mi condimentum in et.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur.",
    content:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt mi vulputate sit enim ut urna. Adipiscing augue pellentesque scelerisque semper facilisis mi condimentum in et.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur Aliquetvida.",
    content:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt mi vulputate sit enim ut urna. Adipiscing augue pellentesque scelerisque semper facilisis mi condimentum in et.",
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur Aliquetvida.",
    content:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt mi vulputate sit enim ut urna. Adipiscing augue pellentesque scelerisque semper facilisis mi condimentum in et.",
  },
];
