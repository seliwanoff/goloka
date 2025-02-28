"use client";
import { Button } from "@/components/ui/button";
import rayda from "@/public/assets/images/rayda.svg";
import open from "@/public/assets/images/open.svg";
import swofon from "@/public/assets/images/swofon.svg";
import jsk from "@/public/assets/images/jsk.svg";
import ille from "@/public/assets/images/ille.svg";
import jaisaa from "@/public/assets/images/jaisaa.svg";
import IBP from "@/public/assets/images/IBP.svg";
import HEDA from "@/public/assets/images/heda.svg";
import space from "@/public/assets/images/pace.svg";
import Star from "@/public/assets/images/star-shade.svg";
import Image from "next/image";
import Pattern from "@/public/assets/pattern-bg.svg";

import Topographic from "@/public/assets/images/Topographic.svg";
import Thumb from "@/public/assets/images/thumb.svg";
import AppleStore from "@/public/assets/images/App Store.png";
import PlayStore from "@/public/assets/images/Play Store.png";
import AppPreview from "@/public/assets/images/download-app.png";

import FinIcon from "@/public/assets/images/finance-icon.png";
import userResp from "@/public/assets/images/user-response.jpg";
import { ArrowRight, Category2, Location } from "iconsax-react";
import Link from "next/link";

import Testimonials from "@/components/landing-comps/testimonials";
import Marquee from "@/components/ui/marquee";
import Footer from "@/components/landing-comps/footer";
import { getGuestCampaign } from "@/services/campaign";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/task-stepper/skeleton";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/landing-comps/heroSection";
import StatsSection from "@/components/landing-comps/statSection";
import IndustriesSection from "@/components/landing-comps/industriesSection";
import HyperLocalSection from "@/components/landing-comps/hyperLocal";
import man from "@/public/assets/images/man.png";
import bgImage from "@/public/assets/images/bgImage.png";
import CampaignList from "@/components/landing-comps/campaignList";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import BlogCard from "@/components/landing-comps/blog-comps/BlogCard";
import { blogData } from "@/utils/blog";

