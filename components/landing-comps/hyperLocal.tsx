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
    <div className="bg-[#FBFCFE] py-12 pt-28">
      <div className="flex flex-col items-center gap-8 md:px-8 lg:flex-row lg:px-20">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-2 text-sm font-medium text-main-100">
            <span>
              <ElementEqual size="19" />
            </span>{" "}
            Goloka for organisation
          </div>

          <h1 className="z-10 w-full text-[2rem] font-semibold text-[#101828] md:text-4xl md:leading-normal">
            Hyperlocal data for <br />
            <span className="text-blue-600">industry decisions</span>
          </h1>

          <p className="leading-normal text-[#434343]">
            GOLOKA™ provides real-time, on-the-ground data even
            <br /> in hard-to-reach regions where traditional <br />{" "}
            crowdsourcing struggles
          </p>

          {/* <Button
            onClick={() => router.push("/signin")}
            className="h-auto w-10/12 rounded-full bg-main-100 px-7 py-3.5 text-sm font-light text-white hover:bg-blue-700 md:w-auto"
          >
            Collect data now
          </Button> */}

          <div>
            <Link href="/signin" className="">
              <Button className="h-auto w-10/12 rounded-full bg-main-100 px-7 py-3.5 text-sm font-light text-white hover:bg-blue-700 md:w-auto">
                Collect data now
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image */}

        <div className="flex-1 rounded-3xl bg-[#EBF0FC] p-4">
          <div className="grid h-[550px] grid-cols-2 gap-4">
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
                <Image src={img3} alt="Farmer" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperLocalSection;
