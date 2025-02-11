import { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";

// Types and Interfaces
interface IntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  showK?: boolean;
  numberColor?: string;
}

interface StatCard {
  value: number;
  showK: boolean;
  title: string;
  description: string;
  bgColor: string;
  titleColor: string;
  numberColor: string;
  descriptionColor: string;
}

interface StatsSectionProps {
  starIcon: StaticImageData;
  topographicPattern: StaticImageData;
  stats: StatCard[];
}

// Utility function to format numbers
const formatNumber = (num: number, showK: boolean = false): string => {
  if (showK && num >= 1000) {
    return (num / 1000).toFixed(0) + "k";
  }
  return num.toString();
};

// Custom hook for intersection observer
const useIntersectionObserver = (options: IntersectionObserverOptions = {}) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isVisible] as const;
};

// Counter component
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  showK = false,
  numberColor = "text-black",
}) => {
  const [count, setCount] = useState<number>(0);
  const [elementRef, isVisible] = useIntersectionObserver({
    threshold: 0.2,
  });

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number): void => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span
      ref={elementRef}
      className={`text-5xl font-black tracking-tight ${numberColor}`}
    >
      {formatNumber(count, showK)}+
    </span>
  );
};

// Main component
const StatsSection: React.FC<StatsSectionProps> = ({
  starIcon,
  topographicPattern,
  stats,
}) => {
  return (
    <section className="  py-16">
      <div className="wrapper">
        <div className="mb-16 flex flex-col items-center gap-6">
          <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
            <span>
              <Image src={starIcon} alt="star icon" width={20} height={20} />
            </span>
            The fast growing Data World
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:items-end">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`space-y-4 rounded-3xl p-6 relative ${stat.bgColor} ${
                index === 0 ? "md:col-span-2 xl:col-span-1" : ""
              } ${index === 1 ? "xl:h-[400px]" : ""}`}
            >
              {index === 1 && (
                <Image
                  src={topographicPattern}
                  alt="Topographic pattern"
                  className="absolute left-0 top-0 aspect-square h-full w-full object-cover opacity-20"
                />
              )}
              <div
                className={`relative z-10 h-full space-y-9 ${
                  index === 1 ? "xl:flex xl:flex-col xl:justify-between" : ""
                }`}
              >
                <h3 className="">
                  <AnimatedCounter
                    end={stat.value}
                    showK={stat.showK}
                    numberColor={stat.numberColor}
                  />
                  <div className={`text-2xl font-medium ${stat.titleColor}`}>
                    {stat.title}
                  </div>
                </h3>
                <p className={`text-lg ${stat.descriptionColor}`}>
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
