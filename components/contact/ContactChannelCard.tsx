import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ReactNode } from 'react';

const linkMotionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export interface ContactChannelCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  accent?: 'primary' | 'secondary' | 'neutral';
  external?: boolean;
  index?: number;
}

const accentClassMap: Record<NonNullable<ContactChannelCardProps['accent']>, string> = {
  primary: 'border-primary/40 bg-primary/10 text-white',
  secondary: 'border-secondary/50 bg-secondary/10 text-white',
  neutral: 'border-white/20 bg-white/10 text-white/80',
};

const ContactChannelCard = ({
  icon,
  title,
  description,
  href,
  ctaLabel,
  accent = 'neutral',
  external = false,
  index = 0,
}: ContactChannelCardProps) => {
  const baseClasses = `relative flex flex-col gap-4 rounded-2xl border ${accentClassMap[accent]} p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(11,14,25,0.7)]`;

  const content = (
    <motion.div
      variants={linkMotionVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className={baseClasses}
    >
      <div className="flex items-center gap-3 text-xl text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
          {icon}
        </span>
        <div>
          <h3 className="text-lg font-heading font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </div>
      </div>
      <span className="inline-flex items-center text-sm font-semibold tracking-wide text-white/90">
        {ctaLabel}
        <svg
          className="ml-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
        </svg>
      </span>
    </motion.div>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ctaLabel}
        className="block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ctaLabel} className="block">
      {content}
    </Link>
  );
};

export default ContactChannelCard;


