
import "./globals.css";
import type { Metadata } from "next";
import TanstackProvider from "@/components/layout/tanstackProvider";
import LandingNavbar from "@/components/lib/navigation/landing_navbar";
import Footer from "@/components/landing-comps/footer";

export const metadata: Metadata = {
  title: "Goloka | Write with ease",
  description: "Goloka is your personal writer",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* className={poppins.className} */}
      <body>
        <TanstackProvider>
          <LandingNavbar />
          <div className="-z-10">{children}</div>
        </TanstackProvider>
      </body>
    </html>
  );
}
