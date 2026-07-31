'use client';

import { ReactNode } from 'react';
import { trackMetaMessaging } from '@/lib/analytics/meta';

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  source?: string;
};

export default function WhatsAppTrackLink({ href, className, children, source = 'whatsapp' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackMetaMessaging(source)}
    >
      {children}
    </a>
  );
}
