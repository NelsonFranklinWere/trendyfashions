"use client";

import { NextSeo } from "next-seo";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import ContactChannelCard from "@/components/contact/ContactChannelCard";
import ContactStat from "@/components/contact/ContactStat";
import SmartImage from "@/components/SmartImage";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Please enter at least 2 characters." })
    .max(80, { message: "Please keep the name under 80 characters." }),
  email: z.string().email({ message: "Enter a valid email address." }),
  whatsapp: z
    .string()
    .min(7, { message: "WhatsApp number seems too short." })
    .regex(/^[+]?\d{7,15}$/u, {
      message: "Use digits only, optionally starting with +.",
    }),
  phone: z
    .string()
    .min(7, { message: "Phone number seems too short." })
    .regex(/^[+]?\d{7,15}$/u, {
      message: "Use digits only, optionally starting with +.",
    }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(1000, { message: "Please keep the message under 1000 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const heroHighlights = [
  {
    title: "Premium men’s sneakers & officials",
    description: "Curated lines for Nairobi professionals, creatives, and sneakerheads.",
  },
  {
    title: "Same-day Nairobi delivery",
    description: "Order before 4PM and get your pair before sundown, CBD pick-up available.",
  },
  {
    title: "Personal fittings on request",
    description: "Book a fitting session in-store or request a mobile fitting concierge.",
  },
];

const contactChannels = [
  {
    icon: <span aria-hidden>💬</span>,
    title: "WhatsApp Concierge",
    description: "Instant replies from our Nairobi stylists. Share your size and style mood.",
    href: "https://wa.me/254743869564?text=Hey%20Trendy%20Fashion%20Zone%2C%20I%27m%20looking%20for%20men%27s%20shoes.",
    cta: "Tap to open WhatsApp",
    accent: "secondary" as const,
    external: true,
  },
  {
    icon: <span aria-hidden>💬</span>,
    title: "WhatsApp Support",
    description: "Alternative WhatsApp line for faster response. Available 24/7.",
    href: "https://wa.me/254792264228?text=Hey%20Trendy%20Fashion%20Zone%2C%20I%27m%20looking%20for%20men%27s%20shoes.",
    cta: "Tap to open WhatsApp",
    accent: "secondary" as const,
    external: true,
  },
  {
    icon: <span aria-hidden>📞</span>,
    title: "Call the Studio",
    description: "Speak to a stylist about sizing, drop-offs, and corporate orders.",
    href: "tel:+254743869564",
    cta: "Call +254 743 869 564",
    accent: "primary" as const,
    external: true,
  },
  {
    icon: <span aria-hidden>📍</span>,
    title: "Visit Moi Avenue",
    description: "Swing by our CBD studio. We keep limited drops for in-person shoppers.",
    href: "https://maps.app.goo.gl/qFpc8A1Q9XHmq6Q68",
    cta: "Open location on Google Maps",
    accent: "neutral" as const,
    external: true,
  },
];

const stats = [
  { label: "Average response", value: "< 10 mins", icon: <span aria-hidden>⚡</span> },
  { label: "Men’s pairs delivered", value: "6,500+", icon: <span aria-hidden>👟</span> },
  { label: "Footwear experts", value: "5 stylists", icon: <span aria-hidden>🧑‍💼</span> },
];

const Contact = () => {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus("idle");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      setSubmitStatus("success");
      reset();

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus("error");
    }
  };

  return (
    <>
      <NextSeo
        title="Nairobi Men's Footwear Concierge | Trendy Fashion Zone"
        description="Reach the Trendy Fashion Zone men's footwear team for WhatsApp styling, fittings, or premium sneaker drops in Nairobi."
        canonical="https://trendyfashionzone.co.ke/contact"
        openGraph={{
          url: "https://trendyfashionzone.co.ke/contact",
          title: "Nairobi Men's Footwear Concierge | Trendy Fashion Zone",
          description: "Premium men’s sneakers and officials in Nairobi CBD. Chat, call, or book a fitting.",
        }}
      />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#05070f] via-[#0b1120] to-[#0f172a]">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#ff8c32]/40 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#1bbfb3]/30 blur-3xl" />
        </div>

        <section className="relative px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Nairobi Men&apos;s Footwear Concierge
              </span>
              <div className="space-y-6">
                <h1 className="text-4xl font-heading font-bold text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                  Step into Nairobi&apos;s most personal men&apos;s shoe experience
                </h1>
                <p className="max-w-2xl text-lg text-white/80 sm:text-xl">
                  From boardroom classics to weekend street heat, our stylists in Moi Avenue curate the perfect pair for your city hustle. Book a fitting, drop your size, and we handle the rest.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroHighlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 text-white/80 backdrop-blur-lg"
                  >
                    <h3 className="text-base font-heading font-semibold text-white">
                      {highlight.title}
                    </h3>
                    <p className="mt-2 text-sm">{highlight.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative h-full min-h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-800">
                  <SmartImage
                    src="/images/formal/ClarksContact.jpg"
                    alt="Trendy Fashion Zone premium men's footwear display"
                    fill
                    className="object-cover rounded-3xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    shimmerWidth={900}
                    shimmerHeight={675}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/10 to-transparent pointer-events-none rounded-3xl" />
                </div>
                <div className="relative mt-6 space-y-3 text-white">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/60">Located at Moi Avenue</p>
                  <p className="text-xl font-heading font-semibold">Weekday fittings from 8am — 7pm</p>
                  <p className="text-sm text-white/70">
                    Pull up or request a concierge visit within the CBD. Nairobi deliveries hit your door in under three hours.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {contactChannels.map((channel, index) => (
              <ContactChannelCard
                key={channel.title}
                icon={channel.icon}
                title={channel.title}
                description={channel.description}
                href={channel.href}
                ctaLabel={channel.cta}
                external={channel.external}
                accent={channel.accent}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="relative bg-gradient-to-b from-white to-[#f1f5f9] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff8c32] via-[#1bbfb3] to-[#5b8def]" aria-hidden />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Book a fitting</p>
                <h2 className="text-3xl font-heading font-bold text-slate-900 sm:text-4xl">Send us your details</h2>
                <p className="max-w-xl text-slate-600">
                  Share your size, preferred style, and we&apos;ll curate a line-up ready when you arrive—or we deliver straight to you in Nairobi.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Full name
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-5 0-8 2.5-8 5.5 0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5 0-3-3-5.5-8-5.5z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="name"
                        {...register("name")}
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-12 pr-4 font-body text-slate-900 shadow-inner focus:border-[#1bbfb3] focus:outline-none focus:ring-2 focus:ring-[#1bbfb3]/30"
                        placeholder="James Mwangi"
                      />
                    </div>
                    {errors.name && (
                      <p id="name-error" className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l8 7 8-7" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-12 pr-4 font-body text-slate-900 shadow-inner focus:border-[#1bbfb3] focus:outline-none focus:ring-2 focus:ring-[#1bbfb3]/30"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="text-sm font-medium text-slate-700">
                      WhatsApp number
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                        </svg>
                      </span>
                      <input
                        type="tel"
                        id="whatsapp"
                        inputMode="tel"
                        autoComplete="tel"
                        {...register("whatsapp")}
                        aria-invalid={errors.whatsapp ? "true" : "false"}
                        aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                        className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-12 pr-4 font-body text-slate-900 shadow-inner focus:border-[#1bbfb3] focus:outline-none focus:ring-2 focus:ring-[#1bbfb3]/30"
                        placeholder="e.g. +254743869564"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Our concierge replies within minutes, 7 days a week.</p>
                    {errors.whatsapp && (
                      <p id="whatsapp-error" className="text-sm text-red-600">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Alternative phone
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 5.5C2 4.12 3.12 3 4.5 3h2.03c.54 0 1.04.29 1.32.76l1.24 2.07c.33.55.27 1.25-.15 1.72l-1.21 1.36c-.18.2-.22.49-.11.73a11.05 11.05 0 005.51 5.51c.24.11.53.07.73-.11l1.36-1.21c.47-.42 1.17-.48 1.72-.15l2.07 1.24c.47.28.76.78.76 1.32V19.5c0 1.38-1.12 2.5-2.5 2.5h-.25C9.16 22 2 14.84 2 5.75V5.5z" />
                        </svg>
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        inputMode="tel"
                        autoComplete="tel-national"
                        {...register("phone")}
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-12 pr-4 font-body text-slate-900 shadow-inner focus:border-[#1bbfb3] focus:outline-none focus:ring-2 focus:ring-[#1bbfb3]/30"
                        placeholder="Secondary contact"
                      />
                    </div>
                    {errors.phone && (
                      <p id="phone-error" className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700">
                    What can we prep for you?
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="w-full rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 font-body text-slate-900 shadow-inner focus:border-[#1bbfb3] focus:outline-none focus:ring-2 focus:ring-[#1bbfb3]/30"
                    placeholder="Tell us your size, preferred brand, colourway, or upcoming occasion."
                  />
                  {errors.message && (
                    <p id="message-error" className="text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                {submitStatus === "success" && (
                  <div
                    className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                    role="status"
                    aria-live="polite"
                  >
                    <span aria-hidden>✅</span>
                    <p>
                      Thank you! Your message has been sent. A stylist will connect within 10 minutes during business hours.
                    </p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                    aria-live="assertive"
                  >
                    <span aria-hidden>⚠️</span>
                    <p>Something went wrong. Please retry or use our WhatsApp concierge.</p>
                  </div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff8c32] px-8 py-3 text-base font-semibold text-white shadow-[0_20px_45px_-15px_rgba(255,140,50,0.75)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#ff7a12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8c32]/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
                    </svg>
                  </button>
                  <p className="text-sm text-slate-500">
                    Prefer faster? <a className="font-semibold text-[#1bbfb3] hover:underline" href="https://wa.me/254743869564?text=Hey%20Trendy%20Fashion%20Zone%2C%20I%27m%20looking%20for%20men%27s%20shoes." target="_blank" rel="noopener noreferrer">WhatsApp us</a> or <a className="font-semibold text-[#1bbfb3] hover:underline" href="https://wa.me/254792264228?text=Hey%20Trendy%20Fashion%20Zone%2C%20I%27m%20looking%20for%20men%27s%20shoes." target="_blank" rel="noopener noreferrer">+254 792 264 228</a>.
                  </p>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat, index) => (
                  <ContactStat key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} index={index} />
                ))}
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_25px_50px_-25px_rgba(15,23,42,0.35)] backdrop-blur">
                <h3 className="text-xl font-heading font-semibold text-slate-900">Signature Nairobi service</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span aria-hidden>🛵</span>
                    <span>CBD & Kilimani deliveries under 3 hours, nationwide shipping next-day.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden>🧵</span>
                    <span>Size exchanges within 48 hours — we keep your fit data on file.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden>🎯</span>
                    <span>Corporate & wedding styling available with group discounts.</span>
                  </li>
                </ul>
              </div>
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-900 p-6 text-white">
                <div className="absolute inset-0 opacity-40" aria-hidden>
                  <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#1bbfb3] blur-3xl" />
                </div>
                <div className="relative space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">What clients say</p>
                  <blockquote className="space-y-4">
                    <p className="text-lg font-medium text-white/90">
                      “These guys keep my rotation fresh. I drop a WhatsApp with a dress code and they deliver a perfect pair same day. Nairobi gents, this is the plug.”
                    </p>
                    <footer className="text-sm text-white/60">Brian K. — Westlands entrepreneur</footer>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#05070f] py-16">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[#ff8c32] blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center text-white sm:px-6">
          <span className="rounded-full border border-white/20 bg-white/10 px-5 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
            Stay in stride
          </span>
          <h2 className="text-3xl font-heading font-bold sm:text-4xl">
            Monday drop or Saturday drip — we&apos;ve got Nairobi men covered
          </h2>
          <p className="max-w-2xl text-base text-white/80">
            Book a fitting, ping us on WhatsApp, or visit the studio. We&apos;ll line up premium pairs from Nike, Adidas, Timberland, and bespoke officials tuned to your vibe.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/254792264228?text=Hey%20Trendy%20Fashion%20Zone%2C%20I%20want%20to%20book%20a%20men%27s%20fitting."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1bbfb3] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_-20px_rgba(27,191,179,0.8)] transition-transform hover:-translate-y-0.5"
              aria-label="Book a WhatsApp fitting"
            >
              Book WhatsApp fitting
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
              </svg>
            </a>
            <a
              href="tel:+254743869564"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              aria-label="Call Trendy Fashion Zone"
            >
              Call the studio
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 5.5C2 4.12 3.12 3 4.5 3h2.03c.54 0 1.04.29 1.32.76l1.24 2.07c.33.55.27 1.25-.15 1.72l-1.21 1.36c-.18.2-.22.49-.11.73a11.05 11.05 0 005.51 5.51c.24.11.53.07.73-.11l1.36-1.21c.47-.42 1.17-.48 1.72-.15l2.07 1.24c.47.28.76.78.76 1.32V19.5c0 1.38-1.12 2.5-2.5 2.5h-.25C9.16 22 2 14.84 2 5.75V5.5z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

