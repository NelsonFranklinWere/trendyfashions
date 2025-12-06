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
      className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-slate-900 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.2)] backdrop-blur"
    >
      {icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff8c32] to-[#ff7a12] text-2xl text-white shadow-lg">
          {icon}
        </span>
      ) : null}
      <div>
        <p className="text-sm uppercase tracking-widest text-slate-600">{label}</p>
        <p className="mt-1 text-2xl font-heading font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
};

export default ContactStat;


