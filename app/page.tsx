'use client'
import Image from "next/image";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
import Logo from "@/public/assets/images/thumb.svg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">

      <Image
        src={Logo}
        alt="goloka_logo"
        className="mb-4"
        width={60}
        height={80}
      />


      <Link href="/signup" className="mb-6 text-center text-2xl">
        Goloka
      </Link>


      <Link
        href="/signin"
        className="flex items-center gap-2 rounded-md bg-main-100 px-6 py-2 text-white transition-colors duration-300 hover:bg-main-200"
      >
        <span>Sign In</span>
        <FiUser className="" />
      </Link>


      <p className="mt-4 text-center text-xs text-gray-500">
        Development mode screen powered by{" "}
        <span
          className="cursor-pointer text-main-100 underline"
          onClick={() => alert("Please sign in to continue.")}
        >
          @goloka_dev
        </span>
      </p>
    </main>
  );
}
