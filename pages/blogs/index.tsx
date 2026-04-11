import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { getBlogPosts, BlogPostRecord } from '@/lib/db/content';
import { siteConfig, blogsIndexSeo } from '@/lib/seo/config';

interface BlogsPageProps {
  posts: BlogPostRecord[];
}

export default function BlogsPage({ posts }: BlogsPageProps) {
  return (
    <>
      <NextSeo
        title={blogsIndexSeo.title}
        description={blogsIndexSeo.description}
        canonical={`${siteConfig.url}/blogs`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Trendy Fashion Zone Most Trusted Blog',
            url: `${siteConfig.url}/blogs`,
            blogPost: posts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              url: `${siteConfig.url}/blogs#${post.slug}`,
              datePublished: post.created_at,
              dateModified: post.updated_at,
              description: post.excerpt || post.content.slice(0, 160),
            })),
          }),
        }}
      />

      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-white/60">Insights</p>
          <h1 className="mt-3 text-4xl font-bold">Most Trusted Blog for Cool, Original Shoes</h1>
          <p className="mt-3 max-w-2xl text-white/80">Explore bespoke varieties, professional styling advice, and footwear care insights built for Nairobi shoppers.</p>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">No blog posts published yet.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} id={post.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{post.excerpt || post.content.slice(0, 140)}</p>
                  <p className="mt-3 text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  <Link href="/contact" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
                    Talk to our team
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BlogsPageProps> = async () => {
  try {
    const posts = await getBlogPosts(true);
    return { props: { posts } };
  } catch {
    return { props: { posts: [] } };
  }
};
