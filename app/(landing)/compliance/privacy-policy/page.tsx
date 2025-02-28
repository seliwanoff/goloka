/* eslint-disable react/no-unescaped-entities */
import BackToHomeButton from "@/components/landing-comps/blog-comps/customBlogButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <>
      <BackToHomeButton />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 mt-10">


                  <div className="rounded-lg bg-white p-8 shadow-sm">
                      <div>

            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              PRIVACY POLICY
            </h1>
            <p className="mb-8 text-gray-600">Last updated April 01, 2023</p>
                      </div>

            <div className="prose max-w-none text-gray-700">
              <p className="mb-6">
                This privacy notice for Goloka Analytics Ltd ('Company', 'we',
                'us', or 'our'), describes how and why we might collect, store,
                use, and/or share ('process') your information when you use our
                services ('Services'), such as when you:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li className="mb-2">
                  Visit our website at http://www.goloka.io, or any website of
                  ours that links to this privacy notice
                </li>
                <li className="mb-2">
                  Download and use our mobile application (Goloka Analytics), or
                  any other application of ours that links to this privacy
                  notice
                </li>
                <li className="mb-2">
                  Engage with us in other related ways, including any sales,
                  marketing, or events
                </li>
              </ul>

              <p className="mb-6">
                Questions or concerns? Reading this privacy notice will help you
                understand your privacy rights and choices. If you do not agree
                with our policies and practices, please do not use our Services.
                If you still have any questions or concerns, please contact us
                at hello@goloka.io.
              </p>

              <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
                SUMMARY OF KEY POINTS
              </h2>
              <p className="mb-6">
                This summary provides key points from our privacy notice, but
                you can find out more details about any of these topics by
                clicking the link following each key point or by using our table
                of contents below to find the section you are looking for.
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li className="mb-2">
                  <strong>What personal information do we process?</strong> When
                  you visit, use, or navigate our Services, we may process
                  personal information depending on how you interact with Goloka
                  Analytics Ltd and the Services, your choices, and the products
                  and features you use.
                </li>
                <li className="mb-2">
                  <strong>
                    Do we process any sensitive personal information?
                  </strong>{" "}
                  We may process sensitive personal information when necessary
                  with your consent or as otherwise permitted by applicable law.
                </li>
                <li className="mb-2">
                  <strong>
                    Do we receive any information from third parties?
                  </strong>{" "}
                  We may receive information from public databases, marketing
                  partners, social media platforms, and other outside sources.
                </li>
                <li className="mb-2">
                  <strong>How do we process your information?</strong> We
                  process your information to provide, improve, and administer
                  our Services, communicate with you, for security and fraud
                  prevention, and to comply with law.
                </li>
                <li className="mb-2">
                  <strong>
                    In what situations and with which parties do we share
                    personal information?
                  </strong>{" "}
                  We may share information in specific situations and with
                  specific third parties.
                </li>
                <li className="mb-2">
                  <strong>How do we keep your information safe?</strong> We have
                  organizational and technical processes and procedures in place
                  to protect your personal information.
                </li>
                <li className="mb-2">
                  <strong>What are your rights?</strong> Depending on where you
                  are located geographically, the applicable privacy law may
                  mean you have certain rights regarding your personal
                  information.
                </li>
              </ul>

              <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>

              <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                Personal information you disclose to us
              </h3>
              <p className="mb-4">
                <em>
                  In Short: We collect personal information that you provide to
                  us.
                </em>
              </p>

              <p className="mb-4">
                We collect personal information that you voluntarily provide to
                us when you register on the Services, express an interest in
                obtaining information about us or our products and Services,
                when you participate in activities on the Services, or otherwise
                when you contact us.
              </p>

              <p className="mb-4">
                <strong>Personal Information Provided by You.</strong> The
                personal information that we collect depends on the context of
                your interactions with us and the Services, the choices you
                make, and the products and features you use. The personal
                information we collect may include the following:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li>names</li>
                <li>phone numbers</li>
                <li>email addresses</li>
                <li>mailing addresses</li>
                <li>job titles</li>
                <li>usernames</li>
                <li>passwords</li>
                <li>contact preferences</li>
                <li>contact or authentication data</li>
                <li>billing addresses</li>
                <li>debit/credit card numbers</li>
              </ul>

              <p className="mb-4">
                <strong>Sensitive Information.</strong> When necessary, with
                your consent or as otherwise permitted by applicable law, we
                process the following categories of sensitive information:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li>health data</li>
                <li>information revealing political opinions</li>
                <li>information revealing race or ethnic origin</li>
                <li>
                  information revealing religious or philosophical beliefs
                </li>
                <li>information revealing trade union membership</li>
                <li>credit worthiness data</li>
                <li>student data</li>
                <li>social security numbers or other government identifiers</li>
                <li>biometric data</li>
                <li>data about a person's sex life or sexual orientation</li>
                <li>genetic data</li>
                <li>financial data</li>
              </ul>

              <p className="mb-4">
                <strong>Payment Data.</strong> We may collect data necessary to
                process your payment if you make purchases, such as your payment
                instrument number and the security code associated with your
                payment instrument. All payment data is stored by Stripe,
                Paystack, PayPal and QuickBooks Payments. You may find their
                privacy notice link(s) here:
              </p>

              <ul className="mb-6 flex list-disc flex-col pl-6">
                <Link
                  className="text-main-100 hover:underline"
                  href={"http://www.stripe.com/privacy"}
                >
                  http://www.stripe.com/privacy
                </Link>
                <Link
                  className="text-main-100 hover:underline"
                  href={"https://paystack.com/terms"}
                >
                  https://paystack.com/terms
                </Link>
                <Link
                  className="text-main-100 hover:underline"
                  href={
                    "https://www.paypal.com/us/webapps/mpp/ua/privacy-full#personalData"
                  }
                >
                  https://www.paypal.com/us/webapps/mpp/ua/privacy-full#personalData
                </Link>
                <Link
                  className="text-main-100 hover:underline"
                  href={"https://www.intuit.com/privacy/statement/"}
                >
                  https://www.intuit.com/privacy/statement/
                </Link>
              </ul>

              <p className="mb-4">
                <strong>Social Media Login Data.</strong> We may provide you
                with the option to register with us using your existing social
                media account details. If you choose to register in this way, we
                will collect the information described in the section called
                'HOW DO WE HANDLE YOUR SOCIAL LOGINS?' below.
              </p>

              <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                Application Data
              </h3>
              <p className="mb-4">
                If you use our application(s), we also may collect the following
                information if you choose to provide us with access or
                permission:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li className="mb-2">
                  <strong>Geolocation Information.</strong> We may request
                  access or permission to track location-based information from
                  your mobile device, either continuously or while you are using
                  our mobile application(s).
                </li>
                <li className="mb-2">
                  <strong>Mobile Device Access.</strong> We may request access
                  or permission to certain features from your mobile device,
                  including your mobile device's bluetooth, calendar, camera,
                  microphone, sensors, sms messages, social media accounts,
                  storage, contacts, and other features.
                </li>
                <li className="mb-2">
                  <strong>Push Notifications.</strong> We may request to send
                  you push notifications regarding your account or certain
                  features of the application(s).
                </li>
              </ul>

              <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
                Information automatically collected
              </h3>
              <p className="mb-4">
                <em>
                  In Short: Some information — such as your Internet Protocol
                  (IP) address and/or browser and device characteristics — is
                  collected automatically when you visit our Services.
                </em>
              </p>

              <p className="mb-4">
                We automatically collect certain information when you visit,
                use, or navigate the Services. This information does not reveal
                your specific identity but may include:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li className="mb-2">Device and usage information</li>
                <li className="mb-2">IP address</li>
                <li className="mb-2">Browser and device characteristics</li>
                <li className="mb-2">Operating system</li>
                <li className="mb-2">Language preferences</li>
                <li className="mb-2">Referring URLs</li>
                <li className="mb-2">Device name</li>
                <li className="mb-2">Country</li>
                <li className="mb-2">Location</li>
                <li className="mb-2">
                  Information about how and when you use our Services
                </li>
              </ul>

              <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
                2. HOW DO WE PROCESS YOUR INFORMATION?
              </h2>
              <p className="mb-4">
                <em>
                  In Short: We process your information to provide, improve, and
                  administer our Services, communicate with you, for security
                  and fraud prevention, and to comply with law.
                </em>
              </p>

              <p className="mb-4">
                We process your personal information for a variety of reasons,
                depending on how you interact with our Services, including:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li className="mb-2">
                  To facilitate account creation and authentication
                </li>
                <li className="mb-2">
                  To deliver and facilitate delivery of services
                </li>
                <li className="mb-2">
                  To respond to user inquiries/offer support
                </li>
                <li className="mb-2">To send administrative information</li>
                <li className="mb-2">To fulfill and manage your orders</li>
                <li className="mb-2">To enable user-to-user communications</li>
                <li className="mb-2">To request feedback</li>
                <li className="mb-2">
                  To send marketing and promotional communications
                </li>
                <li className="mb-2">To deliver targeted advertising</li>
                <li className="mb-2">To protect our Services</li>
                <li className="mb-2">To identify usage trends</li>
                <li className="mb-2">
                  To save or protect an individual's vital interest
                </li>
              </ul>

              <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
              </h2>
              <p className="mb-4">
                <em>
                  In Short: We only process your personal information when we
                  believe it is necessary and we have a valid legal reason to do
                  so under applicable law.
                </em>
              </p>

              <p className="mb-4">
                If you are located in the EU or UK, this section applies to you.
              </p>

              <p className="mb-4">
                The General Data Protection Regulation (GDPR) and UK GDPR
                require us to explain the valid legal bases we rely on in order
                to process your personal information. As such, we may rely on
                the following legal bases to process your personal information:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li className="mb-2">
                  <strong>Consent.</strong> We may process your information if
                  you have given us permission to use your personal information
                  for a specific purpose.
                </li>
                <li className="mb-2">
                  <strong>Performance of a Contract.</strong> We may process
                  your personal information when we believe it is necessary to
                  fulfill our contractual obligations to you.
                </li>
                <li className="mb-2">
                  <strong>Legitimate Interests.</strong> We may process your
                  information when we believe it is reasonably necessary to
                  achieve our legitimate business interests.
                </li>
                <li className="mb-2">
                  <strong>Legal Obligations.</strong> We may process your
                  information where we believe it is necessary for compliance
                  with our legal obligations.
                </li>
                <li className="mb-2">
                  <strong>Vital Interests.</strong> We may process your
                  information where we believe it is necessary to protect your
                  vital interests or the vital interests of a third party.
                </li>
              </ul>

              <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </h2>
              <p className="mb-4">
                <em>
                  In Short: We may share information in specific situations
                  described in this section and/or with the following categories
                  of third parties.
                </em>
              </p>

              <p className="mb-4">
                Vendors, Consultants, and Other Third-Party Service Providers.
                We may share your data with third-party vendors, service
                providers, contractors, or agents ('third parties') who perform
                services for us or on our behalf and require access to such
                information to do that work. The categories of third parties we
                may share personal information with are as follows:
              </p>

              <ul className="mb-6 list-disc pl-6">
                <li>Payment Processors</li>
                <li>User Account Registration & Authentication Services</li>
                <li>Communication & Collaboration Tools</li>
                <li>Data Analytics Services</li>
                <li>Data Storage Service Providers</li>
                <li>Finance & Accounting Tools</li>
                <li>Order Fulfillment Service Providers</li>
                <li>Performance Monitoring Tools</li>
                <li>Product Engineering & Design Tools</li>
                <li>Sales & Marketing Tools</li>
                <li>Website Hosting Service Providers</li>
              </ul>

              <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900">
                5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
              </h2>
              <p className="mb-4">
                <em>
                  In Short: We may use cookies and other tracking technologies
                  to collect and store your information.
                </em>
              </p>

              <p className="mb-6">
                We may use cookies and similar tracking technologies (like web
                beacons and pixels) to access or store information. Specific
                information about how we use such technologies and how you can
                refuse certain cookies is set out in our Cookie Notice.
              </p>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold" id="social-logins">
                  6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                </h2>
                <p className="mb-4">
                  In Short: If you choose to register or log in to our Services
                  using a social media account, we may have access to certain
                  information about you.
                </p>
                <p className="mb-4">
                  Our Services offer you the ability to register and log in
                  using your third-party social media account details (like your
                  Facebook or Twitter logins). Where you choose to do this, we
                  will receive certain profile information about you from your
                  social media provider. The profile information we receive may
                  vary depending on the social media provider concerned, but
                  will often include your name, email address, friends list, and
                  profile picture, as well as other information you choose to
                  make public on such a social media platform.
                </p>
                <p className="mb-4">
                  We will use the information we receive only for the purposes
                  that are described in this privacy notice or that are
                  otherwise made clear to you on the relevant Services. Please
                  note that we do not control, and are not responsible for,
                  other uses of your personal information by your third-party
                  social media provider. We recommend that you review their
                  privacy notice to understand how they collect, use, and share
                  your personal information, and how you can set your privacy
                  preferences on their sites and apps.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  7. HOW LONG DO WE KEEP YOUR INFORMATION?
                </h2>
                <p className="mb-4">
                  In Short: We keep your information for as long as necessary to
                  fulfil the purposes outlined in this privacy notice unless
                  otherwise required by law.
                </p>
                <p className="mb-4">
                  We will only keep your personal information for as long as it
                  is necessary for the purposes set out in this privacy notice,
                  unless a longer retention period is required or permitted by
                  law (such as tax, accounting, or other legal requirements). No
                  purpose in this notice will require us keeping your personal
                  information for longer than twelve (12) months past the
                  termination of the user's account.
                </p>
                <p className="mb-4">
                  When we have no ongoing legitimate business need to process
                  your personal information, we will either delete or anonymise
                  such information, or, if this is not possible (for example,
                  because your personal information has been stored in backup
                  archives), then we will securely store your personal
                  information and isolate it from any further processing until
                  deletion is possible.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  8. HOW DO WE KEEP YOUR INFORMATION SAFE?
                </h2>
                <p className="mb-4">
                  In Short: We aim to protect your personal information through
                  a system of organisational and technical security measures.
                </p>
                <p className="mb-4">
                  We have implemented appropriate and reasonable technical and
                  organisational security measures designed to protect the
                  security of any personal information we process. However,
                  despite our safeguards and efforts to secure your information,
                  no electronic transmission over the Internet or information
                  storage technology can be guaranteed to be 100% secure, so we
                  cannot promise or guarantee that hackers, cybercriminals, or
                  other unauthorised third parties will not be able to defeat
                  our security and improperly collect, access, steal, or modify
                  your information. Although we will do our best to protect your
                  personal information, transmission of personal information to
                  and from our Services is at your own risk. You should only
                  access the Services within a secure environment.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  9. DO WE COLLECT INFORMATION FROM MINORS?
                </h2>
                <p className="mb-4">
                  In Short: We do not knowingly collect data from or market to
                  children under 18 years of age.
                </p>
                <p className="mb-4">
                  We do not knowingly solicit data from or market to children
                  under 18 years of age. By using the Services, you represent
                  that you are at least 18 or that you are the parent or
                  guardian of such a minor and consent to such minor dependent's
                  use of the Services. If we learn that personal information
                  from users less than 18 years of age has been collected, we
                  will deactivate the account and take reasonable measures to
                  promptly delete such data from our records. If you become
                  aware of any data we may have collected from children under
                  age 18, please contact us at joshua@goloka.io.
                </p>
              </section>

              {/* <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">
                10. WHAT ARE YOUR PRIVACY RIGHTS?
              </h2>
              <p className="mb-4">
                In Short: In some regions, such as the European Economic Area
                (EEA), United Kingdom (UK), and Canada, you have rights that
                allow you greater access to and control over your personal
                information. You may review, change, or terminate your account
                at any time.
              </p>

              <div className="mb-4">
                <p>
                  In some regions (like the EEA, UK, and Canada), you have
                  certain rights under applicable data protection laws. These
                  may include the right:
                </p>
                <ul className="mt-2 list-disc pl-8">
                  <li>
                    To request access and obtain a copy of your personal
                    information
                  </li>
                  <li>To request rectification or erasure</li>
                  <li>
                    To restrict the processing of your personal information
                  </li>
                  <li>To data portability (if applicable)</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 text-xl font-semibold">
                  Account Information
                </h3>
                <p>
                  If you would at any time like to review or change the
                  information in your account or terminate your account, you
                  can:
                </p>
                <ul className="mt-2 list-disc pl-8">
                  <li>
                    Log in to your account settings and update your user
                    account.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">
                11. CONTROLS FOR DO-NOT-TRACK FEATURES
              </h2>
              <p className="mb-4">
                Most web browsers and some mobile operating systems and mobile
                applications include a Do-Not-Track ('DNT') feature or setting
                you can activate to signal your privacy preference not to have
                data about your online browsing activities monitored and
                collected. At this stage no uniform technology standard for
                recognising and implementing DNT signals has been finalised. As
                such, we do not currently respond to DNT browser signals or any
                other mechanism that automatically communicates your choice not
                to be tracked online. If a standard for online tracking is
                adopted that we must follow in the future, we will inform you
                about that practice in a revised version of this privacy notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">
                12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </h2>
              <p className="mb-4">
                In Short: Yes, if you are a resident of California, you are
                granted specific rights regarding access to your personal
                information.
              </p>

              <div className="overflow-x-auto">
                <table className="mb-4 w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">
                        Category
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Examples
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Collected
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        A. Identifiers
                      </td>
                      <td className="border border-gray-300 p-2">
                        Contact details, such as real name, alias, postal
                        address, telephone or mobile contact number, unique
                        personal identifier, online identifier, Internet
                        Protocol address, email address, and account name
                      </td>
                      <td className="border border-gray-300 p-2">YES</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        B. Personal information categories
                      </td>
                      <td className="border border-gray-300 p-2">
                        Name, contact information, education, employment,
                        employment history, and financial information
                      </td>
                      <td className="border border-gray-300 p-2">YES</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        C. Protected classification characteristics
                      </td>
                      <td className="border border-gray-300 p-2">
                        Gender and date of birth
                      </td>
                      <td className="border border-gray-300 p-2">YES</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <hr />
            <hr />
            <hr /> */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  10. WHAT ARE YOUR PRIVACY RIGHTS?
                </h2>
                <p className="mb-4">
                  In Short: In some regions, such as the European Economic Area
                  (EEA), United Kingdom (UK), and Canada, you have rights that
                  allow you greater access to and control over your personal
                  information. You may review, change, or terminate your account
                  at any time.
                </p>
                <p className="mb-4">
                  In some regions (like the EEA, UK, and Canada), you have
                  certain rights under applicable data protection laws. These
                  may include the right (i) to request access and obtain a copy
                  of your personal information, (ii) to request rectification or
                  erasure; (iii) to restrict the processing of your personal
                  information; and (iv) if applicable, to data portability. In
                  certain circumstances, you may also have the right to object
                  to the processing of your personal information. You can make
                  such a request by contacting us by using the contact details
                  provided in the section 'HOW CAN YOU CONTACT US ABOUT THIS
                  NOTICE?' below.
                </p>
                <p className="mb-4">
                  We will consider and act upon any request in accordance with
                  applicable data protection laws.
                </p>
                <p className="mb-4">
                  If you are located in the EEA or UK and you believe we are
                  unlawfully processing your personal information, you also have
                  the right to complain to your Member State data protection
                  authority or UK data protection authority.
                </p>
                <p className="mb-4">
                  If you are located in Switzerland, you may contact the Federal
                  Data Protection and Information Commissioner.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Withdrawing your consent:
                </h3>
                <p className="mb-4">
                  If we are relying on your consent to process your personal
                  information, which may be express and/or implied consent
                  depending on the applicable law, you have the right to
                  withdraw your consent at any time. You can withdraw your
                  consent at any time by contacting us by using the contact
                  details provided in the section 'HOW CAN YOU CONTACT US ABOUT
                  THIS NOTICE?' below or updating your preferences.
                </p>
                <p className="mb-4">
                  However, please note that this will not affect the lawfulness
                  of the processing before its withdrawal nor, when applicable
                  law allows, will it affect the processing of your personal
                  information conducted in reliance on lawful processing grounds
                  other than consent.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Opting out of marketing and promotional communications:
                </h3>
                <p className="mb-4">
                  You can unsubscribe from our marketing and promotional
                  communications at any time by clicking on the unsubscribe link
                  in the emails that we send, or by contacting us using the
                  details provided in the section 'HOW CAN YOU CONTACT US ABOUT
                  THIS NOTICE?' below. You will then be removed from the
                  marketing lists. However, we may still communicate with you —
                  for example, to send you service-related messages that are
                  necessary for the administration and use of your account, to
                  respond to service requests, or for other non-marketing
                  purposes.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Account Information
                </h3>
                <p className="mb-4">
                  If you would at any time like to review or change the
                  information in your account or terminate your account, you
                  can:
                </p>
                <ul className="mb-4 list-disc pl-6">
                  <li>
                    Log in to your account settings and update your user
                    account.
                  </li>
                </ul>
                <p className="mb-4">
                  Upon your request to terminate your account, we will
                  deactivate or delete your account and information from our
                  active databases. However, we may retain some information in
                  our files to prevent fraud, troubleshoot problems, assist with
                  any investigations, enforce our legal terms and/or comply with
                  applicable legal requirements.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Cookies and similar technologies:
                </h3>
                <p className="mb-4">
                  Most Web browsers are set to accept cookies by default. If you
                  prefer, you can usually choose to set your browser to remove
                  cookies and to reject cookies. If you choose to remove cookies
                  or reject cookies, this could affect certain features or
                  services of our Services. You may also opt out of
                  interest-based advertising by advertisers on our Services.
                </p>
                <p className="mb-4">
                  If you have questions or comments about your privacy rights,
                  you may email us at{" "}
                  <a href="mailto:hello@goloka.io" className="text-blue-600">
                    hello@goloka.io
                  </a>
                  .
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  11. CONTROLS FOR DO-NOT-TRACK FEATURES
                </h2>
                <p className="mb-4">
                  Most web browsers and some mobile operating systems and mobile
                  applications include a Do-Not-Track ('DNT') feature or setting
                  you can activate to signal your privacy preference not to have
                  data about your online browsing activities monitored and
                  collected. At this stage no uniform technology standard for
                  recognising and implementing DNT signals has been finalised.
                  As such, we do not currently respond to DNT browser signals or
                  any other mechanism that automatically communicates your
                  choice not to be tracked online. If a standard for online
                  tracking is adopted that we must follow in the future, we will
                  inform you about that practice in a revised version of this
                  privacy notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                </h2>
                <p className="mb-4">
                  In Short: Yes, if you are a resident of California, you are
                  granted specific rights regarding access to your personal
                  information.
                </p>
                <p className="mb-4">
                  California Civil Code Section 1798.83, also known as the
                  'Shine The Light' law, permits our users who are California
                  residents to request and obtain from us, once a year and free
                  of charge, information about categories of personal
                  information (if any) we disclosed to third parties for direct
                  marketing purposes and the names and addresses of all third
                  parties with which we shared personal information in the
                  immediately preceding calendar year. If you are a California
                  resident and would like to make such a request, please submit
                  your request in writing to us using the contact information
                  provided below.
                </p>
                <p className="mb-4">
                  If you are under 18 years of age, reside in California, and
                  have a registered account with Services, you have the right to
                  request removal of unwanted data that you publicly post on the
                  Services. To request removal of such data, please contact us
                  using the contact information provided below and include the
                  email address associated with your account and a statement
                  that you reside in California. We will make sure the data is
                  not publicly displayed on the Services, but please be aware
                  that the data may not be completely or comprehensively removed
                  from all our systems (e.g. backups, etc.).
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  CCPA Privacy Notice
                </h3>
                <p className="mb-4">
                  The California Code of Regulations defines a 'resident' as:
                </p>
                <ul className="mb-4 list-disc pl-6">
                  <li>
                    Every individual who is in the State of California for other
                    than a temporary or transitory purpose.
                  </li>
                  <li>
                    Every individual who is domiciled in the State of California
                    who is outside the State of California for a temporary or
                    transitory purpose.
                  </li>
                </ul>
                <p className="mb-4">
                  All other individuals are defined as 'non-residents'.
                </p>
                <p className="mb-4">
                  If this definition of 'resident' applies to you, we must
                  adhere to certain rights and obligations regarding your
                  personal information.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  What categories of personal information do we collect?
                </h3>
                <p className="mb-4">
                  We have collected the following categories of personal
                  information in the past twelve (12) months:
                </p>

                <div className="overflow-x-auto">
                  <table className="mb-4 w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Category</th>
                        <th className="border px-4 py-2 text-left">Examples</th>
                        <th className="border px-4 py-2 text-left">
                          Collected
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          A. Identifiers
                        </td>
                        <td className="border px-4 py-2">
                          Contact details, real name, alias, postal address,
                          etc.
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          B. Personal information categories
                        </td>
                        <td className="border px-4 py-2">
                          Name, contact information, financial information
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          C. Protected classification characteristics
                        </td>
                        <td className="border px-4 py-2">
                          Gender, date of birth
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          D. Commercial information
                        </td>
                        <td className="border px-4 py-2">
                          Transaction information, purchase history
                        </td>
                        <td className="border px-4 py-2 uppercase">NO</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          E. Biometric information
                        </td>
                        <td className="border px-4 py-2">
                          Fingerprints, voiceprints
                        </td>
                        <td className="border px-4 py-2 uppercase">NO</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          F. Internet or other similar network activity
                        </td>
                        <td className="border px-4 py-2">
                          Browsing history, search history
                        </td>
                        <td className="border px-4 py-2 uppercase">NO</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          G. Geolocation data
                        </td>
                        <td className="border px-4 py-2">Device location</td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          H. Audio, electronic, visual, thermal, olfactory, or
                          similar information
                        </td>
                        <td className="border px-4 py-2">
                          Images, audio, video recordings
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          I. Professional or employment-related information
                        </td>
                        <td className="border px-4 py-2">
                          Business contact details, work history
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          J. Education Information
                        </td>
                        <td className="border px-4 py-2">
                          Student records, directory information
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          K. Inferences drawn from other personal information
                        </td>
                        <td className="border px-4 py-2">
                          Preferences, characteristics
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">
                          L. Sensitive Personal Information
                        </td>
                        <td className="border px-4 py-2">
                          Account login, health data, biometric data
                        </td>
                        <td className="border px-4 py-2 uppercase">YES</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mb-4">
                  We will use and retain the collected personal information as
                  needed to provide the Services or for:
                </p>
                <ul className="mb-4 list-disc pl-6">
                  <li>
                    Category A - As long as the user has an account with us
                  </li>
                  <li>
                    Category B - As long as the user has an account with us
                  </li>
                  <li>
                    Category C - As long as the user has an account with us
                  </li>
                  <li>
                    Category G - As long as the user has an account with us
                  </li>
                  <li>
                    Category H - As long as the user has an account with us
                  </li>
                  <li>
                    Category I - As long as the user has an account with us
                  </li>
                  <li>
                    Category J - As long as the user has an account with us
                  </li>
                  <li>
                    Category K - As long as the user has an account with us
                  </li>
                  <li>
                    Category L - As long as the user has an account with us
                  </li>
                </ul>
              </section>

              {/* Continue with sections 13-16 following the same structure */}
              {/* <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">
                16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </h2>
              <p className="mb-4">
                Based on the applicable laws of your country, you may have the
                right to request access to the personal information we collect
                from you, change that information, or delete it. To request to
                review, update, or delete your personal information, please fill
                out and submit a data subject access request.
              </p>
            </section> */}
              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  13. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                </h2>
                <p className="mb-4">
                  In Short: Yes, if you are a resident of Virginia, you may be
                  granted specific rights regarding access to and use of your
                  personal information.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Virginia CDPA Privacy Notice
                </h3>
                <p className="mb-4">
                  Under the Virginia Consumer Data Protection Act (CDPA):
                </p>
                <ul className="mb-4 list-disc pl-6">
                  <li>
                    <strong>'Consumer'</strong> means a natural person who is a
                    resident of the Commonwealth acting only in an individual or
                    household context. It does not include a natural person
                    acting in a commercial or employment context.
                  </li>
                  <li>
                    <strong>'Personal data'</strong> means any information that
                    is linked or reasonably linkable to an identified or
                    identifiable natural person. 'Personal data' does not
                    include de-identified data or publicly available
                    information.
                  </li>
                  <li>
                    <strong>'Sale of personal data'</strong> means the exchange
                    of personal data for monetary consideration.
                  </li>
                </ul>
                <p className="mb-4">
                  If this definition 'consumer' applies to you, we must adhere
                  to certain rights and obligations regarding your personal
                  data.
                </p>
                <p className="mb-4">
                  The information we collect, use, and disclose about you will
                  vary depending on how you interact with Goloka Analytics Ltd
                  and our Services. To find out more, please visit the following
                  links:
                </p>
                <ul className="mb-4 list-disc pl-6">
                  <li>Personal data we collect</li>
                  <li>How we use your personal data</li>
                  <li>When and with whom we share your personal data</li>
                  <li>Your rights with respect to your personal data</li>
                </ul>

                <h3 className="mb-2 text-lg font-semibold">
                  Your rights under the Virginia CDPA
                </h3>
                <p className="mb-4">You have the following rights:</p>
                <ul className="mb-4 list-disc pl-6">
                  <li>
                    Right to be informed whether or not we are processing your
                    personal data
                  </li>
                  <li>Right to access your personal data</li>
                  <li>Right to correct inaccuracies in your personal data</li>
                  <li>Right to request deletion of your personal data</li>
                  <li>
                    Right to obtain a copy of the personal data you previously
                    shared with us
                  </li>
                  <li>
                    Right to opt out of the processing of your personal data if
                    it is used for targeted advertising, the sale of personal
                    data, or profiling in furtherance of decisions that produce
                    legal or similarly significant effects ('profiling')
                  </li>
                </ul>
                <p className="mb-4">
                  Goloka Analytics Ltd has not sold any personal data to third
                  parties for business or commercial purposes. Goloka Analytics
                  Ltd will not sell personal data in the future belonging to
                  website visitors, users, and other consumers.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Exercise your rights provided under the Virginia CDPA
                </h3>
                <p className="mb-4">
                  More information about our data collection and sharing
                  practices can be found in this privacy notice.
                </p>
                <p className="mb-4">
                  You may contact us by email at{" "}
                  <a href="mailto:hello@goloka.io" className="text-blue-600">
                    hello@goloka.io
                  </a>
                  , by submitting a data subject access request, or by referring
                  to the contact details at the bottom of this document.
                </p>
                <p className="mb-4">
                  If you are using an authorised agent to exercise your rights,
                  we may deny a request if the authorised agent does not submit
                  proof that they have been validly authorised to act on your
                  behalf.
                </p>

                <h3 className="mb-2 text-lg font-semibold">
                  Verification process
                </h3>
                <p className="mb-4">
                  We may request that you provide additional information
                  reasonably necessary to verify you and your consumer's
                  request. If you submit the request through an authorised
                  agent, we may need to collect additional information to verify
                  your identity before processing your request.
                </p>
                <p className="mb-4">
                  Upon receiving your request, we will respond without undue
                  delay, but in all cases, within forty-five (45) days of
                  receipt. The response period may be extended once by
                  forty-five (45) additional days when reasonably necessary. We
                  will inform you of any such extension within the initial
                  45-day response period, together with the reason for the
                  extension.
                </p>

                <h3 className="mb-2 text-lg font-semibold">Right to appeal</h3>
                <p className="mb-4">
                  If we decline to take action regarding your request, we will
                  inform you of our decision and reasoning behind it. If you
                  wish to appeal our decision, please email us at{" "}
                  <a href="mailto:hello@goloka.io" className="text-blue-600">
                    hello@goloka.io
                  </a>
                  . Within sixty (60) days of receipt of an appeal, we will
                  inform you in writing of any action taken or not taken in
                  response to the appeal, including a written explanation of the
                  reasons for the decisions. If your appeal is denied, you may
                  contact the Attorney General to submit a complaint.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  14. DO WE MAKE UPDATES TO THIS NOTICE?
                </h2>
                <p className="mb-4">
                  In Short: Yes, we will update this notice as necessary to stay
                  compliant with relevant laws.
                </p>
                <p className="mb-4">
                  We may update this privacy notice from time to time. The
                  updated version will be indicated by an updated 'Revised' date
                  and the updated version will be effective as soon as it is
                  accessible. If we make material changes to this privacy
                  notice, we may notify you either by prominently posting a
                  notice of such changes or by directly sending you a
                  notification. We encourage you to review this privacy notice
                  frequently to be informed of how we are protecting your
                  information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                </h2>
                <p className="mb-4">
                  If you have questions or comments about this notice, you may
                  contact our Data Protection Officer (DPO), Joshua Olufemi, by
                  email at{" "}
                  <a href="mailto:joshua@goloka.io" className="text-blue-600">
                    joshua@goloka.io
                  </a>
                  , or by post to:
                </p>
                <address className="mb-4 not-italic">
                  Goloka Analytics Ltd
                  <br />
                  Joshua Olufemi
                  <br />
                  34, Okotie Eboh Crescent, Utako, Abuja, FCT 900108
                  <br />
                  Abuja, Abuja Federal Capital Territory 900108
                  <br />
                  Nigeria
                </address>
                <p className="mb-4">
                  If you are a resident in the United Kingdom, the 'data
                  controller' of your personal information is Goloka Analytics
                  Ltd. Goloka Analytics Ltd has appointed Joshua Olufemi to be
                  its representative in the UK. You can contact them directly
                  regarding the processing of your information by Goloka
                  Analytics Ltd, by email at{" "}
                  <a href="mailto:joshua@goloka.io" className="text-blue-600">
                    joshua@goloka.io
                  </a>
                  , or by post to:
                </p>
                <address className="mb-4 not-italic">
                  Victoria House 126 Colmore Row
                  <br />
                  Birmingham, West Midlands B3 3AP
                  <br />
                  England
                </address>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                  FROM YOU?
                </h2>
                <p className="mb-4">
                  Based on the applicable laws of your country, you may have the
                  right to request access to the personal information we collect
                  from you, change that information, or delete it. To request to
                  review, update, or delete your personal information, please
                  fill out and submit a data subject access request.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
