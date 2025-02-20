import "./globals.css";
import type { Metadata } from "next";
import TanstackProvider from "@/components/layout/tanstackProvider";
import LandingNavbar from "@/components/lib/navigation/landing_navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { AblyProvider } from "@ably-labs/react-hooks";
// import { ably } from "@/lib/ably";
export const metadata: Metadata = {
  title: "Goloka | Real Time Market Intelligence",
  description: "Access real-time, on-the-ground data from anywhere in the world",
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
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {/* <AblyProvider client={ably}> */}
          <TanstackProvider>
            <LandingNavbar />
            <div className="-z-10">{children}</div>
          </TanstackProvider>
          {/* </AblyProvider> */}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
