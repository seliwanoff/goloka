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
    <div className="py-12 pt-28">
      <div className="flex flex-col items-center gap-8 md:px-8 lg:flex-row lg:px-20">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-2 text-sm font-medium text-main-100">
            <span>
              <ElementEqual size="19" />
            </span>{" "}
            The world of localized and organic data
          </div>
          <h1 className="z-10 w-full text-[2rem] font-semibold text-[#101828] md:text-4xl md:leading-normal">
            The Smartest Way to{" "}
            <span className="text-blue-600">Collect and Analyze</span>{" "}
            Hyperlocal Data
          </h1>
          <p className="leading-normal text-[#434343]">
            GOLOKA™ offers affordable, point-of-interest insights using native
            intelligence,
            <br /> mobile, and geospatial technologies.
          </p>
          <div>
            <Link href="/signup">
              <Button
                // onClick={() => router.push("/signin")}
                className="h-auto w-10/12 rounded-full bg-main-100 px-7 py-3.5 text-sm font-light text-white hover:bg-blue-700 md:w-auto"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full flex-1 rounded-2xl bg-[#EBF0FC] p-4">
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
