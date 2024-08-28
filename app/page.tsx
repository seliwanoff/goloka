"use client";
import Hero from "@/components/landing-comps/Hero";
import { Button } from "@/components/ui/button";
import GoogleImg from "@/public/assets/google.svg";
import MetaImg from "@/public/assets/meta.svg";
import Star from "@/public/assets/images/star-shade.svg";
import Image from "next/image";
import Pattern from "@/public/assets/pattern-bg.svg";
import Choice1 from "@/public/assets/images/choice1.png";
import Choice2 from "@/public/assets/images/choice2.png";
import Choice3 from "@/public/assets/images/choice3.png";
import Choice4 from "@/public/assets/images/choice4.png";
import overlay from "@/public/assets/images/choice4-alt.png";
import Topographic from "@/public/assets/images/Topographic.svg";
import Thumb from "@/public/assets/images/thumb.svg";
import AppleStore from "@/public/assets/images/App Store.png";
import PlayStore from "@/public/assets/images/Play Store.png";
import AppPreview from "@/public/assets/images/download-app.png";
import Agric from "@/public/assets/images/tasks/task1.png";
import cta1 from "@/public/assets/images/mac.png";
import cta2 from "@/public/assets/images/share-thought-cta.png";
import FinIcon from "@/public/assets/images/finance-icon.png";
import userResp from "@/public/assets/images/user-response.jpg";
import { ArrowRight, Category2, Location } from "iconsax-react";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { TiArrowRight } from "react-icons/ti";
import Testimonials from "@/components/landing-comps/testimonials";
import Marquee from "@/components/ui/marquee";
import Footer from "@/components/landing-comps/footer";

