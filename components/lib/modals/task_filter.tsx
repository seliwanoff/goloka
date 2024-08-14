import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "iconsax-react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type ComponentProps = {
  open: boolean;
  action: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const TaskFilterDrawerMobile: React.FC<ComponentProps> = ({
  open,
  action,
  setOpen,
}) => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="lg:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="focus-visible:outline-none lg:hidden">
          <div className="flex items-center justify-between px-4 md:px-8">
            <h3 className="text-lg font-medium text-[#333333]">Filter</h3>
            <span
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#4F4F4F]"
            >
              <X />
            </span>
          </div>
          <div className="mt-8 px-8">
            <form id="filter-task" className="grid grid-cols-2 gap-5 gap-y-6">
              <div>
                <Label htmlFor="min-price" className="mb-2 inline-block">
                  Min price
                </Label>
                <Input
                  type="text"
                  name="min-price"
                  placeholder="$0"
                  id="min-price"
                  className="focus:border-main form-input h-[56px] rounded-lg border-[#D9DCE0] placeholder:text-[#828282]"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="mb-2 inline-block">
                  Max price
                </Label>
                <Input
                  type="text"
                  name="max-price"
                  placeholder="$0"
                  id="max-price"
                  className="focus:border-main form-input h-[56px] rounded-lg border-[#D9DCE0] placeholder:text-[#828282]"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="number" className="mb-2 inline-block">
                  Number of question
                </Label>
                <Input
                  type="text"
                  name="number"
                  placeholder="$0"
                  id="number"
                  className="focus:border-main form-input h-[56px] rounded-lg border-[#D9DCE0] placeholder:text-[#828282]"
                />
              </div>

              <div className="col-span-2">
                {/* DATE */}
                <Popover>
                  <PopoverTrigger asChild className="w-full">
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-[56px] w-full justify-between gap-3 rounded-full border-[#D9DCE0] px-3 pr-1 text-center text-sm font-normal",
                      )}
                    >
                      {date ? format(date, "PPP") : <span>End date</span>}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                        <Calendar size={20} color="#828282" className="m-0" />
                      </span>{" "}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <CalenderDate
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </form>
          </div>
          <DrawerFooter className="mt-[70px] grid grid-cols-2 gap-5 px-8">
            <Button
              variant="outline"
              className="h-auto w-full rounded-full border-main-100 px-12 py-4 text-main-100"
            >
              Clear
            </Button>
            <DrawerClose>
              <Button className="h-auto w-full rounded-full bg-main-100 px-12 py-4 text-white">
                Apply
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TaskFilterDrawerMobile;
