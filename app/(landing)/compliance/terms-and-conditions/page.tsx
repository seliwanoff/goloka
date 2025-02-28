"use client";
import BackToHomeButton from "@/components/landing-comps/blog-comps/customBlogButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsOfUse() {
  const router = useRouter();

  const sections = [
    "OUR SERVICES",
    "INTELLECTUAL PROPERTY RIGHTS",
    "USER REPRESENTATIONS",
    "PROHIBITED ACTIVITIES",
    "USER GENERATED CONTRIBUTIONS",
    "CONTRIBUTION LICENSE",
    "SERVICES MANAGEMENT",
    "TERM AND TERMINATION",
    "MODIFICATIONS AND INTERRUPTIONS",
    "GOVERNING LAW",
    "DISPUTE RESOLUTION",
    "CORRECTIONS",
    "DISCLAIMER",
    "LIMITATIONS OF LIABILITY",
    "INDEMNIFICATION",
    "USER DATA",
    "ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES",
    "MISCELLANEOUS",
    "CONTACT US",
  ];

    return (
      <>
        <BackToHomeButton />
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Terms of Use
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h2 className="mb-4 text-xl font-semibold">
                  AGREEMENT TO OUR LEGAL TERMS
                </h2>
                <p className="mb-4 text-gray-700">
                  We are Goloka Analytics (&quot;Company,&quot; &quot;we,&quot;
                  &quot;us,&quot; &quot;our&quot;). You can contact us by email
                  or by mail to{" "}
                  <a href="mailto:hello@goloka.io" className="hover:underline">
                    hello@goloka.io
                  </a>
                  . These Legal Terms constitute a legally binding agreement
                  made between you, whether personally or on behalf of an entity
                  (&quot;you&quot;), and Goloka Analytics, concerning your
                  access to and use of the Services.
                </p>

                <div className="space-y-8">
                  <div className="mb-8">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                      Table of Contents
                    </h2>
                    <ul className="list-inside list-decimal space-y-2 text-gray-600">
                      {sections.map((title, index) => (
                        <li
                          key={index}
                          className="cursor-pointer hover:text-indigo-600"
                        >
                          <a href={`#section-${index + 1}`}>
                         {title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <section id="section-1">
                    <h2 className="mb-4 text-xl font-semibold">
                      1. OUR SERVICES
                    </h2>
                    <p className="text-gray-700">
                      The information provided when using the Services is not
                      intended for distribution to or use by any person or
                      entity in any jurisdiction or country where such
                      distribution or use would be contrary to law or regulation
                      or which would subject us to any registration requirement
                      within such jurisdiction or country. Accordingly, those
                      persons who choose to access the Services from other
                      locations do so on their own initiative and are solely
                      responsible for compliance with local laws, if and to the
                      extent local laws are applicable.
                    </p>
                  </section>

                  <section id="section-2">
                    <h2 className="mb-4 text-xl font-semibold">
                      2. INTELLECTUAL PROPERTY RIGHTS
                    </h2>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Our intellectual property
                      </h3>
                      <p className="text-gray-700">
                        We are the owner or the licensee of all intellectual
                        property rights in our Services, including all source
                        code, databases, functionality, software, website
                        designs, audio, video, text, photographs, and graphics
                        in the Services (collectively, the &quot;Content&quot;),
                        as well as the trademarks, service marks, and logos
                        contained therein (the &quot;Marks&quot;).
                      </p>
                      <h3 className="text-lg font-medium">
                        Your use of our Services
                      </h3>
                      <p className="text-gray-700">
                        Subject to your compliance with these Legal Terms,
                        including the &quot;PROHIBITED ACTIVITIES&quot; section
                        below, we grant you a non-exclusive, non-transferable,
                        revocable license to access the Services and download or
                        print a copy of any portion of the Content to which you
                        have properly gained access, solely for your personal,
                        non-commercial use or internal business purpose.
                      </p>
                    </div>
                  </section>

                  <section id="section-3">
                    <h2 className="mb-4 text-xl font-semibold">
                      3. USER REPRESENTATIONS
                    </h2>
                    <p className="text-gray-700">
                      By using the Services, you represent and warrant that: (1)
                      you have the legal capacity and you agree to comply with
                      these Legal Terms; (2) you are not a minor in the
                      jurisdiction in which you reside; (3) you will not access
                      the Services through automated or non-human means; (4) you
                      will not use the Services for any illegal or unauthorized
                      purpose; and (5) your use of the Services will not violate
                      any applicable law or regulation.
                    </p>
                  </section>

                  <section id="section-4">
                    <h2 className="mb-4 text-xl font-semibold">
                      4. PROHIBITED ACTIVITIES
                    </h2>
                    <p className="mb-4 text-gray-700">
                      You may not access or use the Services for any purpose
                      other than that for which we make the Services available.
                      The Services may not be used in connection with any
                      commercial endeavors except those that are specifically
                      endorsed or approved by us.
                    </p>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="mb-2 text-lg font-medium">
                        As a user of the Services, you agree not to:
                      </h3>
                      <ul className="list-inside list-disc space-y-2 text-gray-700">
                        <li>
                          Systematically retrieve data or other content from the
                          Services to create or compile, directly or indirectly,
                          a collection, compilation, database, or directory
                          without written permission from us.
                        </li>
                        <li>
                          Trick, defraud, or mislead us and other users,
                          especially in any attempt to learn sensitive account
                          information such as user passwords.
                        </li>
                        <li>
                          Circumvent, disable, or otherwise interfere with
                          security-related features of the Services.
                        </li>
                        <li>
                          Disparage, tarnish, or otherwise harm, in our opinion,
                          us and/or the Services.
                        </li>
                        <li>
                          Use any information obtained from the Services in
                          order to harass, abuse, or harm another person.
                        </li>
                        <li>
                          Make improper use of our support services or submit
                          false reports of abuse or misconduct.
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section id="section-5">
                    <h2 className="mb-4 text-xl font-semibold">
                      5. USER GENERATED CONTRIBUTIONS
                    </h2>
                    <p className="text-gray-700">
                      The Services does not offer users to submit or post
                      content. We may provide you with the opportunity to
                      create, submit, post, display, transmit, perform, publish,
                      distribute, or broadcast content and materials to us or on
                      the Services, including but not limited to text, writings,
                      video, audio, photographs, graphics, comments,
                      suggestions, or personal information or other material
                      (collectively, &quot;Contributions&quot;).
                    </p>
                  </section>

                  <section id="section-6">
                    <h2 className="mb-4 text-xl font-semibold">
                      6. CONTRIBUTION LICENSE
                    </h2>
                    <p className="text-gray-700">
                      You and Services agree that we may access, store, process,
                      and use any information and personal data that you provide
                      and your choices (including settings). By submitting
                      suggestions or other feedback regarding the Services, you
                      agree that we can use and share such feedback for any
                      purpose without compensation to you.
                    </p>
                  </section>

                  <section id="section-7">
                    <h2 className="mb-4 text-xl font-semibold">
                      7. SERVICES MANAGEMENT
                    </h2>
                    <p className="text-gray-700">
                      We reserve the right, but not the obligation, to: (1)
                      monitor the Services for violations of these Legal Terms;
                      (2) take appropriate legal action against anyone who
                      violates the law or these Legal Terms; (3) refuse,
                      restrict access to, limit the availability of, or disable
                      any of your Contributions or any portion thereof; (4)
                      remove from the Services or otherwise disable all files
                      and content that are excessive in size or burdensome to
                      our systems; and (5) otherwise manage the Services in a
                      manner designed to protect our rights and property and to
                      facilitate the proper functioning of the Services.
                    </p>
                  </section>

                  <section id="section-8">
                    <h2 className="mb-4 text-xl font-semibold">
                      8. TERM AND TERMINATION
                    </h2>
                    <p className="text-gray-700">
                      These Legal Terms shall remain in full force and effect
                      while you use the Services. We reserve the right to, in
                      our sole discretion and without notice or liability, deny
                      access to and use of the Services to any person for any
                      reason or for no reason. We may terminate your use or
                      participation in the Services or delete any content or
                      information that you posted at any time, without warning,
                      in our sole discretion.
                    </p>
                  </section>

                  <section id="section-9">
                    <h2 className="mb-4 text-xl font-semibold">
                      9. MODIFICATIONS AND INTERRUPTIONS
                    </h2>
                    <p className="text-gray-700">
                      We reserve the right to change, modify, or remove the
                      contents of the Services at any time or for any reason at
                      our sole discretion without notice. We cannot guarantee
                      the Services will be available at all times. We may
                      experience hardware, software, or other problems or need
                      to perform maintenance related to the Services, resulting
                      in interruptions, delays, or errors.
                    </p>
                  </section>

                  <section id="section-10">
                    <h2 className="mb-4 text-xl font-semibold">
                      10. GOVERNING LAW
                    </h2>
                    <p className="text-gray-700">
                      These Legal Terms shall be governed by and defined
                      following the laws of [Jurisdiction]. You irrevocably
                      consent that the courts of [Jurisdiction] shall have
                      exclusive jurisdiction to resolve any dispute which may
                      arise in connection with these Legal Terms.
                    </p>
                  </section>

                  <section id="section-11">
                    <h2 className="mb-4 text-xl font-semibold">
                      11. DISPUTE RESOLUTION
                    </h2>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Informal Negotiations
                      </h3>
                      <p className="text-gray-700">
                        To expedite resolution and control the cost of any
                        dispute, controversy, or claim related to these Legal
                        Terms, the Parties agree to first attempt to negotiate
                        any Dispute informally for at least [number] days before
                        initiating arbitration.
                      </p>
                      <h3 className="text-lg font-medium">
                        Binding Arbitration
                      </h3>
                      <p className="text-gray-700">
                        Any dispute arising out of or in connection with these
                        Legal Terms shall be referred to and finally resolved by
                        the International Commercial Arbitration Court under the
                        European Arbitration Chamber according to the Rules of
                        this ICAC.
                      </p>
                    </div>
                  </section>

                  <section id="section-12">
                    <h2 className="mb-4 text-xl font-semibold">
                      12. CORRECTIONS
                    </h2>
                    <p className="text-gray-700">
                      There may be information on the Services that contains
                      typographical errors, inaccuracies, or omissions. We
                      reserve the right to correct any errors, inaccuracies, or
                      omissions and to change or update the information on the
                      Services at any time, without prior notice.
                    </p>
                  </section>

                  <section id="section-13">
                    <h2 className="mb-4 text-xl font-semibold">
                      13. DISCLAIMER
                    </h2>
                    <p className="uppercase text-gray-700">
                      THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE
                      BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT
                      YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE
                      DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION
                      WITH THE SERVICES AND YOUR USE THEREOF.
                    </p>
                  </section>

                  <section id="section-14">
                    <h2 className="mb-4 text-xl font-semibold">
                      14. LIMITATIONS OF LIABILITY
                    </h2>
                    <p className="text-gray-700">
                      IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS
                      BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT,
                      INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
                      OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE,
                      LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF
                      THE SERVICES.
                    </p>
                  </section>

                  <section id="section-15">
                    <h2 className="mb-4 text-xl font-semibold">
                      15. INDEMNIFICATION
                    </h2>
                    <p className="text-gray-700">
                      You agree to defend, indemnify, and hold us harmless,
                      including our subsidiaries, affiliates, and all of our
                      respective officers, agents, partners, and employees, from
                      and against any loss, damage, liability, claim, or demand,
                      including reasonable attorneys&apos; fees and expenses.
                    </p>
                  </section>

                  <section id="section-16">
                    <h2 className="mb-4 text-xl font-semibold">
                      16. USER DATA
                    </h2>
                    <p className="text-gray-700">
                      We will maintain certain data that you transmit to the
                      Services for the purpose of managing the performance of
                      the Services, as well as data relating to your use of the
                      Services. Although we perform regular routine backups of
                      data, you are solely responsible for all data that you
                      transmit or that relates to any activity you have
                      undertaken using the Services.
                    </p>
                  </section>

                  <section id="section-17">
                    <h2 className="mb-4 text-xl font-semibold">
                      17. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND
                      SIGNATURES
                    </h2>
                    <p className="text-gray-700">
                      Visiting the Services, sending us emails, and completing
                      online forms constitute electronic communications. You
                      consent to receive electronic communications, and you
                      agree that all agreements, notices, disclosures, and other
                      communications we provide to you electronically satisfy
                      any legal requirement that such communication be in
                      writing.
                    </p>
                  </section>

                  <section id="section-18">
                    <h2 className="mb-4 text-xl font-semibold">
                      18. MISCELLANEOUS
                    </h2>
                    <p className="text-gray-700">
                      These Legal Terms and any policies or operating rules
                      posted by us on the Services constitute the entire
                      agreement and understanding between you and us. Our
                      failure to exercise or enforce any right or provision of
                      these Legal Terms shall not operate as a waiver of such
                      right or provision.
                    </p>
                  </section>

                  <section id="section-19">
                    <h2 className="mb-4 text-xl font-semibold">
                      19. CONTACT US
                    </h2>
                    <p className="mb-4 text-gray-700">
                      In order to resolve a complaint regarding the Services or
                      to receive further information regarding use of the
                      Services, please contact us at:
                    </p>
                    <address className="not-italic text-gray-700">
                      Goloka Analytics
                      <br />
                      [Street Address]
                      <br />
                      [City, State ZIP]
                      <br />
                      [Email]
                    </address>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
