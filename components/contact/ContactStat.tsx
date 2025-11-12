import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface ContactStatProps {
  label: string;
  value: string;
  icon?: ReactNode;
  index?: number;
}

const ContactStat = ({ label, value, icon, index = 0 }: ContactStatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/90 backdrop-blur-lg"
    >
      {icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl text-white">
          {icon}
        </span>
      ) : null}
      <div>
        <p className="text-sm uppercase tracking-widest text-white/60">{label}</p>
        <p className="mt-1 text-2xl font-heading font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

export default ContactStat;


