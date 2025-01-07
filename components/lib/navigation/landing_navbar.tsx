"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { classMerge } from "@/lib/utils";
import LogoImg from "@/public/assets/images/goloka-full-logo.svg";
import WhiteLogoImg from "@/public/assets/images/goloka-full-logo.svg";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePathname } from "next/navigation";
import Menu from "@/public/assets/images/menu-alt.svg";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

type ComponentProps = {};

const LandingNavbar: React.FC<ComponentProps> = ({}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrollValue, setScrollValue] = useState<number>(0);
  const handleScroll = () => {
    setScrollValue(() => window.scrollY);
  };
  useEffect(() => {
    window && handleScroll();
    window.addEventListener("load", handleScroll);
    window.addEventListener("focus", handleScroll);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    window.addEventListener("loadstart", handleScroll);

    return () => {
      window.removeEventListener("load", handleScroll);
      window.removeEventListener("focus", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("loadstart", handleScroll);
    };
  });

  return (
    <div
      style={{ zIndex: 100 }}
      className={classMerge(
        "flex w-full items-center justify-between px-3 py-2 " +
          "transit fixed top-0 bg-white md:px-8 lg:px-20",
        scrollValue > 0 ? "shadow-md" : "shadow-none",
        pathname.includes("/dashboard") && "hidden",
      )}
    >
      {/* -- logo */}
      <div
        className="w-24 cursor-pointer lg:w-28"
        onClick={() => router.push("/")}
      >
        {scrollValue > 0 ? (
          <AspectRatio ratio={20 / 9}>
            <Image src={LogoImg} alt="logo" fill />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={20 / 9}>
            <Image src={WhiteLogoImg} alt="logo" fill />
          </AspectRatio>
        )}
      </div>

      {/* -- desktop links */}
      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={classMerge(
              "transit text-base font-medium text-[#4F4F4F] hover:text-main-100",
              pathname.includes(link.href)
                ? "hover:text-primary-400 text-primary"
                : "",
            )}
          >
            {link.text}
          </Link>
        ))}
      </nav>

      <Button
        variant={scrollValue > 0 ? "default" : "secondary"}
        className="mr-16 hidden rounded-full bg-main-100 px-6 text-white hover:bg-blue-700 md:block"
        onClick={() => router.push("/signin")}
      >
        Get Started
      </Button>

      {/* -- mobile links */}
      <Popover>
        <PopoverTrigger className="md:hidden">
          <Image src={Menu} alt="Menu" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.text}
              className={classMerge(
                "transit text-sm font-normal",
                pathname.includes(link.href)
                  ? "hover:text-primary-400 text-primary"
                  : "text-gray-600 hover:text-black",
              )}
            >
              {link.text}
            </Link>
          ))}
          <Button className="mt-3" onClick={() => router.push("/signin")}>
            Get Started
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LandingNavbar;

const navLinks: { text: string; href: string }[] = [
  // { text: "Products", href: "/" },
  // { text: "Solution", href: "/" },
  { text: "Case study", href: "/case-studies" },
  { text: "Pricing", href: "/pricing" },
  { text: "Blog", href: "/blog" },
];
