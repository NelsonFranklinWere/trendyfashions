import { NextPageContext } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <>
      <NextSeo
        title={`${statusCode} Error | Trendy Fashion Zone`}
        description="An error occurred. Please try again or return to our homepage."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light/30 to-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <h1 className="text-6xl md:text-8xl font-heading font-bold text-primary mb-4">
            {statusCode || 'Error'}
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-text mb-4">
            {statusCode === 404
              ? 'Page Not Found'
              : statusCode === 500
              ? 'Server Error'
              : 'Something Went Wrong'}
          </h2>
          <p className="text-text font-body mb-8">
            {statusCode === 404
              ? "The page you're looking for doesn't exist."
              : 'We encountered an error. Please try again later.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-body font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-white font-body font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

