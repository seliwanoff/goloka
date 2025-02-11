import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/assets/images/hero-3.png";
import { ElementEqual } from "iconsax-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type ComponentProps = {};
const HeroSection: React.FC<ComponentProps> = () => {
  const router = useRouter();
  return (
    <div className="px-4 py-12 pt-28">
      <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:px-20">
        {/* Left Content */}
        <div className="flex flex-col items-center w-full flex-1 space-y-6 lg:items-start">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-2 text-sm font-medium text-main-100">
            <span>
              <ElementEqual size="19" />
            </span>
            <span className="text-center">
              The world of localized and organic data
            </span>
          </div>

          <h1 className="z-10 w-full text-[2rem] font-semibold text-[#101828] md:text-4xl md:leading-normal">
            The Smartest Way to{" "}
            <span className="text-blue-600">Collect and Analyze</span>{" "}
            Hyperlocal Data
          </h1>

          <p className="max-w-xl mx-auto leading-normal text-[#434343] lg:mx-0">
            GOLOKA™ offers affordable, point-of-interest insights using native
            intelligence, mobile, and geospatial technologies.
          </p>

          <div className="w-full lg:w-auto">
            <Link href="/signup" className="block w-full lg:inline-block">
              <Button className="w-full max-w-sm mx-auto rounded-full bg-main-100 px-7 py-3.5 text-sm font-light text-white hover:bg-blue-700 lg:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full max-w-2xl mx-auto flex-1 rounded-2xl bg-[#EBF0FC] p-4 lg:max-w-none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src={heroImage}
              alt="Aerial view of a city with dense housing"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;