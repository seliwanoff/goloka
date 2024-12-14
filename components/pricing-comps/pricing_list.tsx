"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CheckIcon, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { BiCheck } from "react-icons/bi";
import PriceCard from "./price_card";
import { cn } from "@/lib/utils";

const PricingList = () => {
  const [plans, setPlans] = useState<IPlan[]>(
    pricingPlan.filter((item) => item.billingCycle === "monthly"),
  );
  const [activeTab, setActiveTab] = useState("monthly");

  useEffect(() => {
    switch (activeTab?.toLowerCase()) {
      case "monthly":
        setPlans(pricingPlan.filter((item) => item.billingCycle === "monthly"));
        break;
      case "yearly":
        setPlans(pricingPlan.filter((item) => item.billingCycle === "yearly"));
        break;

      default:
        setPlans([]);

        break;
    }
  }, [activeTab]);

  console.log(plans);

  return (
    <>
      <section className="py-24">
        <div className="wrapper">
          <Tabs
            defaultValue="monthly"
            onValueChange={setActiveTab}
            className=""
          >
            <div className="flex items-center justify-center">
              <TabsList className="mx-auto mb-10 h-auto w-min rounded-full bg-[#F4F4F4] p-2">
                <TabsTrigger
                  value="monthly"
                  className="rounded-full px-6 py-2.5 text-sm font-medium text-[#333333] data-[state=active]:bg-main-100 data-[state=active]:text-white"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="rounded-full px-6 py-2.5 text-sm font-medium text-[#333333] data-[state=active]:bg-main-100 data-[state=active]:text-white"
                >
                  🔥Yearly
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="monthly">
              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 xl:grid-cols-3">
                {plans.map((item, index) => (
                  <PriceCard key={index} item={item} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="yearly">
              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 xl:grid-cols-3">
                {plans.map((item, index) => (
                  <PriceCard key={index} item={item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default PricingList;

export interface IPlan {
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  isPopular: boolean;
}

const pricingPlan: IPlan[] = [
  {
    name: "Basic plan",
    price: 10,
    billingCycle: "monthly",
    features: [
      "Access to all basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support",
    ],
    isPopular: false,
  },
  {
    name: "Business plan",
    price: 20,
    billingCycle: "monthly",
    features: [
      "200+ integrations",
      "Advanced reporting and analytics",
      "Up to 20 individual users",
      "40GB individual data each user",
      "Priority chat and email support",
    ],
    isPopular: true,
  },
  {
    name: "Enterprise plan",
    price: 40,
    billingCycle: "monthly",
    features: [
      "Advanced custom fields",
      "Audit log and data history",
      "Unlimited individual users",
      "Unlimited individual data",
      "Personalised+priority service",
    ],
    isPopular: false,
  },
  {
    name: "Basic plan",
    price: 100,
    billingCycle: "yearly",
    features: [
      "Access to all basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support",
    ],
    isPopular: false,
  },
  {
    name: "Business plan",
    price: 220,
    billingCycle: "yearly",
    features: [
      "200+ integrations",
      "Advanced reporting and analytics",
      "Up to 20 individual users",
      "40GB individual data each user",
      "Priority chat and email support",
    ],
    isPopular: true,
  },
  {
    name: "Enterprise plan",
    price: 460,
    billingCycle: "yearly",
    features: [
      "Advanced custom fields",
      "Audit log and data history",
      "Unlimited individual users",
      "Unlimited individual data",
      "Personalised+priority service",
    ],
    isPopular: false,
  },
];
