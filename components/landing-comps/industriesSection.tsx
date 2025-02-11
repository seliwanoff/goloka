import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Imagx from "@/public/assets/images/imageGoloka.png";

interface IndustryItem {
  title: string;
  content: string;
}

interface IndustriesSectionProps {
  worldMapBg: string;
}

const industries: IndustryItem[] = [
  {
    title: "Consumer Goods",
    content:
      "Enhance retail performance with actionable insights into product availability and visibility.",
  },
  {
    title: "International Development",
    content:
      "International Development: Streamline data collection to maximise impact in various communities.",
  },
  {
    title: "Public Sector:",
    content:
      "Understand local communities on a global scale through directly sourced data insights.",
  },
  {
    title: "AI Companies:",
    content:
      "Fuel machine learning models with high-quality, real-world training data collected from diverse locations. Goloka provides accurate, geotagged, and verified datasets, enabling AI firms to develop smarter, more adaptive algorithms for various applications, including computer vision, NLP, and geospatial analytics.",
  },
];

const IndustriesSection = ({ worldMapBg }: IndustriesSectionProps) => {
  return (
    <section className="relative min-h-screen w-full bg-[#001B3D] py-16">
      {/* Background with map and dots effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={worldMapBg}
          alt="World map background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#001B3D]/50" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          {/* Left side content */}
          <div className="w-full space-y-8 lg:w-1/2">
            <div className="flex items-center gap-2 text-white/80">
              <span className="inline-block rotate-45">✦</span>
              <span>Industries we serve</span>
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Real time insights on products, projects and public opinions
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {industries.map((industry, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-white hover:bg-white/10 hover:no-underline">
                    {industry.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-white/80">
                    {industry.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right side map */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
              <Image
                src={Imagx}
                alt="Location map view"
                fill
                className="object-cover"
                priority
              />
              {/* Pins can be added here as absolute positioned elements */}
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute h-4 w-4 rounded-full",
                    index % 2 === 0 ? "bg-red-500" : "bg-yellow-400",
                    "animate-pulse",
                  )}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
