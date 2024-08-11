import DashTopNav from "@/components/lib/navigation/dash_topnav";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Link href={"/signup"}> Goloka</Link>
      <DashTopNav />
    </main>
  );
}