const LandingPage = () => {
  const router = useRouter();
  const {
    data: campaignData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get guest user"],
    queryFn: getGuestCampaign,
  });

  return (
    <div>
      {/* ####################################### */}
      {/* -- Hero Section */}
      {/* ####################################### */}
      <HeroSection />
      {/* ####################################### */}
      {/* -- Partners Section */}
      {/* ####################################### */}
      <section className="px-4 py-8">
        <div className="space-y-6 px-4">
          <p className="py-3 text-center text-xl font-extrabold text-[#071E3B]">
            Organisations that{" "}
            <span className="text-blue-600">count on us</span>{" "}
          </p>
          <Marquee pauseOnHover className="relative mt-10 [--duration:40s]">
            <div className="grid grid-cols-9">
              <Image src={rayda} alt="rayda" />
              <Image src={open} alt="open" />
              <Image src={swofon} alt="swofon" />
              <Image src={jsk} alt="jsk" />
              <Image src={ille} alt="ille" />
              <Image src={jaisaa} alt="jaisaa" />
              <Image src={IBP} alt="IBP" />
              <Image src={HEDA} alt="HEDA" />
              <Image src={space} alt="SPCE" />
            </div>
          </Marquee>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- Stats Section */}
      {/* ####################################### */}
      {/* <section className="py-16">
        <div className="wrapper">
          <div className="mb-16 flex flex-col items-center gap-6">
            <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Image src={Star} alt="star icon" />
              </span>{" "}
              The fast growing Data World
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:items-end">
            <div className="space-y-9 rounded-3xl bg-[#F3F3F3] p-6 md:col-span-2 xl:col-span-1">
              <h3 className="text-3xl font-extrabold leading-[40px]">
                25k+
                <br />
                <span className="font-medium">Contributors</span>
              </h3>
              <p className="text-[#333]">
                Our growing community of data contributors are driven by the
                passion to contribute to important research projects that have
                real-world impact.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-[#004378] p-6 xl:h-[400px]">
              <div className="relative z-10 h-full space-y-9 xl:flex xl:flex-col xl:justify-between">
                <h3 className="text-3xl font-extrabold leading-[40px] text-white">
                  10k+
                  <br />
                  <span className="font-normal">Organisations</span>
                </h3>
                <p className="text-[#fff]">
                  Organisations and businesses leverage Goloka&apos;s powerful
                  features, powered by advanced AI algorithms, to make
                  data-driven decisions that optimise performance, reduce
                  losses, and increase revenue.
                </p>
              </div>
              <Image
                src={Topographic}
                alt="Topographic pattern"
                className="absolute left-0 top-0 aspect-square h-full w-full object-cover"
              />
            </div>
            <div className="space-y-9 rounded-3xl bg-[#2F80ED] p-6">
              <h3 className="text-3xl font-extrabold leading-[40px] text-white">
                500k+
                <br />
                <span className="font-medium">Campaigns</span>
              </h3>
              <p className="text-[#fff]">
                Campaigns launched on Goloka harness geospatial technology,
                integrating surveys, remote sensing technology, native
                intelligence, and AI to collect, analyse, and verify data for
                accurate location-based insights.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <StatsSection
        starIcon={Star}
        topographicPattern={Topographic}
        stats={stats}
      />

      {/* ####################################### */}
      {/* -- Industries Section */}
      {/* ####################################### */}
      <IndustriesSection worldMapBg={bgImage} />
      {/* ####################################### */}
      {/* -- HyperLocal Section */}
      {/* ####################################### */}

      <HyperLocalSection />

      {/* ####################################### */}
      {/* -- CTA2 Section */}
      {/* ####################################### */}
      <section className="py-16">
        <div className="wrapper lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-24">
          <div className="mb-16 lg:col-[2/4] lg:mb-0">
            <div className="mb-6 inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Category2 size="20" variant="Bold" />
              </span>{" "}
              Goloka for contributor
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-snug lg:leading-relaxed">
              Collect Data Around You&nbsp;
              <span className="text-main-100">
                and Earn Cash Today!and Earn Cash Today!
              </span>
            </h2>
            <p className="text-[#434343] md:text-balance">
              Our product provides real-time, highly-localised, spatial-enriched
              insights and analytics to empower businesses,
            </p>
            <div>
              <Link href="/signup">
                <Button className="mt-6 h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-700 md:w-auto">
                  Start earning in 2 minutes
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative lg:col-[1/2] lg:row-[1]">
            <div className="overflow-hidden rounded-3xl bg-[#3365E30A] p-3">
              <Image src={man} alt="cta" className="object-cover" />
            </div>

            <div className="absolute left-0 top-[280px] grid w-max grid-cols-[40px_1fr_30px] gap-3 rounded-full border border-[#14342C0F] bg-white p-2 md:left-6 lg:-right-14 lg:bottom-7 lg:left-auto lg:top-auto">
              <Image
                src={userResp}
                alt="user-profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm text-[#4F4F4F]">
                  Your response has been approve
                </h3>
                <p className="text-xs text-[#4F4F4F]">
                  Mohh_Jumah Organisation
                </p>
              </div>
              <span className="text-xl">🎉</span>
            </div>

            <div className="absolute -right-3 top-10 grid grid-cols-[40px_1fr_30px] items-center justify-items-center gap-3 rounded-full border border-[#14342C0F] bg-white p-2 md:right-6 md:top-16 lg:-right-20 lg:top-24">
              <Image
                src={FinIcon}
                alt="FInance icon"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm text-[#4F4F4F]">New credit alert!</h3>
                <p className="text-xs text-[#4F4F4F]">
                  Mohh_Jumah Organisation
                </p>
              </div>
              <span className="text-base font-medium text-main-100">$32</span>
            </div>
          </div>
        </div>
      </section>

      {/* ####################################### */}
      {/* -- KEY Benefits Section */}
      {/* ####################################### */}
      <section className="py-16">
        <div className="wrapper">
          <div className="mb-16 flex flex-col items-center gap-6 md:mx-auto lg:w-10/12 xl:w-7/12">
            <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Image src={Star} alt="star icon" />
              </span>{" "}
              Endless data possibilities for every business
            </div>
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-normal">
              Data collection platform that serves organisations and
              contributors
            </h2>
          </div>

          <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 xl:grid-cols-3">
            {benefitsData.map((benefits, i) => (
              <div className="border border-[#F2F2F2] bg-[#FCFCFC] p-4" key={i}>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-main-100 bg-opacity-5">
                  <Image src={Thumb} alt="Thumb" />
                </span>
                <h3 className="mb-4 mt-8 text-lg font-medium text-[#333]">
                  {benefits.title}
                </h3>
                <p className="text-sm leading-6 text-[#333]">
                  {benefits.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- Testimonials Section */}
      {/* ####################################### */}
      <Testimonials />

      {/* ####################################### */}
      {/* -- Download app Section */}
      {/* ####################################### */}
      <section className="relative bg-main-100 py-16">
        <div className="wrapper lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-center xl:grid-cols-[2fr_1.5fr]">
          <div>
            <h2 className="z-40 mb-4 text-[2rem] font-semibold leading-[42px] text-white md:text-balance md:text-center md:text-[2rem] md:leading-[1.4] lg:text-pretty lg:text-left lg:text-4xl lg:leading-normal xl:text-5xl xl:leading-normal">
              Effortless data collection at your <br /> fingertips on Goloka
              Mobile
            </h2>

            <p className="z-40 text-base leading-7 text-white md:text-balance md:text-center md:text-lg lg:text-left">
              Our AI-powered app puts effortless data collection at your
              fingertips. <br />
              Create campaigns and collect highly-localised data with pinpoint
              accuracy using <br /> smartphone and remote sensing technology.{" "}
              <br />
              Plus, get rewarded for your contributions - earn money by
              collecting data on Goloka Mobile. <br /> Download now and access
              seamless data collection across all your iOS or Android devices.
            </p>
            <div className="mt-12 flex gap-3 md:justify-center lg:mx-0 lg:w-[300px]">
              <Link
                href="/"
                aria-label="download on apple store cursor-pointer"
              >
                <Image
                  src={AppleStore}
                  alt="Apple store"
                  className="z-40 w-[150px]"
                />
              </Link>
              <Link href="/" aria-label="download on play store cursor-pointer">
                <Image
                  src={PlayStore}
                  alt="Apple store"
                  className="z-40 w-[150px]"
                />
              </Link>
            </div>
          </div>
          <div className="mt-16 flex items-center justify-center lg:mt-0">
            <Image
              src={AppPreview}
              alt="Apple store"
              className="z-40 w-full max-w-[340px] xl:max-w-full"
            />
          </div>
        </div>
        <Image
          src={Pattern}
          alt="BgPattern"
          className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-20"
        />
      </section>

      {/* ####################################### */}
      {/* -- Trending Section */}
      {/* ####################################### */}
      <section className="py-10">
        <div className="wrapper">
          <div className="mb-5 sm:flex sm:flex-col sm:items-center md:mx-auto lg:w-10/12 xl:w-7/12">
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-[2rem]">
              Trending on Goloka🔥
            </h2>
            <p className="mb-6 mt-4 text-center leading-7 text-[#434343] md:text-balance">
              Contribute to the most popular and engaging data collection
              projects on the platform
            </p>
            <Button className="h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-700 sm:w-auto">
              Start earning in 2 minutes
            </Button>
          </div>
        </div>
      </section>

      {/* <section className="max-w-8xl mb-5 w-full overflow-hidden">
        <div className="no-scrollbar wrapper w-full">
          {isLoading ? (
            <div className="flex flex-col gap-4 md:w-max md:flex-row">
              {[...Array(5)].map((_, index) => (
                <CampaignCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <Marquee pauseOnHover className="relative [--duration:40s]">
              <div className="flex flex-col gap-4 md:w-max md:flex-row">
                {campaignData?.data
                  .slice(0, 8)
                  .map((campaign: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => router.push("/signin")}
                      className="flex h-[500px] w-full cursor-pointer flex-col rounded-2xl border p-3 hover:shadow-xl md:w-[380px]"
                    >
                      <AspectRatio
                        ratio={3 / 2}
                        className="overflow-hidden rounded-lg"
                      >
                        <Image
                          src={campaign.image_path[0]}
                          alt={campaign.title}
                          className="h-full w-full object-cover"
                          fill
                        />
                        <div className="absolute right-2 top-2 rounded-full border bg-white/10 px-3 py-1 text-xs font-semibold text-[#fff]">
                          {campaign.status}
                        </div>
                      </AspectRatio>

                      <div className="mt-3 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-main-100 bg-opacity-5 p-2">
                          <p className="rounded-full bg-white px-2 py-1 text-[14px] font-semibold leading-[21px] text-[#333333]">
                            {campaign.number_of_responses_received}
                          </p>
                          <p>of</p>
                          <p className="text-[14px] leading-[16.71px] text-[#828282]">
                            {campaign.number_of_responses}{" "}
                            <span className="text-[#828282]">responses</span>
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-4 py-1 text-[14px] font-semibold leading-[21px] text-[#333333]">
                          {"₦"}
                          {campaign.payment_rate_for_response}
                        </span>
                      </div>

                      <h3 className="mb-3.5 mt-4 text-[16px] font-semibold leading-[24px] text-[#333333]">
                        {campaign.title}
                      </h3>
                      <p className="line-clamp-3 flex-grow text-[16px] font-light leading-[24px] text-[#333333]">
                        {campaign.description}
                      </p>

                      <div className="mt-auto flex items-center gap-3">
                        <span className="text-[#4F4F4F]">
                          <Location size={18} color="currentColor" />
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="leading-[24px] text-[#4F4F4F]">
                            {campaign.locations?.label}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {campaign.locations.states.map(
                              (loc: any, index: any) => (
                                <p
                                  key={index}
                                  className="leading-[24px] text-[#4F4F4F]"
                                >
                                  {loc.label}
                                </p>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Marquee>
          )}
        </div>
      </section> */}

      <CampaignList
        campaignData={campaignData}
        isLoading={isLoading}
        router={router}
      />

      {/* ####################################### */}
      {/* -- Choices Section */}
      {/* ####################################### */}
      {/* <section className="py-10">
        <div className="wrapper">
          <div className="mb-16 flex flex-col items-center gap-6 md:mx-auto lg:w-10/12">
            <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Image src={Star} alt="star icon" />
              </span>{" "}
              Your best choice is here
            </div>
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-normal">
              Data generating platforms that serves organization and
              contributors
            </h2>
          </div>


          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-5 md:space-y-0 lg:grid-cols-6 lg:grid-rows-[400px_1fr] lg:gap-8">

            <div className="space-y-6 overflow-hidden rounded-3xl bg-main-100 p-6 pb-0 lg:col-span-2">
              <h3 className="text-2xl font-medium leading-8 text-white">
                Access quality and organic data
              </h3>
              <p className="text-sm leading-6 text-white">
                Gather reliable and high-quality data from a diverse pool of
                contributors
              </p>

              <Image src={Choice1} alt="Access quality and organic data" />
            </div>

            <div className="max-h-[460px] space-y-6 overflow-hidden rounded-3xl bg-[#F8F8F8] p-6 pb-0 lg:col-span-4 lg:h-full">
              <h3 className="text-2xl font-medium leading-8 text-[#071E3B]">
                Cost effective solution for gathering data
              </h3>
              <p className="text-sm leading-6 text-[#333]">
                For organizations, Goloka offers a cost-effective way to conduct
                market research and gather data without the need for extensive
                resources or time-consuming processes.
              </p>

              <Image
                src={Choice2}
                alt="Access quality and organic data"
                className="origin-top-left scale-[1.2]"
              />
            </div>

            <div className="max-h-[480px] space-y-6 overflow-clip rounded-3xl bg-[#F8F8F8] p-6 pb-0 lg:col-span-3">
              <h3 className="text-2xl font-medium leading-8 text-[#071E3B]">
                Earn by Sharing Your Valuable Opinions and Insights
              </h3>
              <p className="text-sm leading-6 text-[#333]">
                Earn money by participating in paid surveys and sharing your
                opinions. Contributors receive instant credit once their
                responses are accepted.
              </p>

              <Image
                src={Choice3}
                alt="Access quality and organic data"
                className="origin-top-left scale-[1.2]"
              />
            </div>

            <div className="max-h-[480px] space-y-6 overflow-clip rounded-3xl bg-[#F8F8F8] p-6 pb-0 lg:col-span-3">
              <h3 className="text-2xl font-medium leading-8 text-[#071E3B]">
                Secure and Confidential: Advanced Privacy Measures
              </h3>
              <p className="text-sm leading-6 text-[#333]">
                Your privacy is our priority. Goloka ensures that all your
                personal information and survey responses are protected .
              </p>

              <figure className="relative">
                <Image
                  src={Choice4}
                  alt="Access quality and organic data"
                  className="md:w-7/12"
                />
                <Image
                  src={overlay}
                  alt="Access quality and organic data"
                  className="absolute -right-16 top-28 z-10 w-[65%] md:right-10 md:w-[50%]"
                />
              </figure>
            </div>
          </div>
        </div>
      </section> */}

      {/* ####################################### */}
      {/* -- CTA 1 Section */}
      {/* ####################################### */}
      {/* <section className="bg-[#3365E305] py-16">
        <div className="wrapper lg:grid lg:grid-cols-2 lg:grid-rows-[420px] lg:items-center lg:gap-8">
          <div className="mb-16 lg:mb-0">
            <div className="mb-6 inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Category2 size={20} color="currentColor" variant="Bold" />
              </span>{" "}
              Goloka for organization
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-snug">
              Unlock <span className="text-main-100">Valuable Insights</span>{" "}
              with Goloka’s Data-Driven Solutions
            </h2>
            <p className="text-[#434343] md:text-balance">
              A user-friendly interface that makes it easy for companies to
              manage data collection projects and collaborate with data
              contributors.
            </p>
            <Button className="mt-6 h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-700 md:w-auto">
              Get started with localised data
            </Button>
          </div>
          <div className="h-[450px] overflow-hidden rounded-3xl bg-[#3365E30A] p-8 lg:h-full">
            <Image
              src={cta1}
              alt="cta"
              className="origin-top-left scale-[2.5] md:scale-100 lg:scale-[1.8]"
            />
          </div>
        </div>
      </section> */}

      {/* ####################################### */}
      {/* -- Blog Section */}
      {/* ####################################### */}
      <section className="space-y-16 bg-[#FBFCFE] lg:pb-0">
        <div className="wrapper">
          <div className="mb-9 md:mx-auto md:mb-0 lg:w-10/12 xl:w-7/12">
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-[2rem]">
              Case Study
            </h2>
            <p className="mt-4 text-center leading-7 text-[#434343] md:text-balance">
              How we serve several industry partners to generate Hyperlocal Data
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {blogData.map((post) => (
              <BlogCard key={post.id} data={post} />
            ))}
          </div>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- CALL TO ACTION Section */}
      {/* ####################################### */}
      <section className="wrapper py-10">
        <div className="relative rounded-3xl bg-[radial-gradient(135.58%_135.58%_at_50%_35.83%,#3365E3_0%,#1C387D_100%)] px-4 py-10 md:py-16">
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-semibold text-white md:text-balance md:text-[2rem] md:leading-normal lg:text-5xl lg:leading-normal">
              Solve your business problems <br /> with accurate data
            </h2>
            <p className="mt-4 text-white lg:text-balance">
              We guarantee improved data accuracy and verification with Goloka’s
              cutting-edge geospatial <br /> technology. The in-built wallet
              system, ensures you can seamlessly manage your data <br />
              collection project. Everything is streamlined for your
              <br /> convenience, from the launch of your project to the payment
              of data collectors.
            </p>
            <div>
              <Link href="/signin">
                <Button className="mt-6 h-auto w-full rounded-full bg-white py-3.5 text-main-100 hover:bg-white md:w-auto">
                  Get started with Goloka
                </Button>
              </Link>
            </div>
          </div>

          {/* Pattern */}
          <Image
            src={Pattern}
            alt="BgPattern"
            className="absolute left-0 top-0 z-[1] h-full w-full object-cover object-center opacity-20 brightness-0 invert filter"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

interface Benefit {
  title: string;
  description: string;
}

// Array of benefits
const benefitsData: Benefit[] = [
  {
    title: "Market expansion",
    description:
      "With Goloka, businesses and organinzations can break linguistic and cultural boundaries, which allows them to blend in and then stand out.",
  },
  {
    title: "Sales Growth ",
    description:
      "We businesses and organisations communicate with customers in their own language and create mutual understanding. This helps build customer trust and commitment.",
  },
  {
    title: "Customer Satisfaction",
    description:
      "With Goloka, brands can create appealing user experiences for diversified target customers. It is a way to show your customers that you care and truly understand what they need",
  },
  {
    title: "Visualising Impact",
    description:
      "Use data visualization techniques such as charts, graphs, and infographics in an easily understandable format for stakeholder engagement including donors, partners, beneficiaries, and the community",
  },
  {
    title: "Outlook on Trends",
    description:
      "Identify trends, and apply these insights to future strategies, ensuring ongoing success and growth",
  },
  {
    title: "Iterate and Improve",
    description:
      "Use insights gained from analyzing campaign metrics to iterate, inform and improve future marketing strategies",
  },
];

const stats = [
  {
    value: 20000,
    showK: true,
    title: "Contributors",
    description:
      "Our growing community of data contributors are driven by the passion to contribute to important research projects that have real-world impact.",
    bgColor: "bg-[#F3F3F3]",
    titleColor: "text-black",
    numberColor: "text-black",
    descriptionColor: "text-[#333]",
  },
  {
    value: 20,
    showK: false,
    title: "Organisations",
    description:
      "Organisations and businesses leverage Goloka's powerful features, powered by advanced AI algorithms, to make data-driven decisions that optimise performance, reduce losses, and increase revenue.",
    bgColor: "bg-[#004378]",
    titleColor: "text-white",
    numberColor: "text-white",
    descriptionColor: "text-white",
  },
  {
    value: 20,
    showK: false,
    title: "Campaigns",
    description:
      "Campaigns launched on Goloka harness geospatial technology, integrating surveys, remote sensing technology, native intelligence, and AI to collect, analyse, and verify data for accurate location-based insights.",
    bgColor: "bg-[#2F80ED]",
    titleColor: "text-white",
    numberColor: "text-white",
    descriptionColor: "text-white",
  },
];
