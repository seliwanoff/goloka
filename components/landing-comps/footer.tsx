import React from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import LogoImg from "@/public/assets/images/goloka-full-logo.svg";
import Link from "next/link";
import { Phone } from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";

type Props = {};

const Footer = (props: Props) => {
  return (
    <>
      <div className="py-10">
        <div className="wrapper grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            {/* -- logo */}
            <div className="w-24 lg:w-32">
              <AspectRatio ratio={25 / 9}>
                <Image src={LogoImg} alt="logo" fill />
              </AspectRatio>
            </div>
            <p className="mt-6 text-sm font-medium text-[#4F4F4F] md:text-base">
              Goloka is a robust data collection platform that leverages AI and <br/>
              citizen-sourced data to deliver real-time, localised insights <br/>
              which unlocks hyperlocal research for business, <br/>government and
              development organisations
            </p>
          </div>

          <div className="col-span-2 flex justify-between">
            <div>
              <h3 className="items-end text-base font-semibold text-[#333]">
                Company
              </h3>
              <ul className="mt-4 space-y-2 text-sm font-medium text-[#4F4F4F] md:text-base">
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="#">Blog</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#333]">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm font-medium text-[#4F4F4F] md:text-base">
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions">Terms and conditions</Link>
                </li>
                <li>
                  <Link href="/security">Security</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-normal space-x-6 text-main-100 md:justify-end">
              <Link href={"#"}>
                <FaFacebook size={20} />
              </Link>
              <Link href={"#"}>
                <FaTwitter size={20} />
              </Link>
              <Link href={"#"}>
                <BiLogoInstagramAlt size={20} />
              </Link>
            </div>
            <ul className="mt-4 space-y-2 text-left text-sm font-medium text-neutral-900 md:text-right md:text-base">
              <li>
                Plot 404, Marcus Garvey St, 54Road,
                <br /> 5th Ave, Gwarimpa, Abuja, Nigeria
              </li>
              <li>contact@goloka.com</li>
              <li>+234 (811) 666 5321</li>
            </ul>
          </div>

          {/* COPYRIGHT */}

          <div className="text-center text-xs text-[#797B89] md:col-span-4">
            <hr className="mb-3" />
            Copyright © 2024 GOLOKA
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
