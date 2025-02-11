import Image from "next/image";
import Link from "next/link";
import img1 from "@/public/assets/images/img1.png";
import img2 from "@/public/assets/images/img2.png";
import img3 from "@/public/assets/images/img3.png";
import { ElementEqual } from "iconsax-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type ComponentProps = {};
const HyperLocalSection: React.FC<ComponentProps> = () => {
  const router = useRouter();
  return (
    <div className="bg-[#FBFCFE] px-4 py-12 pt-28">
      <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:px-20">
        {/* Left Content */}
        <div className="flex flex-col items-center w-full flex-1 space-y-6 lg:items-start">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-2 text-sm font-medium text-main-100">
            <span>
              <ElementEqual size="19" />
            </span>
            <span>Goloka for organisation</span>
          </div>

          <h1 className="z-10 w-full text-[2rem] font-semibold text-[#101828] md:text-4xl md:leading-normal">
            Hyperlocal data for{" "}
            <span className="text-blue-600">industry decisions</span>
          </h1>

          <p className="max-w-xl mx-auto leading-normal text-[#434343] lg:mx-0">
            GOLOKA™ provides real-time, on-the-ground data even
            in hard-to-reach regions where traditional
            crowdsourcing struggles
          </p>

          <div className="w-full lg:w-auto">
            <Link href="/signin" className="block w-full lg:inline-block">
              <Button className="w-full max-w-sm mx-auto rounded-full bg-main-100 px-7 py-3.5 text-sm font-light text-white hover:bg-blue-700 lg:w-auto">
                Collect data now
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image Grid - Maintaining same layout on all screens */}
        <div className="w-full flex-1 rounded-3xl bg-[#EBF0FC] p-4">
          <div className="grid h-[350px] md:h-[550px] grid-cols-2 gap-4">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={img1}
                alt="Market street scene"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex h-full flex-col gap-4">
              <div className="relative h-1/2 w-full overflow-hidden rounded-2xl">
                <Image
                  src={img2}
                  alt="Data collection"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-1/2 w-full overflow-hidden rounded-2xl">
                <Image
                  src={img3}
                  alt="Farmer"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperLocalSection;