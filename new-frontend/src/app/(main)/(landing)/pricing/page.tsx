"use client";
import Footer from "@/components/landing-sections/footer";
import Header from "@/components/ui/header";
import { ShineBorder } from "@/components/ui/shine-borders";
import { motion } from "framer-motion";
import { Check, CornerDownRight, Target, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PrimaryButton from "@/components/ui/custom-button";
import StellarPayButton from "@/components/ui/StellarPayButton";
const BlockRollFeatures = [
  {
    id: 1,
    title: "Secure File Storage & Sharing",
    description:
      "Store and share files with complete ownership and bank-level security. Built on BlockDAG blockchain with client-side encryption.",
    features: [
      "Non-custodial storage - you own your data",
      "Client-side encryption before upload",
      "Share files by wallet address",
      "Set expiry dates and revoke access",
      "Emergency access for digital inheritance",
    ],
  },
  {
    id: 2,
    title: "Real-Time Collaboration",
    description:
      "Work with teams securely using our workspace features and real-time updates powered by WebSocket technology.",
    features: [
      "Create secure team workspaces",
      "Role-based permissions",
      "Real-time notifications",
      "Activity tracking and audit logs",
      "Multi-device session management",
    ],
  },
  {
    id: 3,
    title: "Developer SDKs & API",
    description: [
      "Integrate BlockRoll into your applications with our comprehensive SDKs and REST API.",
      "Available for React, Vue, and vanilla JavaScript with full TypeScript support.",
      <>
        Build secure file storage into any app with our{" "}
        <Link href="/developers" className="hover:underline text-[#a472ea]">
          developer tools.
        </Link>
      </>,
    ],
    features: [],
  },
];

const whySub = [
  {
    content:
      "Early access pricing - Get premium features at 50% off during our launch period",
  },
  {
    content:
      "Bank-level security (95/100 rating) with 20+ enterprise security features",
  },
  {
    content:
      "AI-powered WhatsApp support bot available 24/7 for all premium users",
  },
  {
    content: "True data ownership - your files, your keys, your control",
  },
];

const freePlanCard = {
  whatYouGetImmediately: [
    "1GB secure file storage",
    "Basic file sharing by wallet address",
    "Client-side encryption",
    "Basic workspace (up to 3 members)",
  ],
  whatYouGetAfterLaunch: [
    "Everything mentioned above",
    "Basic API access (100 requests/month)",
    "Community support",
  ],
};

const premiumPlanCard = {
  whatYouGetImmediately: [
    "Everything in free plan +",
    "100GB secure file storage",
    "Advanced sharing controls & permissions",
    "Unlimited workspaces & team members",
    "Priority API access (10,000 requests/month)",
    "AI-powered WhatsApp support bot",
    "Advanced security features & monitoring",
    "Real-time collaboration tools",
  ],
  whatYouGetAfterLaunch: [
    "Everything mentioned above",
    "Custom storage limits",
    "White-label SDK options",
    "Enterprise security compliance",
    "Dedicated support channel",
  ],
};

const Pricing = () => {
  return (
    <>
      <main className="w-full  overflow-hidden flex flex-col items-center justify-center relative">
        <Header title="Secure File Storage for Web3" />
        <div className="flex flex-col bg-[#151515]/20 backdrop-blur-xl relative w-full ">
          <div className="h-full  pv relative">
            <div className=" py-8 border-b border-[#252525]">
              <motion.h2
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  type: "spring",
                  delay: 0.4,
                }}
                className="text-center text-3xl tracking-tight font-medium"
              >
                What makes BlockRoll different?
              </motion.h2>
            </div>
            <div className=" w-full h-full flex flex-col gap-6  border-b border-[#252525]">
              <ul className="flex flex-col lg:flex-row [&>li]:w-full  [&>li]:p-6 divide-y lg:divide-y-0 lg:divide-x divide-[#252525] h-full ">
                {BlockRollFeatures.map((feature, index) => {
                  return (
                    <motion.li
                      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        type: "spring",
                        delay: 0.5 + index * 0.1,
                      }}
                      key={index}
                      className="flex flex-col gap-4 w-full flex-1 "
                    >
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-4">
                          <div className="text-6xl font-mono font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#a472ea] to-[#341e7b]">
                            {index + 1}
                          </div>
                          <h3 className="text-2xl font-medium">
                            {feature.title}
                          </h3>
                        </div>
                        {Array.isArray(feature.description) ? (
                          <div className="font-medium">
                            {feature.description.map(
                              (sentence, sentenceIndex) => (
                                <p key={sentenceIndex} className="mb-2">
                                  {sentence}
                                </p>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="font-medium">{feature.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-full h-full">
                        <ul className="flex flex-col gap-3 w-full h-full pb-8">
                          {feature.features.map((feature, index) => {
                            return (
                              <li
                                key={index}
                                className="font- text-sm flex items-center gap-4"
                              >
                                <CornerDownRight className="size-4 flex-shrink-0 text-[#a472ea]" />
                                {feature}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="h-full  relative ">
            <div className="py-8 border-b border-[#252525]">
              <motion.h2
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  type: "spring",
                  delay: 0.8,
                }}
                className="text-center text-3xl tracking-tight font-medium"
              >
                Why choose BlockRoll Premium?
              </motion.h2>
            </div>
            <div className="w-full border-b border-[#252525]">
              <div className="w-full max-w-2xl mx-auto border-b lg:border-b-0 lg:border-x border-[#252525] p-6 font-medium space-y-2 ">
                {whySub.map((sub, index) => {
                  return (
                    <motion.p
                      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        type: "spring",
                        delay: 0.9 + index * 0.1,
                      }}
                      key={index}
                      className="flex items-center gap-4"
                    >
                      <Target className="size-5 flex-shrink-0 text-[#a472ea]" />
                      {sub.content}
                    </motion.p>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative border-b border-[#252525] lg:pb-10">
            <div className="flex flex-col gap-5 lg:gap-10 py-4 bg-[#151515]/20 backdrop-blur-xl h-full relative w-full overflow-hidden  px-4 lg:px-10">
              <div className="absolute inset-0 -top-72">
                <Image
                  src="/assets/layer1.svg"
                  alt="background"
                  fill
                  className=" w-full h-full  -z-10 opacity-90"
                />
              </div>
              <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6">
                <PricingCard />
                <SecondaryPricingCard />
              </div>
            </div>
          </div>
          <TestimonialsSection />
          <div className=" border-b border-[#252525] text-center py-4 font-bold px-4">
            For any doubts or queries, feel free to ping us at{" "}
            <Link
              href="mailto:support@blockroll.io"
              className="hover:underline bg-gradient-to-b from-[#a472ea] via-[#a472ea]/80 to-[#432ba0] bg-clip-text text-transparent"
            >
              support@blockroll.io
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Pricing;

const PricingCard = () => {
  return (
    <div className="py-2">
      <div className=" border-border-primary w-full mx-auto flex h-full">
        <div className="border-dashed border-border-primary w-full lg:w-max mx-auto relative h-full">
          <div className="w-full h-full lg:w-[500px] relative overflow-hidden mx-auto py-10 pb-14 flex flex-col rounded-3xl">
            <ShineBorder shineColor={["#7150E7", "#C89BFF", "#432BA0"]} />
            <Image
              src="/assets/card_bg.svg"
              alt="background"
              fill
              className="object-cover object-bottom w-full h-full absolute -z-10"
            />
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 pb-4">
              <div className="w-12 h-12 relative">
                <Image
                  src="/assets/logo_var2.svg"
                  alt="background"
                  fill
                  className="object-cover size-full"
                />
              </div>
            </div>

            <div className="w-full border-dashed border-border-primary px-6 lg:px-10  py-4">
              <h2 className="text-6xl lg:text-[90px] lg:leading-[82px] tracking-tight font-semibold">
                Free
              </h2>
            </div>
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 py-4 ">
              <div className="">
                <Link href="/dashboard/home" className="cursor-pointer z-30">
                  <PrimaryButton classname="w-full">
                    <Terminal />
                    Get Started
                  </PrimaryButton>
                </Link>
              </div>
            </div>
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 py-4 flex flex-col gap-4 flex-1">
              <h2 className="text-lg lg:text-xl tracking-tight text-left font-bold">
                What you get immediately:
              </h2>
              <div className="space-y-3 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-medium">
                {freePlanCard.whatYouGetImmediately.map((item, index) => {
                  return (
                    <p key={index}>
                      <Check className="w-5 flex-shrink-0" strokeWidth={4} />{" "}
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 py-4 flex flex-col gap-4 h-[244px]">
              <h2 className="text-lg lg:text-xl tracking-tight text-left font-bold">
                What you get after the launch:
              </h2>
              <div className="space-y-3 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-medium">
                {freePlanCard.whatYouGetAfterLaunch.map((item, index) => {
                  return (
                    <p key={index}>
                      <Check className="w-5 flex-shrink-0" strokeWidth={4} />{" "}
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="bg-white mix-blend-plus-lighter absolute h-[100px] w-full blur-[50px] right-0 -bottom-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecondaryPricingCard = () => {
  return (
    <div className="py-2">
      <div className=" border-border-primary w-full mx-auto flex h-full">
        <div className="border-dashed border-border-primary w-full lg:w-max mx-auto relative h-full">
          <div className=" w-full lg:w-[500px] relative overflow-hidden mx-auto py-10 pb-14 flex flex-col h-full rounded-3xl">
            <ShineBorder shineColor={["#7150E7", "#C89BFF", "#432BA0"]} />
            <Image
              src="/assets/card_bg.svg"
              alt="background"
              fill
              className="object-cover object-bottom w-full h-full absolute -z-10"
            />
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 pb-4">
              <div className="w-12 h-12 relative">
                <Image
                  src="/assets/logo_var2.svg"
                  alt="background"
                  fill
                  className="object-cover size-full"
                />
              </div>
            </div>

            <div className="w-full border-dashed border-border-primary px-6 lg:px-10  py-4">
              <h2 className="text-6xl lg:text-[90px] lg:leading-[82px] tracking-tight font-semibold">
                $99 <span className="text-4xl">/ year</span>
              </h2>
            </div>
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 py-4 flex flex-col gap-3">
              <Link
                target="_blanko"
                href="https://pages.razorpay.com/pl_R6WHnm15Fm98fI/view"
                className="cursor-pointer z-30"
              >
                <PrimaryButton classname="w-full max-w-[500px] mx-auto font-semibold">
                  Get Premium
                </PrimaryButton>
              </Link>
              <StellarPayButton classname="w-full max-w-[500px] mx-auto font-semibold" />
            </div>
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 py-4 flex flex-col gap-4 flex-1">
              <h2 className="text-lg lg:text-xl tracking-tight text-left font-bold">
                What you get immediately:
              </h2>
              <div className="space-y-3 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-medium">
                {premiumPlanCard.whatYouGetImmediately.map((item, index) => {
                  return (
                    <p key={index}>
                      <Check className="w-5 flex-shrink-0" strokeWidth={4} />{" "}
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="w-full border-dashed border-border-primary px-6 lg:px-10 py-4 flex flex-col gap-4">
              <h2 className="text-lg lg:text-xl tracking-tight text-left font-bold">
                What you get after the launch:
              </h2>
              <div className="space-y-3 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-medium">
                {premiumPlanCard.whatYouGetAfterLaunch.map((item, index) => {
                  return (
                    <p key={index}>
                      <Check className="w-5 flex-shrink-0" strokeWidth={4} />{" "}
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="bg-white mix-blend-plus-lighter absolute h-[100px] w-full blur-[50px] right-0 -bottom-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PremiumTestimonialCard = ({
  username = "Username",
  showPremium = true,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xl">{username}</p>
      {showPremium && (
        <div className="bg-gradient-to-b from-[#ad84e7] via-[#986cd6] to-[#432d8e] bg-clip-text text-transparent">
          <p className="">BlockRoll Premium</p>
        </div>
      )}
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      username: "Sarah Chen",
      content:
        "BlockRoll Premium has revolutionized how our team handles sensitive documents. The bank-level security gives us peace of mind, and the real-time collaboration features make remote work seamless. The AI support bot is incredibly helpful - it's like having a security expert available 24/7. The non-custodial approach means we truly own our data, which is crucial for our legal practice.",
      column: 1,
    },
    {
      id: 2,
      username: "Marcus Rodriguez",
      content:
        "As a healthcare provider, data security is paramount. BlockRoll's client-side encryption and audit logs help us maintain HIPAA compliance while providing our patients with secure document sharing. The emergency access feature is brilliant for continuity of care. Highly recommend for any healthcare organization.",
      column: 1,
    },
    {
      id: 3,
      username: "Alex Thompson",
      content: (
        <div className="space-y-3 text-pretty">
          <p>
            BlockRoll Premium has been a game-changer for our startup. Here's
            why it stands out:
          </p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              True data ownership - no vendor lock-in, we control our files
              completely
            </li>
            <li>
              The SDK integration was seamless - our developers had it working
              in under an hour
            </li>
            <li>
              Real-time notifications keep our team synchronized without
              constant checking
            </li>
            <li>
              The workspace permissions system is incredibly granular and secure
            </li>
            <li>
              Customer support via WhatsApp bot is surprisingly effective and
              always available
            </li>
            <li>
              The pricing is fair for enterprise-grade security and features
            </li>
            <li>
              Perfect for our Web3 startup - aligns with our decentralized
              values
            </li>
          </ul>
        </div>
      ),
      column: 2,
    },
    {
      id: 4,
      username: "Dr. Emily Watson",
      content:
        "The emergency access feature saved our research project when our lead researcher was unavailable. BlockRoll's security features are exactly what we needed for our confidential medical research data. Excellent platform!",
      column: 3,
    },
    {
      id: 5,
      username: "James Park",
      content:
        "We migrated from Google Drive to BlockRoll and couldn't be happier. The client-side encryption means our sensitive client documents are never exposed to third parties. The team collaboration features are intuitive, and the audit logs provide the compliance trail we need. The Web3 integration fits perfectly with our blockchain consulting business.",
      column: 3,
    },
  ];

  const groupedTestimonials = {
    1: testimonials.filter((t) => t.column === 1),
    2: testimonials.filter((t) => t.column === 2),
    3: testimonials.filter((t) => t.column === 3),
  };

  return (
    <div className=" text-white ">
      <Header title="What our Premium customers say about us" />
      <div className="border-b  border-[#252525] w-full min-h-[80dvh] grid grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-2 flex flex-col font-medium divide-y divide-[#252525]">
          {groupedTestimonials[1].map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 lg:p-10 flex flex-col gap-6"
            >
              <PremiumTestimonialCard username={testimonial.username} />
              <div className="text-pretty">
                {typeof testimonial.content === "string"
                  ? testimonial.content
                  : testimonial.content}
              </div>
            </div>
          ))}
        </div>

        <div className="h-full border-y lg:border-x lg:border-y-0 border-[#252525] p-6 lg:p-10 mx-auto flex flex-col gap-6 flex-shrink-0 lg:col-span-3 font-medium">
          {groupedTestimonials[2].map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col gap-6">
              <PremiumTestimonialCard username={testimonial.username} />
              <div>
                {typeof testimonial.content === "string"
                  ? testimonial.content
                  : testimonial.content}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 flex flex-col font-medium divide-y divide-[#252525]">
          {groupedTestimonials[3].map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 lg:p-10 flex flex-col gap-6"
            >
              <PremiumTestimonialCard username={testimonial.username} />
              <div className="text-pretty">
                {typeof testimonial.content === "string"
                  ? testimonial.content
                  : testimonial.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
