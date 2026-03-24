import type { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { CaseStudyRecord, getCaseStudies } from '@/lib/db/content';
import { siteConfig } from '@/lib/seo/config';

interface CaseStudiesPageProps {
  caseStudies: CaseStudyRecord[];
}

export default function CaseStudiesPage({ caseStudies }: CaseStudiesPageProps) {
  return (
    <>
      <NextSeo
        title="Case Studies | Trendy Fashion Zone Nairobi"
        description="See real customer outcomes from Trendy Fashion Zone footwear styling, delivery, and fit consultations."
        canonical={`${siteConfig.url}/case-studies`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: caseStudies.map((study, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: study.title,
                description: study.summary || study.outcome || '',
                url: `${siteConfig.url}/case-studies#${study.slug}`,
              },
            })),
          }),
        }}
      />

      <section className="bg-gradient-to-b from-[#05070f] to-slate-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-white/60">Success Stories</p>
          <h1 className="mt-3 text-4xl font-bold">Case Studies</h1>
          <p className="mt-3 max-w-2xl text-white/80">Proof-led outcomes from our Nairobi footwear concierge and delivery workflows.</p>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {caseStudies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">No case studies published yet.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {caseStudies.map((study) => (
                <article key={study.id} id={study.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{study.client_name || 'Client Story'}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{study.title}</h2>
                  {study.summary && <p className="mt-3 text-slate-600">{study.summary}</p>}
                  {study.challenge && <p className="mt-3 text-sm text-slate-700"><strong>Challenge:</strong> {study.challenge}</p>}
                  {study.solution && <p className="mt-2 text-sm text-slate-700"><strong>Solution:</strong> {study.solution}</p>}
                  {study.outcome && <p className="mt-2 text-sm text-slate-700"><strong>Outcome:</strong> {study.outcome}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<CaseStudiesPageProps> = async () => {
  try {
    const caseStudies = await getCaseStudies(true);
    return { props: { caseStudies } };
  } catch {
    return { props: { caseStudies: [] } };
  }
};