const page = () => {
  return (
    <div>
      {/* ####################################### */}
      {/* -- Hero Section */}
      {/* ####################################### */}
      <Hero />
      {/* ####################################### */}
      {/* -- Partners Section */}
      {/* ####################################### */}
      <section className="px-4 py-8">
        <div className="container mx-auto space-y-6 bg-[#F8F8F8] px-4 py-3">
          <p className="text-center text-base text-[#071E3B]">
            Over 200 companies growing with Goloka
          </p>
          <Marquee pauseOnHover className="relative mt-10 [--duration:40s]">
            <div className="grid grid-cols-5 gap-5">
              <Image src={GoogleImg} alt="google logo" />
              <Image src={MetaImg} alt="meta logo" />
              <Image src={GoogleImg} alt="google logo" />
              <Image src={GoogleImg} alt="google logo" />
              <Image src={GoogleImg} alt="google logo" />
            </div>
          </Marquee>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- Choices Section */}
      {/* ####################################### */}
      <section className="py-10">
        <div className="wrapper">
          <div className="mb-16 flex flex-col items-center gap-6 md:mx-auto lg:w-10/12">
            <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Image src={Star} alt="star icon" />
              </span>{" "}
              Your best choice is here
            </div>
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-normal">
              Data generating platforms that serves organisation and
              contributors
            </h2>
          </div>

          {/* BENTO GRID */}
          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-5 md:space-y-0 lg:grid-cols-6 lg:grid-rows-[400px_1fr] lg:gap-8">
            {/* CARD1 */}
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
            {/* CARD2 */}
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
            {/* CARD3 */}
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
            {/* CARD4 */}
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
      </section>
      {/* ####################################### */}
      {/* -- Stats Section */}
      {/* ####################################### */}
      <section className="py-16">
        <div className="wrapper">
          <div className="mb-16 flex flex-col items-center gap-6">
            <div className="mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Image src={Star} alt="star icon" />
              </span>{" "}
              The fas growing Data World
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:items-end">
            <div className="space-y-9 rounded-3xl bg-[#F3F3F3] p-6 md:col-span-2 xl:col-span-1">
              <h3 className="text-3xl font-extrabold leading-[40px]">
                10k+
                <br />
                <span className="font-medium">Organizations</span>
              </h3>
              <p className="text-[#333]">
                Lorem ipsum dolor sit amet consectetur. Neque enim dignissim vel
                faucibus leo nibh sem at sit orci.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-[#004378] p-6 xl:h-[400px]">
              <div className="relative z-10 h-full space-y-9 xl:flex xl:flex-col xl:justify-between">
                <h3 className="text-3xl font-extrabold leading-[40px] text-white">
                  25k+
                  <br />
                  <span className="font-normal">Contributors</span>
                </h3>
                <p className="text-[#fff]">
                  Lorem ipsum dolor sit amet consectetur. Accumsan ac porttitor
                  sit sit eget congue. Luctus gravida adipiscing netus tellus
                  posuere et.
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
                Lorem ipsum dolor sit amet consectetur. Tincidunt ut lectus
                neque risus cras leo id. Purus quis.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- CTA 1 Section */}
      {/* ####################################### */}
      <section className="bg-[#3365E305] py-16">
        <div className="wrapper lg:grid lg:grid-cols-2 lg:grid-rows-[420px] lg:items-center lg:gap-8">
          <div className="mb-16 lg:mb-0">
            <div className="mb-6 inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
              <span>
                <Category2 size="20" variant="Bold" />
              </span>{" "}
              Goloka for organization
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-snug">
              Unlock <span className="text-main-100">Valuable Insights</span>{" "}
              with Goloka’s Data-Driven Solutions
            </h2>
            <p className="text-[#434343] md:text-balance">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              habitant dui consectetur sed nam amet, magna. Iet se
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
      </section>
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
              The world of localised and organic data
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-snug lg:leading-relaxed">
              Share Your Thoughts and&nbsp;
              <span className="text-main-100">Earn Cash Today!</span>
            </h2>
            <p className="text-[#434343] md:text-balance">
              Our product provides real-time, highly-localised, spatial-enriched
              insights and analytics to empower businesses,
            </p>
            <Button className="mt-6 h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-700 md:w-auto">
              Start earning in 2 minutes
            </Button>
          </div>
          <div className="relative lg:col-[1/2] lg:row-[1]">
            <div className="h-[450px] overflow-hidden rounded-3xl bg-[#3365E30A] p-8">
              <Image
                src={cta2}
                alt="cta"
                className="origin-top-left scale-[1] md:mx-auto md:w-8/12 lg:w-10/12"
              />
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
              Key benefits of Goloka
            </div>
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-normal">
              Data generating platforms that serves organisation and
              contributors
            </h2>
          </div>

          <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_: any, i: number) => (
              <div className="border border-[#F2F2F2] bg-[#FCFCFC] p-4" key={i}>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-main-100 bg-opacity-5">
                  <Image src={Thumb} alt="Thumb" />
                </span>
                <h3 className="mb-4 mt-8 text-lg font-medium text-[#333]">
                  Benefit heading goes here
                </h3>
                <p className="text-sm leading-6 text-[#333]">
                  Lorem ipsum dolor sit amet consectetur. At tortor morbi at
                  enim augue duis enim nunc. Mi magna lobortis id gravida sem
                  faucibus. Tortor diam nibh semper a at. Massa cursus volutpat
                  accumsan amet lacinia vulputate turpis porta malesuada. Dolor
                  laoreet.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- Download app Section */}
      {/* ####################################### */}
      <section className="relative bg-main-100 py-16">
        <div className="wrapper lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-center xl:grid-cols-[2fr_1.5fr]">
          <div>
            <h2 className="z-40 mb-4 text-[2rem] font-semibold leading-[42px] text-white md:text-balance md:text-center md:text-[2rem] md:leading-[1.4] lg:text-pretty lg:text-left lg:text-4xl lg:leading-normal xl:text-5xl xl:leading-normal">
              Get effortless earning <br /> experience on GoloKa Mobile
            </h2>
            <p className="z-40 text-base leading-7 text-white md:text-balance md:text-center md:text-lg lg:text-left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />{" "}
              Nunc integer sit nascetur.
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
      <section className="py-16">
        <div className="wrapper">
          <div className="mb-10 sm:flex sm:flex-col sm:items-center md:mx-auto lg:w-10/12 xl:w-7/12">
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-[2rem]">
              Trending on Goloka🔥
            </h2>
            <p className="mb-6 mt-4 text-center leading-7 text-[#434343] md:text-balance">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              habitant dui consectetur sed nam amet, magna. Iet se
            </p>
            <Button className="h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-700 sm:w-auto">
              Start earning in 2 minutes
            </Button>
          </div>
        </div>
        <div className="no-scrollbar wrapper md:w-full md:overflow-x-auto">
          <div className="grid gap-6 md:flex md:w-max lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }, (_: any, i: number) => (
              <div className="rounded-2xl hover:shadow-md md:w-[380px]" key={i}>
                <AspectRatio
                  ratio={3 / 1}
                  className="overflow-hidden rounded-lg"
                >
                  <Image
                    src={Agric}
                    alt="Agricultural"
                    className="h-full w-full object-cover"
                    fill
                  />
                </AspectRatio>
                <div className="mb-4 mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 rounded-full bg-[#F8F8F8] p-2 pr-5">
                    <p className="text-[#333333]">
                      24 <span className="text-[#828282]">of 64 responses</span>
                    </p>
                  </div>
                  <span className="font-semibold text-[#333333]">$15</span>
                </div>
                <h3 className="mb-3.5 mt-4 text-xl font-semibold text-[#333]">
                  Agricultural & Food Security
                </h3>
                <p className="text-ellipsis leading-6 text-[#333]">
                  Agriculture is the cornerstone of food security, serving as
                  the primary means of sustenance and
                </p>
                <div className="mt-3 flex gap-3">
                  <span className="text-[#4F4F4F]">
                    <Location size="24" />
                  </span>
                  <p className="text-[#4F4F4F]">
                    Lagos, Kwara, Abuja, Kogi, Kano
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ####################################### */}
      {/* -- Blog Section */}
      {/* ####################################### */}
      <section className="bg-[#3365E305] py-16 lg:pb-0">
        <div className="wrapper">
          <div className="mb-9 md:mx-auto md:mb-0 lg:w-10/12 xl:w-7/12">
            <h2 className="text-center text-2xl font-semibold text-[#333] md:text-[2rem]">
              Explore news from <span className="text-main-100">Goloka</span>
            </h2>
            <p className="mt-4 text-center leading-7 text-[#434343] md:text-balance">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
              habitant dui consectetur sed nam amet, magna. Iet se
            </p>
          </div>
        </div>
        <div className="no-scrollbar wrapper md:w-full md:overflow-x-auto md:py-16">
          <div className="grid gap-6 md:flex md:w-max lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }, (_: any, i: number) => (
              <div
                className="rounded-2xl bg-white p-4 shadow-[0px_0px_64.8px_0px_rgba(8,_0,_81,_0.08)] md:w-[380px]"
                key={i}
              >
                <AspectRatio
                  ratio={3 / 2}
                  className="overflow-hidden rounded-lg"
                >
                  <Image src={Agric} alt="Agricultural" fill />
                </AspectRatio>
                <h3 className="mb-3.5 mt-4 text-xl font-semibold text-[#333]">
                  Agricultural & Food Security
                </h3>
                <p className="mb-6 leading-6 text-[#333]">
                  Lorem ipsum dolor sit amet consectetur. Sed et in massa sit
                  vestibulum sit dignissim suspendisse nam. Mi ut donec tellus
                  at. Laoreet faucibus ac sed sit sem. Amet nibh dignissim nunc
                  tempor.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm text-main-100"
                >
                  <span>Learn more</span>
                  <span>
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
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
              Drive Business Success and Earn Rewards Together
            </h2>
            <p className="mt-4 text-white lg:text-balance">
              Lorem ipsum dolor sit amet consectetur. Bibendum neque a mauris id
              integer neque nisi. Sem eros sit odio suspendisse. In ultricies
              neque vitae integer q
            </p>
            <Button className="mt-6 h-auto w-full rounded-full bg-white py-3.5 text-main-100 hover:bg-white md:w-auto">
              Get started with Goloka
            </Button>
          </div>

          {/* Pattern */}
          <Image
            src={Pattern}
            alt="BgPattern"
            className="absolute left-0 top-0 z-[1] h-full w-full object-cover object-center opacity-20 brightness-0 invert filter"
          />
        </div>
      </section>
      {/* ####################################### */}
      {/* -- Testimonials Section */}
      {/* ####################################### */}
      <Testimonials />
      <Footer />
    </div>
  );
};

export default page;
